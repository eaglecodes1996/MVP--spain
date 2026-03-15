import { Router } from 'express';
import { validateCalculatorInput } from '../middleware/validateCalculator.js';

const router = Router();

const SUBJECTS = [
  { id: 'math', name: 'Math', icon: '📐', description: 'Algebra, geometry, calculus and more' },
  { id: 'science', name: 'Science', icon: '🔬', description: 'Physics, chemistry, biology' },
  { id: 'english', name: 'English', icon: '📖', description: 'Grammar, literature, writing' },
];

router.get('/', (_, res) => res.json(SUBJECTS));

router.post('/calculator-validate', (req, res) => {
  const { value } = req.body || {};
  const result = validateCalculatorInput(value);
  res.json(result);
});

export { router as subjectsRouter };
