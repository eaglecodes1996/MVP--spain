import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { aiChatRateLimiter } from '../middleware/rateLimit.js';
import { sanitizeUserInput } from '../middleware/sanitize.js';
import { chat } from '../config/ai.js';

const router = Router();

const defaultSystem = `You are SolveSnap AI, a warm friendly homework tutor. Cover Math, Science and English. Be concise (max 4 sentences when possible). Use emojis occasionally. If the user specifies a subject, tailor your explanation to that subject. Analyze homework photos if given and explain or solve what you see.`;

router.post(
  '/chat',
  aiChatRateLimiter,
  [
    body('messages').isArray().withMessage('messages must be an array'),
    body('messages.*.role').isIn(['user', 'assistant', 'system']).withMessage('invalid role'),
    body('messages.*.content').optional().custom((v) => v === undefined || typeof v === 'string' || Array.isArray(v)),
    body('subject').optional().isIn(['math', 'science', 'english']).withMessage('invalid subject'),
    body('systemPrompt').optional().isString(),
    body('imageBase64').optional().isString(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { messages, subject, systemPrompt, imageBase64 } = req.body;
      const sys = systemPrompt || defaultSystem + (subject ? ` Focus on subject: ${subject}.` : '');
      let sanitized = messages.map((m) => ({
        ...m,
        content: typeof m.content === 'string' ? sanitizeUserInput(m.content) : m.content,
      }));
      if (imageBase64 && sanitized.length > 0) {
        const last = sanitized[sanitized.length - 1];
        if (last.role === 'user' && typeof last.content === 'string') {
          const text = last.content.trim() || 'What do you see in this homework image? Explain or solve it.';
          sanitized = [
            ...sanitized.slice(0, -1),
            {
              role: 'user',
              content: [
                { type: 'text', text: sanitizeUserInput(text) },
                { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
              ],
            },
          ];
        }
      }
      const reply = await chat(sanitized, sys, 520);
      res.json({ reply });
    } catch (err) {
      console.error('AI chat error:', err);
      const msg = err.message || 'AI service error';
      res.status(500).json({ error: msg });
    }
  }
);

export { router as aiRouter };
