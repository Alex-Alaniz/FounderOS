const path = require('node:path');

const DEFAULT_LINEAR_STATUS_MAP = {
  Todo: 'backlog',
  'To Do': 'backlog',
  Backlog: 'backlog',
  'In Spec': 'triage',
  'Ready for Dev': 'ready',
  Ready: 'ready',
  'In Progress': 'inProgress',
  Progress: 'inProgress',
  Blocked: 'blocked',
  'In Review': 'inReview',
  Review: 'inReview',
  Done: 'done',
  Completed: 'done',
  Complete: 'done',
  Archived: 'canceled',
  Canceled: 'canceled',
};

const DEFAULT_LINEAR_PRIORITY_MAP = {
  P0: 1,
  'P0 - Critical': 1,
  P1: 2,
  'P1 - High': 2,
  P2: 3,
  'P2 - Medium': 3,
  P3: 4,
  'P3 - Low': 4,
  Low: 4,
  Medium: 3,
  High: 2,
  Critical: 1,
};

const DEFAULT_AGENT_LIST = ['Composer', 'Codex', 'Claude', 'Gemini'];

const parseJSON = (value, fallback) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn(`[automation/config] Failed to parse JSON value. Using fallback. Error: ${error.message}`);
    return fallback;
  }
};

const toInteger = (value, defaultValue) => {
  if (value === undefined || value === null) return defaultValue;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

const config = {
  agentName: process.env.FOUNDEROS_AGENT || 'Codex',
  timezone: process.env.AUTOMATION_TZ || 'UTC',
  dryRun: process.env.AUTOMATION_DRY_RUN === 'true',
  notion: {
    apiKey: process.env.NOTION_API_KEY,
    taskDatabaseId: process.env.NOTION_TASK_DB_ID,
    githubDatabaseId: process.env.NOTION_GITHUB_DB_ID,
    linearDatabaseId: process.env.NOTION_LINEAR_DB_ID,
    executionLogDatabaseId: process.env.NOTION_AUTOMATION_LOG_DB_ID,
    productsDatabaseId: process.env.NOTION_PRODUCTS_DB_ID,
    teamDatabaseId: process.env.NOTION_TEAM_DB_ID,
    rateLimitPerSecond: toInteger(process.env.NOTION_RATE_LIMIT, 3),
  },
  linear: {
    apiKey: process.env.LINEAR_API_KEY,
    teamByProduct: parseJSON(process.env.LINEAR_TEAM_BY_PRODUCT, {
      bearo: 'BEAR',
      alphabuilder: 'ALPHA',
      primape: 'PRIM',
      chimpanion: 'CHIMP',
      founderos: 'FOS',
    }),
    stateMap: parseJSON(process.env.LINEAR_STATE_MAP, DEFAULT_LINEAR_STATUS_MAP),
    priorityMap: parseJSON(process.env.LINEAR_PRIORITY_MAP, DEFAULT_LINEAR_PRIORITY_MAP),
    assigneeMap: parseJSON(process.env.LINEAR_ASSIGNEE_MAP || process.env.LINEAR_USER_BY_AGENT, {}),
    labelMap: parseJSON(process.env.LINEAR_LABEL_MAP, {
      Composer: 'agent:composer',
      Codex: 'agent:codex',
      Claude: 'agent:claude',
      Gemini: 'agent:gemini',
    }),
  },
  github: {
    token: process.env.GITHUB_TOKEN,
    repository: process.env.GITHUB_REPOSITORY || process.env.GITHUB_REPO || 'BearifiedCo/FounderOS',
    perPage: toInteger(process.env.GITHUB_PR_PAGE_SIZE, 50),
    maxPages: toInteger(process.env.GITHUB_PR_MAX_PAGES, 2),
  },
  automation: {
    logFile: process.env.AUTOMATION_LOG_FILE || path.join(process.cwd(), 'logs', 'automation-daily.md'),
    agentTaskLimit: toInteger(process.env.AUTOMATION_MAX_TASKS_PER_AGENT, 3),
    staleThresholdHours: toInteger(process.env.AUTOMATION_STALE_HOURS, 48),
    lookbackHours: toInteger(process.env.AUTOMATION_LOOKBACK_HOURS, 24),
    agentRoster: parseJSON(process.env.AUTOMATION_AGENT_ROSTER, DEFAULT_AGENT_LIST),
  },
  mappings: {
    productRelations: parseJSON(process.env.NOTION_PRODUCT_RELATIONS, {}),
    assigneeRelations: parseJSON(process.env.NOTION_ASSIGNEE_RELATIONS, {}),
  },
};

const requiredForScripts = {
  notionToLinear: ['NOTION_API_KEY', 'NOTION_TASK_DB_ID', 'LINEAR_API_KEY'],
  linearToNotion: ['NOTION_API_KEY', 'NOTION_TASK_DB_ID', 'LINEAR_API_KEY'],
  prSync: ['NOTION_API_KEY', 'NOTION_GITHUB_DB_ID', 'GITHUB_TOKEN'],
  taskManager: ['NOTION_API_KEY', 'NOTION_TASK_DB_ID'],
};

const requireEnvVars = (keys = []) => {
  const missing = keys.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

module.exports = {
  config,
  parseJSON,
  toInteger,
  requiredForScripts,
  requireEnvVars,
};

