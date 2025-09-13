const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
      socketTimeoutMS: 45000, // Close sockets after 45s
      maxPoolSize: 10, // Maintain up to 10 socket connections
      bufferMaxEntries: 0, // Fail fast if no connection available
      connectTimeoutMS: 10000, // Give up initial connection after 10s
      retryWrites: true, // Retry write operations
    };

    // Add SSL configuration for production
    if (process.env.NODE_ENV === 'production') {
      options.ssl = true;
      options.sslValidate = true;
    }

    await mongoose.connect(process.env.MONGO_URI, options);
    
    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('MongoDB Connected ✅');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB Connection Error ❌', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB Disconnected ⚠️');
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB Connection Closed');
      process.exit(0);
    });

  } catch (error) {
    console.error('MongoDB Connection Failed ❌', error.message);
    
    // Retry connection logic
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;