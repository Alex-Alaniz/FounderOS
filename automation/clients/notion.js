const { httpRequest } = require('../lib/http');

class NotionClient {
  constructor({ apiKey, notionVersion = '2022-06-28' }) {
    if (!apiKey) throw new Error('Notion API key is required');
    this.apiKey = apiKey;
    this.notionVersion = notionVersion;
    this.baseUrl = 'https://api.notion.com/v1';
  }

  async request(path, { method = 'GET', body, headers = {} } = {}) {
    const url = `${this.baseUrl}${path}`;
    const requestOptions = {
      method,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Notion-Version': this.notionVersion,
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (body !== undefined) {
      requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    return httpRequest(url, requestOptions);
  }

  async queryDatabase(databaseId, payload = {}) {
    return this.request(`/databases/${databaseId}/query`, {
      method: 'POST',
      body: payload,
    });
  }

  async retrieveDatabase(databaseId) {
    return this.request(`/databases/${databaseId}`, {
      method: 'GET',
    });
  }

  async updatePage(pageId, payload) {
    return this.request(`/pages/${pageId}`, {
      method: 'PATCH',
      body: payload,
    });
  }

  async createPage(payload) {
    return this.request('/pages', {
      method: 'POST',
      body: payload,
    });
  }

  async search(payload) {
    return this.request('/search', {
      method: 'POST',
      body: payload,
    });
  }
}

module.exports = NotionClient;

