/**
 * Configurable API base. Change VITE_API_URL to point to your backend;
 * AI provider is configured on the server (env AI_PROVIDER).
 */
const API_BASE = import.meta.env.VITE_API_URL || '';

export function apiUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}/api${p}`;
}

export async function fetchApi(path, options = {}) {
  const url = apiUrl(path);
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || err.message || res.statusText);
  }
  return res.json();
}

export function postApi(path, body) {
  return fetchApi(path, { method: 'POST', body: JSON.stringify(body) });
}

export function getApi(path) {
  return fetchApi(path, { method: 'GET' });
}
