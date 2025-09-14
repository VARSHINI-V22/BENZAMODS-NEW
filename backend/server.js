// Import required modules
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url"; // Added pathToFileURL
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import nodemailer from "nodemailer";
// Load environment variables
dotenv.config();
// Set up __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
// Initialize app
const app = express();
// Define allowed origins from environment variables or use defaults
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:3000', 'http://localhost:5000'];
// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in the allowed list
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
app.use(compression());
app.use(helmet());
// Environment-specific middleware
if (process.env.NODE_ENV === 'production') {
  app.disable('x-powered-by');
} else {
  app.use(morgan('dev'));
}
// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Basic routes that don't require DB
app.get("/", (req, res) => {
  res.send("✅ Benzamods Backend Server is Running...");
});
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    database: "not_connected",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString() 
  });
});

// NEW: API information route
app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to Benzamods API",
    version: "1.0.0",
    status: "running",
    environment: process.env.NODE_ENV || "development",
    endpoints: {
      products: "/api/products",
      services: "/api/services",
      categories: "/api/categories",
      modifications: "/api/modifications",
      details: "/api/details",
      enquiries: "/api/enquiries",
      auth: "/api/auth",
      vehicleServices: "/api/vehicle-services",
      locations: "/api/locations",
      orders: "/api/orders",
      portfolio: "/api/portfolio",
      messages: {
        submit: "/api/messages/submit",
        admin: "/api/admin-panel/messages"
      },
      admin: {
        signin: "/api/admin-panel/signin",
        seed: "/api/admin-panel/seed"
      }
    },
    documentation: "/api-docs",
    health: "/health"
  });
});

// Swagger setup (without DB dependency)
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Benzamods API",
      version: "1.0.0",
      description: "API documentation for Benzamods backend",
    },
    servers: [
      {
        url: process.env.VERCEL_URL || "http://localhost:5000",
      },
    ],
    components: {
      schemas: {
        Contact: {
          type: "object",
          required: ["name", "email", "phone", "subject", "message"],
          properties: {
            _id: { type: "string", description: "Auto-generated ID" },
            name: { type: "string", description: "Name of the contact" },
            email: { type: "string", format: "email", description: "Email address" },
            phone: { type: "string", description: "Phone number" },
            subject: { type: "string", description: "Subject" },
            message: { type: "string", description: "Message" },
            createdAt: { type: "string", format: "date-time", description: "Creation date" },
            status: { type: "string", enum: ["new", "read", "archived"], description: "Status" }
          }
        }
      },
      securitySchemes: {
        AdminAuth: {
          type: "apiKey",
          in: "header",
          name: "x-admin-token",
          description: "Admin authentication token"
        }
      }
    }
  },
  apis: ["./routes/*.js"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ message: "Something went wrong!" });
  } else {
    res.status(500).json({ 
      message: "Something went wrong!",
      error: err.message,
      stack: err.stack
    });
  }
});
// Variable to store initialized state
let isInitialized = false;
let dbConnection = null;
let models = {};
let routes = {};
// Async initialization function
async function initializeServer() {
  if (isInitialized) return;
  
  try {
    // Import database connection
    const { default: connectDB } = await import(pathToFileURL(path.join(__dirname, 'config', 'db.js')));
    dbConnection = await connectDB();
    console.log("Database connection established successfully");
    
    // Import models
    const modelsPath = path.join(__dirname, 'models');
    models.UserContact = (await import(pathToFileURL(path.join(modelsPath, 'UserContact.js')))).default;
    models.AdminUser = (await import(pathToFileURL(path.join(modelsPath, 'AdminUser.js')))).default;
    models.PortfolioProduct = (await import(pathToFileURL(path.join(modelsPath, 'PortfolioProduct.js')))).default;
    models.ContactMessage = (await import(pathToFileURL(path.join(modelsPath, 'ContactMessage.js')))).default;
    
    // Import routes
    const routesPath = path.join(__dirname, 'routes');
    routes.productRoutes = (await import(pathToFileURL(path.join(routesPath, 'productRoutes.js')))).default;
    routes.serviceRoutes = (await import(pathToFileURL(path.join(routesPath, 'serviceRoutes.js')))).default;
    routes.categoryRoutes = (await import(pathToFileURL(path.join(routesPath, 'categoryRoutes.js')))).default;
    routes.modificationRoutes = (await import(pathToFileURL(path.join(routesPath, 'modificationRoutes.js')))).default;
    routes.detailRoutes = (await import(pathToFileURL(path.join(routesPath, 'detailRoutes.js')))).default;
    routes.enquiryRoutes = (await import(pathToFileURL(path.join(routesPath, 'enquiryRoutes.js')))).default;
    routes.authRoutes = (await import(pathToFileURL(path.join(routesPath, 'authRoutes.js')))).default;
    routes.vehicleRoutes = (await import(pathToFileURL(path.join(routesPath, 'vehicleRoutes.js')))).default;
    routes.locationRoutes = (await import(pathToFileURL(path.join(routesPath, 'location.js')))).default;
    routes.orderRoutes = (await import(pathToFileURL(path.join(routesPath, 'orderRoutes.js')))).default;
    routes.portfolioRoutes = (await import(pathToFileURL(path.join(routesPath, 'portfolioRoutes.js')))).default;
    
    // Setup API routes
    if (routes.productRoutes) app.use("/api/products", routes.productRoutes);
    if (routes.serviceRoutes) app.use("/api/services", routes.serviceRoutes);
    if (routes.categoryRoutes) app.use("/api/categories", routes.categoryRoutes);
    if (routes.modificationRoutes) app.use("/api/modifications", routes.modificationRoutes);
    if (routes.detailRoutes) app.use("/api/details", routes.detailRoutes);
    if (routes.enquiryRoutes) app.use("/api/enquiries", routes.enquiryRoutes);
    if (routes.authRoutes) app.use("/api/auth", routes.authRoutes);
    if (routes.vehicleRoutes) app.use("/api/vehicle-services", routes.vehicleRoutes);
    if (routes.locationRoutes) app.use("/api/locations", routes.locationRoutes);
    if (routes.orderRoutes) app.use("/api/orders", routes.orderRoutes);
    if (routes.portfolioRoutes) app.use("/api/portfolio", routes.portfolioRoutes);
    
    // Setup DB-dependent routes
    setupDBDependentRoutes();
    
    isInitialized = true;
    console.log("Server initialization completed");
  } catch (error) {
    console.error("Initialization failed:", error);
    // Don't exit - allow basic routes to work
  }
}
// Setup routes that require DB
function setupDBDependentRoutes() {
  // User Message Submission
  app.post("/api/messages/submit", async (req, res) => {
    try {
      if (!models.UserContact) {
        return res.status(500).json({ message: "UserContact model not available" });
      }
      
      const { name, email, phone, message } = req.body;
      const contact = new models.UserContact({ name, email, phone, message });
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
      if (!models.AdminUser) {
        return res.status(500).json({ message: "AdminUser model not available" });
      }
      
      const { username, password } = req.body;
      const admin = await models.AdminUser.findOne({ username });
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
      if (!models.UserContact) {
        return res.status(500).json({ message: "UserContact model not available" });
      }
      
      jwt.verify(token, process.env.JWT_SECRET);
      const contacts = await models.UserContact.find().sort({ createdAt: -1 });
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
      if (!models.UserContact) {
        return res.status(500).json({ message: "UserContact model not available" });
      }
      
      jwt.verify(token, process.env.JWT_SECRET);
      await models.UserContact.findByIdAndDelete(req.params.id);
      res.json({ message: "Message deleted successfully" });
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  });
  // Seed Admin (Run once)
  app.get("/api/admin-panel/seed", async (req, res) => {
    try {
      if (!models.AdminUser) {
        return res.status(500).json({ message: "AdminUser model not available" });
      }
      
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await models.AdminUser.create({ username: "admin", password: hashedPassword });
      res.send("Admin created. Username: admin, Password: admin123");
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });
  // Initialize Portfolio Products
  app.post("/api/init-portfolio-products", async (req, res) => {
    try {
      if (!models.PortfolioProduct) {
        return res.status(500).json({ message: "PortfolioProduct model not available" });
      }
      
      const sampleProducts = [
        {
          title: "Luxury Car Wrap",
          type: "car",
          brand: "BMW",
          price: 5000,
          beforeAfter: [
            "https://tse1.mm.bing.net/th/id/OIP.eAqRXrk3Mn1I7HqPg6CYxgHaE8?pid=Api&P=0&h=220",
            "https://tse2.mm.bing.net/th/id/OIP.K0-sXQF2pGiUkdi8iTFzyAHaEK?pid=Api&P=0&h=220",
          ],
          description: "Full body wrap for a BMW X5, matte black finish.",
          review: "Amazing transformation! Highly recommended.",
        },
        {
          title: "Custom Bike Paint",
          type: "bike",
          brand: "Yamaha",
          price: 2000,
          beforeAfter: [
            "https://tse3.mm.bing.net/th/id/OIP.dE0QEYQwjfOWtRw6VKMpFgHaHa?pid=Api&P=0&h=220",
            "https://blog.gaadikey.com/wp-content/uploads/2015/04/Yamaha-Saluto-Image-2-1024x767.jpg",
          ],
          description: "Custom flame paint job for Yamaha R15.",
          review: "The bike looks stunning! Perfect work.",
        },
      ];
      await models.PortfolioProduct.deleteMany({});
      await models.PortfolioProduct.insertMany(sampleProducts);
      res.json({ message: "Sample portfolio products initialized" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  // Update health check with DB status
  app.get("/health", async (req, res) => {
    try {
      const mongoose = await import("mongoose");
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
}
// Initialize the server
initializeServer();
// Export for Vercel
export default async function handler(req, res) {
  // Ensure initialization is complete
  if (!isInitialized) {
    await initializeServer();
  }
  
  return app(req, res);
}
// Start server only in development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  });
}