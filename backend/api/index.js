// backend/api/index.js
const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("../config/db");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Connect MongoDB
connectDB().catch((err) => console.error("MongoDB connection error:", err));

// Swagger setup
const isVercel = process.env.VERCEL === "1";
const serverUrl = isVercel ? `https://${process.env.VERCEL_URL}/api` : "http://localhost:5000";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Benzamods API",
      version: "1.0.0",
      description: "API documentation for Benzamods backend",
    },
    servers: [{ url: serverUrl }],
  },
  apis: [path.join(__dirname, "../routes/*.js")],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Import routes
const productRoutes = require("../routes/productRoutes");
const serviceRoutes = require("../routes/serviceRoutes");
const categoryRoutes = require("../routes/categoryRoutes");
const modificationRoutes = require("../routes/modificationRoutes");
const detailRoutes = require("../routes/detailRoutes");
const enquiryRoutes = require("../routes/enquiryRoutes");
const authRoutes = require("../routes/authRoutes");
const vehicleRoutes = require("../routes/vehicleRoutes");
const locationRoutes = require("../routes/location");
const orderRoutes = require("../routes/orderRoutes");
const portfolioRoutes = require("../routes/portfolioRoutes");

// Models
const UserContact = require("../models/UserContact");

// Root route
app.get("/", (req, res) => {
  res.send("✅ Benzamods Backend Server is Running...");
});

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok", timestamp: new Date() }));

// API routes
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

// Contact form
app.post("/api/messages/submit", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const contact = new UserContact({ name, email, phone, message });
    await contact.save();
    res.json({ message: "Message submitted successfully!" });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Export for Vercel
module.exports.handler = serverless(app);
