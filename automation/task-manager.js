#!/usr/bin/env node

const { config, requiredForScripts, requireEnvVars } = require('./config');
const NotionClient = require('./clients/notion');
const LinearClient = require('./clients/linear');
const AutomationLogger = require('./lib/logger');
const { mapTaskPage } = require('./lib/notion');
const { formatRelation } = require('./lib/mappers');

requireEnvVars(requiredForScripts.taskManager);

const normalize = (value) => (value || '').toLowerCase();

const PRIORITY_RANK = {
  P0: 0,
  'P0 - Critical': 0,
  P1: 1,
  'P1 - High': 1,
  P2: 2,
  'P2 - Medium': 2,
  P3: 3,
  'P3 - Low': 3,
};

const fetchOpenTasks = async (notion, databaseId) => {
  const tasks = [];
  let cursor;
  do {
    const response = await notion.queryDatabase(databaseId, {
      page_size: 50,
      filter: {
        and: [
          {
            property: 'Status',
            status: {
              does_not_equal: 'Done',
            },
          },
        ],
      },
      start_cursor: cursor || undefined,
    });
    tasks.push(...response.results.map(mapTaskPage));
    cursor = response.has_more ? response.next_cursor : null;
  } while (cursor);
  return tasks;
};

const getPriorityRank = (priority) =>
  PRIORITY_RANK[priority] ?? PRIORITY_RANK[priority?.toUpperCase()] ?? 5;

const determineCurrentAgent = (task, rosterSet) => {
  if (!task.assigneeNames || task.assigneeNames.length === 0) return null;
  const match = task.assigneeNames.find((name) => rosterSet.has(normalize(name)));
  return match || null;
};

const assignTask = async ({
  task,
  agent,
  notion,
  linear,
  dryRun,
  linearCache,
  summary,
}) => {
  const notionAssigneeId = config.mappings.assigneeRelations[agent];
  const linearAssigneeId = config.linear.assigneeMap[agent];

  if (!notionAssigneeId) {
    summary.warnings.push(`Missing Notion relation ID for agent "${agent}"`);
    return false;
  }

  if (!dryRun) {
    await notion.updatePage(task.pageId, {
      properties: {
        Assignee: formatRelation([notionAssigneeId]),
      },
    });
  }

  if (task.linearIssueId && linearAssigneeId) {
    if (dryRun) {
      summary.linearUpdates += 1;
    } else {
      let issue = linearCache.get(task.linearIssueId);
      if (!issue) {
        issue = await linear.issueByIdentifier(task.linearIssueId).catch(() => null);
        if (issue) linearCache.set(task.linearIssueId, issue);
      }
      if (issue && issue.assignee?.id !== linearAssigneeId) {
        await linear.updateIssue(issue.id, { assigneeId: linearAssigneeId });
        summary.linearUpdates += 1;
      }
    }
  }

  return true;
};

const run = async (options = {}) => {
  const dryRun = options.dryRun ?? config.dryRun;
  const notion = new NotionClient({ apiKey: config.notion.apiKey });
  const linear = new LinearClient({ apiKey: config.linear.apiKey });
  const logger = new AutomationLogger({
    filePath: config.automation.logFile,
    timezone: config.timezone,
  });

  const roster = config.automation.agentRoster;
  const rosterSet = new Set(roster.map(normalize));
  const tasks = await fetchOpenTasks(notion, config.notion.taskDatabaseId);

  const workload = {};
  roster.forEach((agent) => {
    workload[agent] = {
      total: 0,
      tasks: [],
    };
  });

  const needsAssignment = [];

  tasks.forEach((task) => {
    const agent = determineCurrentAgent(task, rosterSet);
    if (!agent) {
      needsAssignment.push(task);
      return;
    }
    if (!workload[agent]) {
      workload[agent] = { total: 0, tasks: [] };
    }
    workload[agent].total += 1;
    workload[agent].tasks.push(task);
  });

  // Rebalance overloaded agents
  roster.forEach((agent) => {
    const agentLoad = workload[agent];
    if (!agentLoad) return;
    while (agentLoad.total > config.automation.agentTaskLimit) {
      const sorted = agentLoad.tasks.sort((a, b) => getPriorityRank(b.priority) - getPriorityRank(a.priority));
      const taskToReassign = sorted.shift();
      if (!taskToReassign) break;
      agentLoad.total -= 1;
      needsAssignment.push(taskToReassign);
    }
  });

  needsAssignment.sort((a, b) => getPriorityRank(a.priority) - getPriorityRank(b.priority));

  const summary = {
    reassigned: 0,
    newlyAssigned: 0,
    linearUpdates: 0,
    warnings: [],
    totalOpenTasks: tasks.length,
    needsAssignment: needsAssignment.length,
  };

  const linearCache = new Map();

  for (const task of needsAssignment) {
    const sortedAgents = roster
      .map((agent) => ({
        agent,
        load: workload[agent]?.total ?? 0,
      }))
      .sort((a, b) => a.load - b.load);

    const selected = sortedAgents.find(
      (entry) => entry.load < config.automation.agentTaskLimit
    ) || sortedAgents[0];

    if (!selected) {
      summary.warnings.push(`No available agent for task "${task.name}"`);
      continue;
    }

    const result = await assignTask({
      task,
      agent: selected.agent,
      notion,
      linear,
      dryRun,
      linearCache,
      summary,
    });

    if (result) {
      workload[selected.agent].total += 1;
      workload[selected.agent].tasks.push(task);
      if (task.assigneeNames && task.assigneeNames.length > 0) {
        summary.reassigned += 1;
      } else {
        summary.newlyAssigned += 1;
      }
    }
  }

  const loggerPayload = {
    ...summary,
    dryRun,
    workload: Object.fromEntries(
      roster.map((agent) => [agent, workload[agent]?.total ?? 0])
    ),
  };

  await logger.log('task-manager', loggerPayload);
  console.log(`[task-manager] ${JSON.stringify(loggerPayload, null, 2)}`);
  return loggerPayload;
};

if (require.main === module) {
  run().catch((error) => {
    console.error('[task-manager] Failed:', error);
    process.exitCode = 1;
  });
}

module.exports = { run };

