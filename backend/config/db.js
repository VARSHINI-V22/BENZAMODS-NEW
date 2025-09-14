// config/db.js
import mongoose from "mongoose";
import { pathToFileURL } from "url"; // Add this import

// Cache the connection to reuse across serverless function invocations
let cachedConnection = null;

const connectDB = async () => {
  // Return cached connection if available
  if (cachedConnection) {
    console.log('Using cached MongoDB connection');
    return cachedConnection;
  }
  
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MONGO_URI:', process.env.MONGO_URI ? '***' : 'MISSING');
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      connectTimeoutMS: 10000,
      retryWrites: true,
    };
    
    if (process.env.NODE_ENV === 'production') {
      options.ssl = true;
      options.sslValidate = true;
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    
    console.log("MongoDB Connected ✅");
    
    // Set up event listeners for connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB Connection Error ❌', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB Disconnected ⚠️');
      // Reset cached connection on disconnect
      cachedConnection = null;
    });
    
    // Cache the connection for reuse
    cachedConnection = conn;
    
    return conn;
  } catch (error) {
    console.error('MongoDB Connection Failed ❌', error.message);
    
    // In serverless environments, we don't retry automatically
    // Instead, we throw the error to be handled by the caller
    throw error;
  }
};

// Function to close the connection (useful for testing)
const closeConnection = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log('MongoDB Connection Closed');
    cachedConnection = null;
  }
};

export { connectDB, closeConnection };
export default connectDB;