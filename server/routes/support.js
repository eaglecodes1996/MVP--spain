import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import { sanitizeUserInput } from '../middleware/sanitize.js';
import { SupportTicket } from '../models/SupportTicket.js';
import { Faq } from '../models/Faq.js';

const router = Router();

router.post(
  '/tickets',
  [
    body('email').isEmail(),
    body('subject').isString().trim().notEmpty().isLength({ max: 200 }),
    body('message').isString().trim().notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const ticket = await SupportTicket.create({
        email: req.body.email,
        subject: sanitizeUserInput(req.body.subject),
        message: sanitizeUserInput(req.body.message),
      });
      res.status(201).json({ id: ticket._id, status: ticket.status });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create ticket' });
    }
  }
);

router.get('/faq', async (req, res) => {
  try {
    const category = req.query.category;
    const filter = category ? { category } : {};
    const faqs = await Faq.find(filter).sort({ category: 1, order: 1 }).lean();
    res.json(faqs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch FAQ' });
  }
});

router.get('/faq/search', [query('q').isString().trim().notEmpty()], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const q = req.query.q;
    let faqs;
    try {
      faqs = await Faq.find({ $text: { $search: q } })
        .sort({ score: { $meta: 'textScore' } })
        .limit(20)
        .lean();
    } catch {
      faqs = await Faq.find({
        $or: [
          { question: new RegExp(q, 'i') },
          { answer: new RegExp(q, 'i') },
        ],
      }).limit(20).lean();
    }
    res.json(faqs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

export { router as supportRouter };
