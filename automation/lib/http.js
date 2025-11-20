let cachedFetch = null;

const ensureFetch = async () => {
  if (cachedFetch) return cachedFetch;

  if (typeof globalThis.fetch === 'function') {
    cachedFetch = globalThis.fetch.bind(globalThis);
    return cachedFetch;
  }

  try {
    const { default: nodeFetch } = await import('node-fetch');
    cachedFetch = nodeFetch;
    return cachedFetch;
  } catch (error) {
    throw new Error(
      'Fetch API is unavailable. Run on Node.js 18+ or install the "node-fetch" dependency.'
    );
  }
};

const httpRequest = async (url, options = {}) => {
  const fetchFn = await ensureFetch();
  const response = await fetchFn(url, options);
  const text = await response.text();

  if (!response.ok) {
    const snippet = text.slice(0, 500);
    throw new Error(`HTTP ${response.status} ${response.statusText}: ${snippet}`);
  }

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (error) {
    return text;
  }
};

module.exports = {
  ensureFetch,
  httpRequest,
};

