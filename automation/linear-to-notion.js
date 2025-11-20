#!/usr/bin/env node

const { config, requiredForScripts, requireEnvVars } = require('./config');
const NotionClient = require('./clients/notion');
const LinearClient = require('./clients/linear');
const AutomationLogger = require('./lib/logger');
const { loadTasksByLinearId } = require('./lib/notion');
const {
  mapLinearStateToNotion,
  mapLinearPriorityToNotion,
  formatSelect,
  formatRelation,
  formatRichText,
  formatTitle,
} = require('./lib/mappers');

requireEnvVars(requiredForScripts.linearToNotion);

const invert = (object = {}) =>
  Object.entries(object || {}).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});

const linearStateReverseMap = invert(config.linear.stateMap);
const linearPriorityReverseMap = invert(config.linear.priorityMap);

const fetchLinearIssues = async (linear, lookbackHours) => {
  const issues = [];
  let after;
  const filter =
    lookbackHours > 0
      ? {
          updatedAt: {
            gt: new Date(Date.now() - lookbackHours * 60 * 60 * 1000).toISOString(),
          },
        }
      : {};

  do {
    const data = await linear.listIssues({ filter, first: 50, after });
    issues.push(...(data.issues?.nodes || []));
    after = data.issues?.pageInfo?.hasNextPage ? data.issues.pageInfo.endCursor : null;
  } while (after);

  return issues;
};

const deriveProductRelations = (labels = []) =>
  labels
    .map((label) => {
      if (!label?.name) return null;
      if (!label.name.startsWith('product:')) return null;
      const slug = label.name.split(':')[1];
      return config.mappings.productRelations[slug];
    })
    .filter(Boolean);

const mapAssigneeRelation = (issue) => {
  if (!issue.assignee?.name) return null;
  return config.mappings.assigneeRelations[issue.assignee.name] || null;
};

const buildCreatePayload = (issue, targetStatus, targetPriority, productRelations, assigneeRelation) => {
  const properties = {
    Name: formatTitle(`[${issue.identifier}] ${issue.title}`),
    'Linear Issue ID': formatRichText(issue.identifier),
  };

  if (targetStatus) properties.Status = formatSelect(targetStatus, 'status');
  if (targetPriority) properties.Priority = formatSelect(targetPriority);
  if (issue.dueDate) properties['Due Date'] = { date: { start: issue.dueDate } };
  if (productRelations.length) properties.Product = formatRelation(productRelations);
  if (assigneeRelation) properties.Assignee = formatRelation([assigneeRelation]);

  return {
    parent: { database_id: config.notion.taskDatabaseId },
    properties,
  };
};

const diffAndBuildUpdates = (task, issue, targetStatus, targetPriority, productRelations, assigneeRelation) => {
  const updates = {};

  if (targetStatus && task.status !== targetStatus) {
    updates.Status = formatSelect(targetStatus, task.statusType || 'status');
  }

  if (targetPriority && task.priority !== targetPriority) {
    updates.Priority = formatSelect(targetPriority, task.priorityType || 'select');
  }

  if (issue.dueDate && task.dueDate !== issue.dueDate) {
    updates['Due Date'] = { date: { start: issue.dueDate } };
  }

  if (task.linearIssueId !== issue.identifier) {
    updates['Linear Issue ID'] = formatRichText(issue.identifier);
  }

  if (productRelations.length) {
    const current = (task.productIds || []).sort().join(',');
    const incoming = productRelations.sort().join(',');
    if (current !== incoming) {
      updates.Product = formatRelation(productRelations);
    }
  }

  if (assigneeRelation) {
    const current = (task.assigneeIds || [])[0];
    if (current !== assigneeRelation) {
      updates.Assignee = formatRelation([assigneeRelation]);
    }
  }

  return updates;
};

const run = async (options = {}) => {
  const dryRun = options.dryRun ?? config.dryRun;
  const notion = new NotionClient({ apiKey: config.notion.apiKey });
  const linear = new LinearClient({ apiKey: config.linear.apiKey });
  const logger = new AutomationLogger({
    filePath: config.automation.logFile,
    timezone: config.timezone,
  });

  const [issues, taskMap] = await Promise.all([
    fetchLinearIssues(linear, config.automation.lookbackHours),
    loadTasksByLinearId(notion, config.notion.taskDatabaseId),
  ]);

  const summary = {
    created: 0,
    updated: 0,
    upToDate: 0,
    skipped: 0,
    warnings: [],
    totalIssues: issues.length,
  };

  for (const issue of issues) {
    const targetStatus =
      mapLinearStateToNotion(issue.state?.id, linearStateReverseMap) ||
      mapLinearStateToNotion(issue.state?.name, linearStateReverseMap);
    const targetPriority = mapLinearPriorityToNotion(issue.priority, linearPriorityReverseMap);
    const productRelations = deriveProductRelations(issue.labels?.nodes || []);
    const assigneeRelation = mapAssigneeRelation(issue);
    const existingTask = taskMap[issue.identifier];

    if (!existingTask && dryRun) {
      summary.created += 1;
      continue;
    }

    if (!existingTask) {
      try {
        const payload = buildCreatePayload(
          issue,
          targetStatus,
          targetPriority,
          productRelations,
          assigneeRelation
        );
        if (!dryRun) await notion.createPage(payload);
        summary.created += 1;
      } catch (error) {
        summary.warnings.push(`Failed to create Notion task for ${issue.identifier}: ${error.message}`);
      }
      continue;
    }

    const updates = diffAndBuildUpdates(
      existingTask,
      issue,
      targetStatus,
      targetPriority,
      productRelations,
      assigneeRelation
    );

    if (Object.keys(updates).length === 0) {
      summary.upToDate += 1;
      continue;
    }

    if (!dryRun) {
      try {
        await notion.updatePage(existingTask.pageId, { properties: updates });
        summary.updated += 1;
      } catch (error) {
        summary.warnings.push(`Failed to update Notion task ${existingTask.pageId}: ${error.message}`);
      }
    } else {
      summary.updated += 1;
    }
  }

  await logger.log('linear-to-notion', { ...summary, dryRun });
  console.log(`[linear-to-notion] ${JSON.stringify(summary, null, 2)}`);
  return summary;
};

if (require.main === module) {
  run().catch((error) => {
    console.error('[linear-to-notion] Failed:', error);
    process.exitCode = 1;
  });
}

module.exports = { run };

