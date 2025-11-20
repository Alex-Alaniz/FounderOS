const { httpRequest } = require('../lib/http');

class LinearClient {
  constructor({ apiKey }) {
    if (!apiKey) throw new Error('Linear API key is required');
    this.apiKey = apiKey;
    this.endpoint = 'https://api.linear.app/graphql';
  }

  async request(query, variables = {}) {
    const response = await httpRequest(this.endpoint, {
      method: 'POST',
      headers: {
        Authorization: this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    if (response.errors) {
      const message = response.errors.map((err) => err.message).join('; ');
      throw new Error(`Linear GraphQL error: ${message}`);
    }

    return response.data;
  }

  async listIssues({ filter = {}, first = 50, after }) {
    const query = `
      query Issues($filter: IssueFilter, $first: Int, $after: String) {
        issues(filter: $filter, first: $first, after: $after) {
          nodes {
            id
            identifier
            title
            description
            priority
            dueDate
            branchName
            url
            updatedAt
            createdAt
            state {
              id
              name
              type
            }
            assignee {
              id
              name
              email
            }
            team {
              id
              name
              key
            }
            labels {
              nodes {
                id
                name
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;

    return this.request(query, { filter, first, after });
  }

  async getIssue(issueId) {
    const query = `
      query Issue($issueId: String!) {
        issue(id: $issueId) {
          id
          identifier
          title
          description
          priority
          dueDate
          branchName
          url
          updatedAt
          state {
            id
            name
            type
          }
          assignee {
            id
            name
            email
          }
          labels {
            nodes {
              id
              name
            }
          }
          team {
            id
            name
            key
          }
        }
      }
    `;

    const { issue } = await this.request(query, { issueId });
    return issue;
  }

  async issueByIdentifier(identifier) {
    const query = `
      query IssueById($identifier: String!) {
        issue(identifier: $identifier) {
          id
          identifier
          title
          description
          priority
          dueDate
          url
          updatedAt
          state {
            id
            name
            type
          }
          assignee {
            id
            name
            email
          }
        }
      }
    `;

    const { issue } = await this.request(query, { identifier });
    return issue;
  }

  async createIssue(input) {
    const mutation = `
      mutation CreateIssue($input: IssueCreateInput!) {
        issueCreate(input: $input) {
          issue {
            id
            identifier
            url
            state {
              id
              name
            }
          }
        }
      }
    `;

    const data = await this.request(mutation, { input });
    return data.issueCreate.issue;
  }

  async updateIssue(issueId, input) {
    const mutation = `
      mutation UpdateIssue($issueId: String!, $input: IssueUpdateInput!) {
        issueUpdate(id: $issueId, input: $input) {
          issue {
            id
            identifier
            state {
              id
              name
            }
            url
            priority
          }
        }
      }
    `;

    const data = await this.request(mutation, { issueId, input });
    return data.issueUpdate.issue;
  }
}

module.exports = LinearClient;

