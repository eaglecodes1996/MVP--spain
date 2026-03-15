import mongoose from 'mongoose';

const replySchema = new mongoose.Schema(
  {
    author: { type: String, default: 'Anonymous', maxlength: 80 },
    body: { type: String, required: true },
    subject: { type: String, enum: ['math', 'science', 'english', 'other'], default: 'other' },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const forumPostSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 200 },
  body: { type: String, required: true },
  author: { type: String, default: 'Anonymous', maxlength: 80 },
  subject: { type: String, enum: ['math', 'science', 'english', 'other'], default: 'other' },
  replies: [replySchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

forumPostSchema.index({ subject: 1, createdAt: -1 });
forumPostSchema.index({ title: 'text', body: 'text' });

export const ForumPost = mongoose.model('ForumPost', forumPostSchema);
