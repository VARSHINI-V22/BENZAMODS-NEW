const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const nodemailer = require("nodemailer");
const serverless = require("serverless-http"); // ✅ required for Vercel

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
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
        url: "https://your-vercel-domain.vercel.app/api", // ✅ change after deploy
      },
    ],
    components: {
      schemas: {
        Contact: {
          type: "object",
          required: ["name", "email", "phone", "subject", "message"],
          properties: {
            name: { type: "string" },
            email: { type: "string", format: "email" },
            phone: { type: "string" },
            subject: { type: "string" },
            message: { type: "string" },
          },
        },
      },
      securitySchemes: {
        AdminAuth: {
          type: "apiKey",
          in: "header",
          name: "x-admin-token",
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/* ------------------------------
   Routes
--------------------------------*/
const productRoutes = require("./routes/productRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const modificationRoutes = require("./routes/modificationRoutes");
const detailRoutes = require("./routes/detailRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const authRoutes = require("./routes/authRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const locationRoutes = require("./routes/location");
const orderRoutes = require("./routes/orderRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");

// Models
const UserContact = require("./models/UserContact");
const AdminUser = require("./models/AdminUser");
const PortfolioProduct = require("./models/PortfolioProduct");

// Root route
app.get("/", (req, res) => {
  res.send("✅ Benzamods Backend Server is Running...");
});

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

// Example: messages
app.post("/api/messages/submit", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const contact = new UserContact({ name, email, phone, message });
    await contact.save();
    res.json({ message: "Message submitted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ------------------------------
   Export for Vercel
--------------------------------*/
module.exports = app;
module.exports.handler = serverless(app);
