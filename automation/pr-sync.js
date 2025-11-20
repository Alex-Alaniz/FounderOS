#!/usr/bin/env node

const { config, requiredForScripts, requireEnvVars } = require('./config');
const NotionClient = require('./clients/notion');
const LinearClient = require('./clients/linear');
const GithubClient = require('./clients/github');
const AutomationLogger = require('./lib/logger');
const { loadTasksByLinearId } = require('./lib/notion');
const {
  extractLinearIdentifiers,
  formatRichText,
  formatSelect,
} = require('./lib/mappers');

requireEnvVars(requiredForScripts.prSync);

const PRODUCT_NAME_BY_SLUG = {
  bearo: 'BEARO',
  alphabuilder: 'AlphaBuilder',
  primape: 'Primape',
  chimpanion: 'Chimpanion',
  founderos: 'FounderOS',
};

const determineProductFromBranch = (branch) => {
  if (!branch) return null;
  const normalized = branch.toLowerCase();
  return Object.keys(PRODUCT_NAME_BY_SLUG).find((slug) => normalized.includes(slug));
};

const determinePrStatus = (pr) => {
  if (pr.mergedAt) return 'Merged';
  if (pr.state === 'closed') return 'Closed';
  if (pr.draft) return 'Draft';
  if (pr.labels?.includes('needs-review')) return 'Needs Review';
  return 'Open';
};

const prStatusToNotionTaskStatus = (status) => {
  switch (status) {
    case 'Merged':
      return 'Done';
    case 'Needs Review':
    case 'Open':
      return 'In Review';
    case 'Draft':
      return 'In Spec';
    case 'Closed':
    default:
      return 'Backlog';
  }
};

const prStatusToLinearState = (status) => {
  switch (status) {
    case 'Merged':
      return config.linear.stateMap.Done || config.linear.stateMap.Completed || config.linear.stateMap['Done'];
    case 'Needs Review':
      return config.linear.stateMap['In Review'] || config.linear.stateMap['Review'];
    case 'Open':
      return (
        config.linear.stateMap['In Progress'] ||
        config.linear.stateMap['Ready for Dev'] ||
        config.linear.stateMap.Ready ||
        config.linear.stateMap.Backlog
      );
    case 'Draft':
      return config.linear.stateMap['In Spec'] || config.linear.stateMap['Backlog'];
    case 'Closed':
    default:
      return config.linear.stateMap.Backlog || config.linear.stateMap['Backlog'];
  }
};

const createPropertyGuards = (databaseSchema) => {
  const props = databaseSchema?.properties || {};
  const titleProperty = Object.entries(props).find(([, value]) => value.type === 'title')?.[0];
  return {
    title: titleProperty,
    has: (name) => Boolean(props[name]),
    typeOf: (name) => props[name]?.type,
  };
};

const buildPrProperties = (pr, status, productName, guards) => {
  const properties = {};

  if (guards.title) {
    properties[guards.title] = {
      title: [
        {
          type: 'text',
          text: { content: pr.title },
        },
      ],
    };
  }

  if (guards.has('PR Number')) {
    properties['PR Number'] = {
      number: pr.number,
    };
  }

  if (guards.has('Branch')) {
    properties.Branch = formatRichText(pr.headRef || '');
  }

  if (guards.has('Author')) {
    properties.Author = formatRichText(pr.author || 'unknown');
  }

  if (guards.has('Status')) {
    const statusType = guards.typeOf('Status');
    properties.Status = formatSelect(status, statusType);
  }

  if (guards.has('URL')) {
    properties.URL = { url: pr.url };
  }

  if (guards.has('Related Product') && productName) {
    properties['Related Product'] = formatSelect(productName);
  }

  if (guards.has('Opened At')) {
    properties['Opened At'] = { date: { start: pr.createdAt } };
  }

  if (guards.has('Last Updated')) {
    properties['Last Updated'] = { date: { start: pr.updatedAt } };
  }

  if (guards.has('Merged At') && pr.mergedAt) {
    properties['Merged At'] = { date: { start: pr.mergedAt } };
  }

  return properties;
};

const findPrPage = async (notion, databaseId, prNumber) => {
  const response = await notion.queryDatabase(databaseId, {
    filter: {
      property: 'PR Number',
      number: { equals: prNumber },
    },
    page_size: 1,
  }).catch(() => null);

  if (response?.results?.length) return response.results[0];
  return null;
};

const upsertPrPage = async ({ notion, databaseId, guards, pr, status, productName, dryRun }) => {
  const properties = buildPrProperties(pr, status, productName, guards);
  const existing = await findPrPage(notion, databaseId, pr.number);

  if (dryRun) return existing ? 'updated' : 'created';

  if (existing) {
    await notion.updatePage(existing.id, { properties });
    return 'updated';
  }

  const parent = { database_id: databaseId };
  await notion.createPage({ parent, properties });
  return 'created';
};

const updateLinkedTasksAndIssues = async ({
  identifiers,
  status,
  prUrl,
  notion,
  linear,
  tasksByLinearId,
  dryRun,
  issueCache,
}) => {
  const results = {
    notionUpdated: 0,
    linearUpdated: 0,
  };

  for (const identifier of identifiers) {
    const task = tasksByLinearId[identifier];

    if (task) {
      const updates = {};
      const targetStatus = prStatusToNotionTaskStatus(status);
      if (task.raw?.properties?.Status && task.status !== targetStatus) {
        updates.Status = formatSelect(targetStatus, task.statusType || 'status');
      }

      if (task.raw?.properties?.Completed && status === 'Merged') {
        updates.Completed = { checkbox: true };
      }

      if (task.raw?.properties?.['GitHub PR']) {
        updates['GitHub PR'] = formatRichText(prUrl);
      }

      if (Object.keys(updates).length && !dryRun) {
        await notion.updatePage(task.pageId, { properties: updates });
        results.notionUpdated += 1;
      } else if (Object.keys(updates).length) {
        results.notionUpdated += 1;
      }
    }

    const targetLinearState = prStatusToLinearState(status);
    if (!targetLinearState) continue;

    if (dryRun) {
      results.linearUpdated += 1;
      continue;
    }

    let issue = issueCache.get(identifier);
    if (!issue) {
      issue = await linear.issueByIdentifier(identifier).catch(() => null);
      if (issue) issueCache.set(identifier, issue);
    }

    if (!issue || issue.state?.id === targetLinearState) continue;

    try {
      await linear.updateIssue(issue.id, { stateId: targetLinearState });
      results.linearUpdated += 1;
    } catch (error) {
      // swallow but track warning count upstream if needed
    }
  }

  return results;
};

const run = async (options = {}) => {
  const dryRun = options.dryRun ?? config.dryRun;
  const notion = new NotionClient({ apiKey: config.notion.apiKey });
  const linear = new LinearClient({ apiKey: config.linear.apiKey });
  const github = new GithubClient({
    token: config.github.token,
    repository: config.github.repository,
    perPage: config.github.perPage,
    maxPages: config.github.maxPages,
  });
  const logger = new AutomationLogger({
    filePath: config.automation.logFile,
    timezone: config.timezone,
  });

  const [databaseSchema, prs, taskMap] = await Promise.all([
    notion.retrieveDatabase(config.notion.githubDatabaseId),
    github.listPullRequests({ state: 'all' }),
    loadTasksByLinearId(notion, config.notion.taskDatabaseId),
  ]);

  const guards = createPropertyGuards(databaseSchema);

  const summary = {
    created: 0,
    updated: 0,
    linkedNotionUpdates: 0,
    linkedLinearUpdates: 0,
    processed: prs.length,
    warnings: [],
  };

  const issueCache = new Map();

  for (const pr of prs) {
    const status = determinePrStatus(pr);
    const productSlug = determineProductFromBranch(pr.headRef);
    const productName = productSlug ? PRODUCT_NAME_BY_SLUG[productSlug] : null;
    try {
      const action = await upsertPrPage({
        notion,
        databaseId: config.notion.githubDatabaseId,
        guards,
        pr,
        status,
        productName,
        dryRun,
      });
      summary[action] += 1;
    } catch (error) {
      summary.warnings.push(`Failed to upsert PR #${pr.number}: ${error.message}`);
    }

    const identifiers = extractLinearIdentifiers(
      `${pr.title} ${pr.body || ''} ${pr.headRef || ''}`
    );
    if (!identifiers.length) continue;

    const linkResults = await updateLinkedTasksAndIssues({
      identifiers,
      status,
      prUrl: pr.url,
      notion,
      linear,
      tasksByLinearId: taskMap,
      dryRun,
      issueCache,
    });

    summary.linkedNotionUpdates += linkResults.notionUpdated;
    summary.linkedLinearUpdates += linkResults.linearUpdated;
  }

  await logger.log('pr-sync', { ...summary, dryRun });
  console.log(`[pr-sync] ${JSON.stringify(summary, null, 2)}`);
  return summary;
};

if (require.main === module) {
  run().catch((error) => {
    console.error('[pr-sync] Failed:', error);
    process.exitCode = 1;
  });
}

module.exports = { run };

