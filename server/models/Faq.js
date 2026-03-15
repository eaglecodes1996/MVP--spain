import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, enum: ['general', 'math', 'science', 'english', 'billing', 'technical'], default: 'general' },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

faqSchema.index({ question: 'text', answer: 'text' });
faqSchema.index({ category: 1, order: 1 });

export const Faq = mongoose.model('Faq', faqSchema);
