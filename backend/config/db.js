import mongoose from 'mongoose';

let memoryServer = null;

export async function connectDB() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not configured');

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected (Atlas)');
    return;
  } catch (err) {
    console.warn('MongoDB Atlas connection failed, falling back to in-memory server:', err.message);
  }

  // Fallback: use mongodb-memory-server for local development
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  memoryServer = await MongoMemoryServer.create();
  const uri = memoryServer.getUri();
  await mongoose.connect(uri);
  console.log('MongoDB connected (in-memory server)');
}

export async function stopMemoryServer() {
  if (memoryServer) {
    await mongoose.disconnect();
    await memoryServer.stop();
    console.log('In-memory MongoDB server stopped');
  }
}
