#!/usr/bin/env node

const { config, requiredForScripts, requireEnvVars } = require('./config');
const NotionClient = require('./clients/notion');
const LinearClient = require('./clients/linear');
const AutomationLogger = require('./lib/logger');
const { mapTaskPage } = require('./lib/notion');
const {
  mapNotionStatusToLinear,
  mapNotionPriorityToLinear,
  formatRichText,
} = require('./lib/mappers');

requireEnvVars(requiredForScripts.notionToLinear);

const invertMapping = (object = {}) =>
  Object.entries(object || {}).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});

const productIdToSlug = invertMapping(config.mappings.productRelations);

const ensureArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const fetchTasks = async (notion, databaseId, lookbackHours) => {
  const results = [];
  let cursor;
  const filter =
    lookbackHours > 0
      ? {
          timestamp: 'last_edited_time',
          last_edited_time: {
            after: new Date(Date.now() - lookbackHours * 60 * 60 * 1000).toISOString(),
          },
        }
      : undefined;

  do {
    const payload = {
      page_size: 50,
    };
    if (cursor) payload.start_cursor = cursor;
    if (filter) payload.filter = filter;
    const response = await notion.queryDatabase(databaseId, payload);
    results.push(...response.results.map(mapTaskPage));
    cursor = response.has_more ? response.next_cursor : null;
  } while (cursor);

  return results;
};

const deriveTeamId = (task) => {
  const productSlug = task.productIds
    .map((id) => productIdToSlug[id])
    .find((slug) => Boolean(slug));

  return config.linear.teamByProduct[productSlug] || config.linear.teamByProduct.default;
};

const deriveAssigneeId = (task) => {
  if (!task.assigneeNames || task.assigneeNames.length === 0) return null;
  const primaryAssignee = task.assigneeNames[0];
  return config.linear.assigneeMap[primaryAssignee] || null;
};

const buildIssueDescription = (task) => {
  const lines = [];
  if (task.description) lines.push(task.description);
  lines.push(`Source: Notion Task (${task.pageId})`);
  if (task.projectIds?.length) lines.push(`Project Relations: ${task.projectIds.join(', ')}`);
  if (task.productIds?.length) lines.push(`Product Relations: ${task.productIds.join(', ')}`);
  if (task.dueDate) lines.push(`Due Date: ${task.dueDate}`);
  return lines.join('\n\n');
};

const hasProperty = (task, name) => Boolean(task.raw?.properties?.[name]);

const syncTaskToLinear = async ({ task, linear, notion, dryRun, cache }) => {
  const summary = {
    created: 0,
    updated: 0,
    closed: 0,
    skipped: 0,
    warnings: [],
  };

  const teamId = deriveTeamId(task);
  if (!teamId) {
    summary.skipped += 1;
    summary.warnings.push(`Missing Linear team mapping for task "${task.name}"`);
    return summary;
  }

  const assigneeId = deriveAssigneeId(task);
  const stateId = mapNotionStatusToLinear(task.status, config.linear.stateMap);
  const priority = mapNotionPriorityToLinear(task.priority, config.linear.priorityMap);

  if (!task.linearIssueId) {
    if (dryRun) {
      summary.created += 1;
      return summary;
    }
    const issue = await linear.createIssue({
      title: task.name,
      description: buildIssueDescription(task),
      teamId,
      assigneeId,
      priority,
      dueDate: task.dueDate,
      stateId,
    });

    cache.set(issue.identifier, issue);

    const properties = {
      'Linear Issue ID': formatRichText(issue.identifier),
    };

    if (hasProperty(task, 'Linear Issue URL')) {
      properties['Linear Issue URL'] = { url: issue.url };
    }

    await notion.updatePage(task.pageId, { properties });

    summary.created += 1;
    return summary;
  }

  const identifier = task.linearIssueId.trim();
  let issue = cache.get(identifier);
  if (!issue && !dryRun) {
    issue = await linear.issueByIdentifier(identifier).catch(() => null);
    if (!issue) {
      summary.warnings.push(`Linear issue "${identifier}" not found for task "${task.name}"`);
      summary.skipped += 1;
      return summary;
    }
    cache.set(identifier, issue);
  }

  if (dryRun || !issue) {
    summary.updated += 1;
    return summary;
  }

  const updateInput = {};
  if (stateId && issue.state?.id !== stateId) {
    updateInput.stateId = stateId;
  }
  if (priority && issue.priority !== priority) {
    updateInput.priority = priority;
  }
  if (assigneeId && issue.assignee?.id !== assigneeId) {
    updateInput.assigneeId = assigneeId;
  }
  if (task.dueDate && issue.dueDate !== task.dueDate) {
    updateInput.dueDate = task.dueDate;
  }
  if (task.name && task.name !== issue.title) {
    updateInput.title = task.name;
  }
  const description = buildIssueDescription(task);
  if (description && issue.description !== description) {
    updateInput.description = description;
  }

  if (Object.keys(updateInput).length > 0) {
    await linear.updateIssue(issue.id, updateInput);
    summary.updated += 1;
  } else {
    summary.skipped += 1;
  }

  if (stateId && ['done', 'completed', 'canceled'].includes(stateId)) {
    summary.closed += 1;
  }

  return summary;
};

const aggregateSummaries = (items) =>
  items.reduce(
    (acc, item) => {
      Object.entries(item).forEach(([key, value]) => {
        if (typeof value === 'number') acc[key] = (acc[key] || 0) + value;
        if (Array.isArray(value)) acc[key] = (acc[key] || []).concat(value);
      });
      return acc;
    },
    { created: 0, updated: 0, closed: 0, skipped: 0, warnings: [] }
  );

const run = async (options = {}) => {
  const dryRun = options.dryRun ?? config.dryRun;
  const notion = new NotionClient({ apiKey: config.notion.apiKey });
  const linear = new LinearClient({ apiKey: config.linear.apiKey });
  const logger = new AutomationLogger({
    filePath: config.automation.logFile,
    timezone: config.timezone,
  });

  const tasks = await fetchTasks(notion, config.notion.taskDatabaseId, config.automation.lookbackHours);
  const cache = new Map();
  const summaries = [];

  for (const task of tasks) {
    const summary = await syncTaskToLinear({ task, linear, notion, dryRun, cache });
    summaries.push(summary);
  }

  const totals = aggregateSummaries(summaries);
  totals.totalTasksExamined = tasks.length;
  totals.dryRun = dryRun;

  await logger.log('notion-to-linear', totals);
  console.log(`[notion-to-linear] ${JSON.stringify(totals, null, 2)}`);
  return totals;
};

if (require.main === module) {
  run().catch((error) => {
    console.error('[notion-to-linear] Failed:', error);
    process.exitCode = 1;
  });
}

module.exports = { run };

