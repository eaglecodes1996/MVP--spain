import { getApi, postApi } from './config.js';

export function createTicket({ email, subject, message }) {
  return postApi('/support/tickets', { email, subject, message });
}

export function getFaq(category) {
  const q = category ? `?category=${category}` : '';
  return getApi(`/support/faq${q}`);
}

export function searchFaq(q) {
  return getApi(`/support/faq/search?q=${encodeURIComponent(q)}`);
}
