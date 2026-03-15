import { Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { sanitizeUserInput } from '../middleware/sanitize.js';
import { ForumPost } from '../models/ForumPost.js';

const router = Router();

router.get(
  '/',
  [query('subject').optional().isIn(['math', 'science', 'english', 'other'])],
  async (req, res) => {
    try {
      const filter = req.query.subject ? { subject: req.query.subject } : {};
      const posts = await ForumPost.find(filter).sort({ updatedAt: -1 }).limit(100).lean();
      res.json(posts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  }
);

router.get('/search', [query('q').isString().trim().notEmpty()], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const q = req.query.q;
    let posts;
    try {
      posts = await ForumPost.find({ $text: { $search: q } }).sort({ score: { $meta: 'textScore' } }).limit(30).lean();
    } catch {
      posts = await ForumPost.find({
        $or: [
          { title: new RegExp(q, 'i') },
          { body: new RegExp(q, 'i') },
        ],
      }).sort({ updatedAt: -1 }).limit(30).lean();
    }
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

router.get('/:id', [param('id').isMongoId()], async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id).lean();
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

router.post(
  '/',
  [
    body('title').isString().trim().notEmpty().isLength({ max: 200 }),
    body('body').isString().trim().notEmpty(),
    body('author').optional().isString().trim().isLength({ max: 80 }),
    body('subject').optional().isIn(['math', 'science', 'english', 'other']),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const { title, body, author, subject } = req.body;
      const post = await ForumPost.create({
        title: sanitizeUserInput(title),
        body: sanitizeUserInput(body),
        author: sanitizeUserInput(author || 'Anonymous'),
        subject: subject || 'other',
      });
      res.status(201).json(post);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create post' });
    }
  }
);

router.post(
  '/:id/replies',
  [
    param('id').isMongoId(),
    body('body').isString().trim().notEmpty(),
    body('author').optional().isString().trim().isLength({ max: 80 }),
    body('subject').optional().isIn(['math', 'science', 'english', 'other']),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const post = await ForumPost.findById(req.params.id);
      if (!post) return res.status(404).json({ error: 'Post not found' });
      post.replies.push({
        body: sanitizeUserInput(req.body.body),
        author: sanitizeUserInput(req.body.author || 'Anonymous'),
        subject: req.body.subject || 'other',
      });
      post.updatedAt = new Date();
      await post.save();
      res.json(post);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to add reply' });
    }
  }
);

export { router as forumRouter };
