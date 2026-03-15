import rateLimit from 'express-rate-limit';

const windowMs = Number(process.env.AI_RATE_LIMIT_WINDOW_MS) || 60 * 1000;
const max = Number(process.env.AI_RATE_LIMIT_MAX) || 30;

export const aiChatRateLimiter = rateLimit({
  windowMs,
  max,
  message: { error: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});
