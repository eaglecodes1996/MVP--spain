import { getApi, postApi } from './config.js';

export function getForumPosts(subject) {
  const q = subject ? `?subject=${subject}` : '';
  return getApi(`/forum${q}`);
}

export function searchForum(q) {
  return getApi(`/forum/search?q=${encodeURIComponent(q)}`);
}

export function getForumPost(id) {
  return getApi(`/forum/${id}`);
}

export function createPost({ title, body, author, subject }) {
  return postApi('/forum', { title, body, author: author || 'Anonymous', subject: subject || 'other' });
}

export function addReply(postId, { body, author, subject }) {
  return postApi(`/forum/${postId}/replies`, { body, author: author || 'Anonymous', subject: subject || 'other' });
}
