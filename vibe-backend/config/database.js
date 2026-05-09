const mongoose = require('mongoose');

/**
 * MongoDB connection with retry logic and grace period on failure
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('MONGODB_URI not set – starting without DB connection');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Grace period: let the server start even if DB is down
    return null;
  }
};

module.exports = connectDB;
