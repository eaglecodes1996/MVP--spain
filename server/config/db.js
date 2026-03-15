import mongoose from 'mongoose';

export async function connectDb() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/solvesnap';
  await mongoose.connect(uri);
}
