// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MONGO_URI:', process.env.MONGO_URI ? '***' : 'MISSING');
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      bufferMaxEntries: 0,
      connectTimeoutMS: 10000,
      retryWrites: true,
    };
    if (process.env.NODE_ENV === 'production') {
      options.ssl = true;
      options.sslValidate = true;
    }
    await mongoose.connect(process.env.MONGO_URI, options);
    
    console.log("MongoDB Connected ✅");
    mongoose.connection.on('connected', () => {
      console.log('MongoDB Connected ✅');
    });
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB Connection Error ❌', err);
    });
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB Disconnected ⚠️');
    });
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB Connection Closed');
      process.exit(0);
    });
  } catch (error) {
    console.error('MongoDB Connection Failed ❌', error.message);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB; // CommonJS export