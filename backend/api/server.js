// api/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Load environment variables
dotenv.config();

// Debug: Check if environment variables are loaded
console.log('MONGO_URI:', process.env.MONGO_URI ? '***SET***' : 'NOT SET');

// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

// Initialize app
const app = express();

// Define allowed origins
const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:3001', 
  'http://localhost:5000',
  'https://frontend-8lo68iomb-varshini-vs-projects.vercel.app'
];

// Define PORT constant
const PORT = process.env.PORT || 5001; // Changed from 5000 to 5001

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      console.log('Origin not allowed by CORS:', origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Try to load optional middleware
try {
  const helmet = require('helmet');
  app.use(helmet());
} catch (err) {
  console.warn("Helmet not available, skipping security headers");
}

try {
  const morgan = require('morgan');
  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }
} catch (err) {
  console.warn("Morgan not available, skipping request logging");
}

try {
  const compression = require('compression');
  app.use(compression());
} catch (err) {
  console.warn("Compression not available, skipping compression");
}

if (process.env.NODE_ENV === 'production') {
  app.disable('x-powered-by');
}

// Database connection
let dbConnection = null;
const connectDB = async () => {
  if (dbConnection && mongoose.connection.readyState === 1) {
    return dbConnection;
  }
  
  try {
    dbConnection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });
    console.log("MongoDB connected");
    return dbConnection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

// Define schemas
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['car', 'bike'] },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }
}, { timestamps: true });

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['car', 'bike'] },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }
}, { timestamps: true });

const userContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true }
}, { timestamps: true });

const adminUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

// Create models
const Product = mongoose.model('Product', productSchema);
const Service = mongoose.model('Service', serviceSchema);
const UserContact = mongoose.model('UserContact', userContactSchema);
const AdminUser = mongoose.model('AdminUser', adminUserSchema);

// Basic routes
app.get("/", (req, res) => {
  res.send("✅ Benzamods Backend Server is Running...");
});

app.get("/health", async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    res.status(dbStatus === "connected" ? 200 : 503).json({ 
      status: dbStatus === "connected" ? "OK" : "Service Unavailable",
      database: dbStatus,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.status(503).json({ 
      status: "ERROR", 
      database: "disconnected",
      timestamp: new Date().toISOString() 
    });
  }
});

app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to Benzamods API",
    version: "1.0.0",
    status: "running",
    environment: process.env.NODE_ENV || "development",
    endpoints: {
      products: "/api/products",
      services: "/api/services",
      messages: {
        submit: "/api/messages/submit",
        admin: "/api/admin-panel/messages"
      },
      admin: {
        signin: "/api/admin-panel/signin",
        seed: "/api/admin-panel/seed"
      }
    },
    health: "/health"
  });
});

// Product routes
app.get("/api/products", async (req, res) => {
  try {
    await connectDB();
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    await connectDB();
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    await connectDB();
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    await connectDB();
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Service routes
app.get("/api/services", async (req, res) => {
  try {
    await connectDB();
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/services", async (req, res) => {
  try {
    await connectDB();
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/services/:id", async (req, res) => {
  try {
    await connectDB();
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/services/:id", async (req, res) => {
  try {
    await connectDB();
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// User Message Submission
app.post("/api/messages/submit", async (req, res) => {
  try {
    await connectDB();
    const { name, email, phone, message } = req.body;
    const contact = new UserContact({ name, email, phone, message });
    await contact.save();
    res.json({ message: "Message submitted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin Login
app.post("/api/admin-panel/signin", async (req, res) => {
  try {
    await connectDB();
    const { username, password } = req.body;
    const admin = await AdminUser.findOne({ username });
    if (!admin) return res.status(400).json({ message: "Invalid username" });
    
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });
    
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin Protected Routes
app.get("/api/admin-panel/messages", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });
  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const contacts = await UserContact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

app.delete("/api/admin-panel/messages/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });
  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    await UserContact.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Seed Admin (Run once)
app.get("/api/admin-panel/seed", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await AdminUser.create({ username: "admin", password: hashedPassword });
    res.send("Admin created. Username: admin, Password: admin123");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  console.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);
});