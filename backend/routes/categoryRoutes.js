// Import required modules
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import { connectDB } from "../config/db.js"; // FIXED: Named import
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
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Initialize app
const app = express();

// Middleware
app.use(cors());
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

// Connect MongoDB
connectDB();

/* ------------------------------
   Swagger Setup
--------------------------------*/
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
          },
          example: {
            _id: "60d5f4a9e6b8a425f4c7f9a1",
            name: "John Doe",
            email: "john@example.com",
            phone: "+1234567890",
            subject: "Product Inquiry",
            message: "Hello, I'm interested in your products",
            createdAt: "2023-06-28T10:00:00.000Z",
            status: "new"
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

/* ------------------------------
   Import routes
--------------------------------*/
import productRoutes from "./routes/productRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import modificationRoutes from "./routes/modificationRoutes.js";
import detailRoutes from "./routes/detailRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import locationRoutes from "./routes/location.js";
import orderRoutes from "./routes/orderRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";

/* ------------------------------
   Import models
--------------------------------*/
import UserContact from "./models/UserContact.js";
import AdminUser from "./models/AdminUser.js";
import PortfolioProduct from "./models/PortfolioProduct.js";
import ContactMessage from "./models/ContactMessage.js";

/* ------------------------------
   Routes
--------------------------------*/
app.get("/", (req, res) => {
  res.send("✅ Benzamods Backend Server is Running...");
});

app.get("/health", async (req, res) => {
  try {
    const mongoose = await import("mongoose");
    const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    res.json({ 
      status: "OK", 
      database: dbStatus,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.status(500).json({ 
      status: "ERROR", 
      database: "disconnected",
      timestamp: new Date().toISOString() 
    });
  }
});

/* ------------------------------
   API routes
--------------------------------*/
app.use("/api/products", productRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/modifications", modificationRoutes);
app.use("/api/details", detailRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/vehicle-services", vehicleRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/portfolio", portfolioRoutes);

/* ------------------------------
   User Message Submission
--------------------------------*/
app.post("/api/messages/submit", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const contact = new UserContact({ name, email, phone, message });
    await contact.save();
    res.json({ message: "Message submitted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ------------------------------
   Admin Login
--------------------------------*/
app.post("/api/admin-panel/signin", async (req, res) => {
  try {
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

/* ------------------------------
   Admin Protected Routes
--------------------------------*/
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

/* ------------------------------
   Seed Admin (Run once)
--------------------------------*/
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

/* ------------------------------
   Initialize Portfolio Products
--------------------------------*/
app.post("/api/init-portfolio-products", async (req, res) => {
  try {
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
    await PortfolioProduct.deleteMany({});
    await PortfolioProduct.insertMany(sampleProducts);
    res.json({ message: "Sample portfolio products initialized" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ------------------------------
   Error handling middleware
--------------------------------*/
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

/* ------------------------------
   Start server (only in development)
--------------------------------*/
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  });
}

/* ------------------------------
   Export for Vercel
--------------------------------*/
export default app;