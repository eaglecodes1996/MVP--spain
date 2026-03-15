import 'dotenv/config';
import mongoose from 'mongoose';
import { Faq } from '../models/Faq.js';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/solvesnap';

const defaultFaqs = [
  { question: 'How do I ask a homework question?', answer: 'Use the AI chat on the Home or Learn page. Type your question or pick Math, Science or English and hit send.', category: 'general', order: 0 },
  { question: 'What subjects are supported?', answer: 'SolveSnap covers Math, Science and English. More subjects can be added later.', category: 'general', order: 1 },
  { question: 'Is there a rate limit on the AI?', answer: 'Yes. The AI chat is rate-limited per IP to keep the service fair. If you hit the limit, wait a minute and try again.', category: 'technical', order: 0 },
  { question: 'How do I unlock the games portal?', answer: 'Use the calculator on the Home page and enter the 4-digit code 2012.', category: 'general', order: 2 },
  { question: 'How do I get support?', answer: 'Use the Support page: in-page live chat, email ticket, or search the FAQ.', category: 'general', order: 3 },
];

async function seed() {
  await mongoose.connect(uri);
  await Faq.deleteMany({});
  await Faq.insertMany(defaultFaqs);
  console.log('FAQ seed done.');
  await mongoose.disconnect();
}

seed().catch((e) => { console.error(e); process.exit(1); });
