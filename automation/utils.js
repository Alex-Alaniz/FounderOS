#!/usr/bin/env node

/**
 * Shared utilities for FounderOS automation scripts
 * Provides API clients and helper functions for Notion, Linear, and GitHub
 */

require('dotenv').config({ path: '.env.local' });

// API Configuration
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'BearifiedCo';
const GITHUB_REPO = process.env.GITHUB_REPO || 'FounderOS';

// Notion Database IDs (from Step 2 architecture)
const NOTION_DATABASES = {
  TASKS: '15d0e156-c881-4c12-8d9b-b2c8371d5acc',
  PROJECTS: 'b6436b6f-a21b-4b8e-a797-8c8af805881b',
  PRODUCTS: '3b67dfdd-81fc-4f7c-acce-9e0e3572b620',
  TEAM: 'b0110392-b769-474b-b296-8c9a9d2da066',
};

// Linear Team ID (default team)
const LINEAR_TEAM_ID = process.env.LINEAR_TEAM_ID || 'default-team-id';

// Agent names for task assignment
const AGENTS = ['Composer', 'Codex', 'Claude', 'Gemini'];
const MAX_TASKS_PER_AGENT = 3;

/**
 * Notion API Client
 */
class NotionClient {
  constructor() {
    if (!NOTION_API_KEY) {
      throw new Error('NOTION_API_KEY environment variable is required');
    }
    this.apiKey = NOTION_API_KEY;
    this.baseUrl = 'https://api.notion.com/v1';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Notion API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async queryDatabase(databaseId, filter = {}) {
    const results = [];
    let cursor = undefined;

    do {
      const response = await this.request(`/databases/${databaseId}/query`, {
        method: 'POST',
        body: JSON.stringify({
          filter,
          start_cursor: cursor,
        }),
      });

      results.push(...response.results);
      cursor = response.next_cursor;
    } while (cursor);

    return results;
  }

  async createPage(databaseId, properties) {
    return this.request('/pages', {
      method: 'POST',
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties,
      }),
    });
  }

  async updatePage(pageId, properties) {
    return this.request(`/pages/${pageId}`, {
      method: 'PATCH',
      body: JSON.stringify({ properties }),
    });
  }

  async getPage(pageId) {
    return this.request(`/pages/${pageId}`);
  }
}

/**
 * Linear API Client
 */
class LinearClient {
  constructor() {
    if (!LINEAR_API_KEY) {
      throw new Error('LINEAR_API_KEY environment variable is required');
    }
    this.apiKey = LINEAR_API_KEY;
    this.apiUrl = 'https://api.linear.app/graphql';
  }

  async request(query, variables = {}) {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.apiKey,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Linear API error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(`Linear GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    return data.data;
  }

  async getIssues(filter = {}) {
    const query = `
      query GetIssues($filter: IssueFilter) {
        issues(filter: $filter, first: 100) {
          nodes {
            id
            identifier
            title
            description
            state {
              id
              name
              type
            }
            priority
            assignee {
              id
              name
              email
            }
            project {
              id
              name
            }
            labels {
              nodes {
                id
                name
              }
            }
            dueDate
            createdAt
            updatedAt
            url
          }
        }
      }
    `;

    const data = await this.request(query, { filter });
    return data.issues.nodes;
  }

  async createIssue(input) {
    const mutation = `
      mutation CreateIssue($input: IssueCreateInput!) {
        issueCreate(input: $input) {
          success
          issue {
            id
            identifier
            title
            url
          }
        }
      }
    `;

    const data = await this.request(mutation, { input });
    return data.issueCreate.issue;
  }

  async updateIssue(id, input) {
    const mutation = `
      mutation UpdateIssue($id: String!, $input: IssueUpdateInput!) {
        issueUpdate(id: $id, input: $input) {
          success
          issue {
            id
            identifier
            state {
              name
            }
          }
        }
      }
    `;

    const data = await this.request(mutation, { id, input });
    return data.issueUpdate.issue;
  }

  async getTeams() {
    const query = `
      query GetTeams {
        teams {
          nodes {
            id
            name
            key
          }
        }
      }
    `;

    const data = await this.request(query);
    return data.teams.nodes;
  }

  async getStates(teamId) {
    const query = `
      query GetStates($filter: WorkflowStateFilter) {
        workflowStates(filter: $filter) {
          nodes {
            id
            name
            type
          }
        }
      }
    `;

    const data = await this.request(query, {
      filter: { team: { id: { eq: teamId } } },
    });
    return data.workflowStates.nodes;
  }
}

/**
 * GitHub API Client
 */
class GitHubClient {
  constructor() {
    if (!GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN environment variable is required');
    }
    this.token = GITHUB_TOKEN;
    this.owner = GITHUB_OWNER;
    this.repo = GITHUB_REPO;
    this.baseUrl = 'https://api.github.com';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GitHub API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async getPullRequests(state = 'open') {
    return this.request(`/repos/${this.owner}/${this.repo}/pulls?state=${state}`);
  }

  async getPullRequest(number) {
    return this.request(`/repos/${this.owner}/${this.repo}/pulls/${number}`);
  }

  async getPullRequestFiles(number) {
    return this.request(`/repos/${this.owner}/${this.repo}/pulls/${number}/files`);
  }
}

/**
 * Logger utility
 */
class Logger {
  constructor(logFile) {
    this.logFile = logFile;
    this.logs = [];
  }

  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const entry = {
      timestamp,
      level,
      message,
      ...data,
    };

    this.logs.push(entry);
    console.log(`[${timestamp}] [${level}] ${message}`, data);
  }

  info(message, data) {
    this.log('INFO', message, data);
  }

  error(message, data) {
    this.log('ERROR', message, data);
  }

  warn(message, data) {
    this.log('WARN', message, data);
  }

  success(message, data) {
    this.log('SUCCESS', message, data);
  }

  async save() {
    const fs = require('fs').promises;
    const path = require('path');
    
    const logDir = path.dirname(this.logFile);
    await fs.mkdir(logDir, { recursive: true });

    const content = this.logs.map(log => JSON.stringify(log)).join('\n');
    await fs.appendFile(this.logFile, content + '\n');
  }
}

/**
 * Helper: Map Notion status to Linear state
 */
function mapNotionStatusToLinearState(notionStatus) {
  const mapping = {
    'To Do': 'backlog',
    'In Progress': 'in progress',
    'In Review': 'in review',
    'Done': 'done',
    'Canceled': 'canceled',
  };
  return mapping[notionStatus] || 'backlog';
}

/**
 * Helper: Map Linear state to Notion status
 */
function mapLinearStateToNotionStatus(linearState) {
  const mapping = {
    'backlog': 'To Do',
    'todo': 'To Do',
    'in progress': 'In Progress',
    'in review': 'In Review',
    'done': 'Done',
    'canceled': 'Canceled',
  };
  return mapping[linearState?.toLowerCase()] || 'To Do';
}

/**
 * Helper: Map Notion priority to Linear priority
 */
function mapNotionPriorityToLinear(notionPriority) {
  const mapping = {
    'Urgent': 1,
    'High': 2,
    'Medium': 3,
    'Low': 4,
  };
  return mapping[notionPriority] || null;
}

/**
 * Helper: Map Linear priority to Notion priority
 */
function mapLinearPriorityToNotion(linearPriority) {
  const mapping = {
    1: 'Urgent',
    2: 'High',
    3: 'Medium',
    4: 'Low',
  };
  return mapping[linearPriority] || 'Medium';
}

/**
 * Helper: Extract Linear issue ID from Notion property
 */
function extractLinearIssueId(notionProperty) {
  if (!notionProperty || !notionProperty.rich_text) return null;
  const text = notionProperty.rich_text[0]?.plain_text || '';
  // Extract Linear issue identifier (e.g., "FOS-123")
  const match = text.match(/([A-Z]+-\d+)/);
  return match ? match[1] : null;
}

/**
 * Helper: Extract GitHub PR URL from Notion property
 */
function extractGitHubPRUrl(notionProperty) {
  if (!notionProperty || !notionProperty.url) return null;
  return notionProperty.url;
}

module.exports = {
  NotionClient,
  LinearClient,
  GitHubClient,
  Logger,
  NOTION_DATABASES,
  LINEAR_TEAM_ID,
  AGENTS,
  MAX_TASKS_PER_AGENT,
  mapNotionStatusToLinearState,
  mapLinearStateToNotionStatus,
  mapNotionPriorityToLinear,
  mapLinearPriorityToNotion,
  extractLinearIssueId,
  extractGitHubPRUrl,
};

