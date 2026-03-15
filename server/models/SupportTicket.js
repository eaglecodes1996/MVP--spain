import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  email: { type: String, required: true },
  subject: { type: String, required: true, maxlength: 200 },
  message: { type: String, required: true },
  status: { type: String, enum: ['open', 'answered', 'closed'], default: 'open' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const SupportTicket = mongoose.model('SupportTicket', ticketSchema);
