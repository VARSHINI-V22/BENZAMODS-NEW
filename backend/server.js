// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect MongoDB Atlas
connectDB();

// Detect if running on Vercel
const isVercel = process.env.VERCEL === "1";
const serverUrl = isVercel
  ? `https://${process.env.VERCEL_URL}/api`
  : "http://localhost:5000";

// ------------------------
// Swagger Setup
// ------------------------
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
  apis: ["./routes/*.js"], // Swagger comments in route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ------------------------
// Import Models
// ------------------------
const UserContact = require("./models/UserContact");
const AdminUser = require("./models/AdminUser");
const PortfolioProduct = require("./models/PortfolioProduct");
// Add other models if needed

// ------------------------
// Import Routes
// ------------------------
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

// ------------------------
// Root Route
// ------------------------
app.get("/", (req, res) => {
  res.send("✅ Benzamods Backend Server is Running...");
});

// ------------------------
// API Routes
// ------------------------
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

// ------------------------
// Example Contact Form Submission
// ------------------------
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

// ------------------------
// Local Development Only
// ------------------------
if (!isVercel) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📄 Swagger docs at http://localhost:${PORT}/api-docs`);
  });
}

// ------------------------
// Export for Vercel
// ------------------------
const serverless = require("serverless-http");
module.exports = app;
module.exports.handler = serverless(app);
