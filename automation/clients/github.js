const { ensureFetch } = require('../lib/http');

class GithubClient {
  constructor({ token, repository, perPage = 50, maxPages = 2 }) {
    if (!token) throw new Error('GitHub token is required');
    if (!repository) throw new Error('GitHub repository (owner/repo) is required');

    this.token = token;
    this.repository = repository;
    this.perPage = perPage;
    this.maxPages = maxPages;
    const [owner, repo] = repository.split('/');
    this.owner = owner;
    this.repo = repo;
  }

  async listPullRequests({ state = 'all', perPage, maxPages } = {}) {
    const fetchFn = await ensureFetch();
    const perPageValue = perPage || this.perPage;
    const maxPagesValue = maxPages || this.maxPages;
    const results = [];

    for (let page = 1; page <= maxPagesValue; page += 1) {
      const url = new URL(
        `https://api.github.com/repos/${this.owner}/${this.repo}/pulls`
      );
      url.searchParams.set('state', state);
      url.searchParams.set('per_page', perPageValue);
      url.searchParams.set('page', page);

      const response = await fetchFn(url, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'User-Agent': 'founder-os-automation',
          Accept: 'application/vnd.github+json',
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`GitHub PR fetch failed: ${response.status} ${text}`);
      }

      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) break;

      results.push(
        ...data.map((pr) => ({
          id: pr.id,
          number: pr.number,
          title: pr.title,
          body: pr.body,
          state: pr.state,
          draft: pr.draft,
          mergedAt: pr.merged_at,
          createdAt: pr.created_at,
          updatedAt: pr.updated_at,
          closedAt: pr.closed_at,
          url: pr.html_url,
          headRef: pr.head?.ref,
          baseRef: pr.base?.ref,
          author: pr.user?.login,
          labels: pr.labels?.map((label) => label.name) ?? [],
        }))
      );
    }

    return results;
  }
}

module.exports = GithubClient;

