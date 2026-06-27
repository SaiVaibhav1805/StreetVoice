import mongoose from 'mongoose';
import dns from 'dns';

const connectDB = async () => {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/streetvoice');
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
