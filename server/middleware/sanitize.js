import sanitizeHtml from 'sanitize-html';

const allowed = {
  allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'code', 'pre'],
  allowedAttributes: { a: ['href'] },
  allowedSchemes: ['https', 'http'],
};

export function sanitizeUserInput(dirty) {
  if (typeof dirty !== 'string') return '';
  return sanitizeHtml(dirty.trim(), allowed);
}

export function sanitizePlain(dirty) {
  if (typeof dirty !== 'string') return '';
  return sanitizeHtml(dirty.trim(), { allowedTags: [], allowedAttributes: {} });
}
