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
import { existsSync } from "fs"; // Added for file existence check

// Load environment variables
dotenv.config();

// Set up __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debug: Print current directory to verify
console.log("Current directory (__dirname):", __dirname);

// Construct and normalize the path to db.js
const dbPath = path.normalize(path.join(__dirname, 'config', 'db.js'));

// Debug: Print the resolved path
console.log("Attempting to load db.js from:", dbPath);

// Check if file exists before importing
if (!existsSync(dbPath)) {
  console.error("ERROR: db.js file not found at:", dbPath);
  process.exit(1);
}

// Convert path to file URL for ES modules on Windows
const dbUrl = pathToFileURL(dbPath).href;

// Dynamic import for connectDB with verified path
let connectDB;
try {
  const dbModule = await import(dbUrl);
  connectDB = dbModule.connectDB || dbModule.default;
  
  if (!connectDB) {
    console.error("ERROR: connectDB function not found in db.js");
    process.exit(1);
  }
} catch (error) {
  console.error("ERROR importing db.js:", error);
  process.exit(1);
}

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
try {
  await connectDB();
  console.log("Database connection established successfully");
} catch (error) {
  console.error("Failed to connect to database:", error);
  process.exit(1);
}

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
   Import routes with absolute paths and error handling
--------------------------------*/
const routesPath = path.join(__dirname, 'routes');
console.log("Loading routes from:", routesPath);

// Helper function to safely import modules
async function safeImport(modulePath, moduleName) {
  try {
    const normalizedPath = path.normalize(modulePath);
    console.log(`Importing ${moduleName} from:`, normalizedPath);
    
    if (!existsSync(normalizedPath)) {
      console.error(`ERROR: ${moduleName} file not found at:`, normalizedPath);
      return null;
    }
    
    // Convert path to file URL for ES modules on Windows
    const moduleUrl = pathToFileURL(normalizedPath).href;
    const module = await import(moduleUrl);
    return module.default;
  } catch (error) {
    console.error(`ERROR importing ${moduleName}:`, error);
    return null;
  }
}

// Import all routes with error handling
const productRoutes = await safeImport(path.join(routesPath, 'productRoutes.js'), 'productRoutes');
const serviceRoutes = await safeImport(path.join(routesPath, 'serviceRoutes.js'), 'serviceRoutes');
const categoryRoutes = await safeImport(path.join(routesPath, 'categoryRoutes.js'), 'categoryRoutes');
const modificationRoutes = await safeImport(path.join(routesPath, 'modificationRoutes.js'), 'modificationRoutes');
const detailRoutes = await safeImport(path.join(routesPath, 'detailRoutes.js'), 'detailRoutes');
const enquiryRoutes = await safeImport(path.join(routesPath, 'enquiryRoutes.js'), 'enquiryRoutes');
const authRoutes = await safeImport(path.join(routesPath, 'authRoutes.js'), 'authRoutes');
const vehicleRoutes = await safeImport(path.join(routesPath, 'vehicleRoutes.js'), 'vehicleRoutes');
const locationRoutes = await safeImport(path.join(routesPath, 'location.js'), 'locationRoutes');
const orderRoutes = await safeImport(path.join(routesPath, 'orderRoutes.js'), 'orderRoutes');
const portfolioRoutes = await safeImport(path.join(routesPath, 'portfolioRoutes.js'), 'portfolioRoutes');

/* ------------------------------
   Import models with absolute paths and error handling
--------------------------------*/
const modelsPath = path.join(__dirname, 'models');
console.log("Loading models from:", modelsPath);

const UserContact = await safeImport(path.join(modelsPath, 'UserContact.js'), 'UserContact');
const AdminUser = await safeImport(path.join(modelsPath, 'AdminUser.js'), 'AdminUser');
const PortfolioProduct = await safeImport(path.join(modelsPath, 'PortfolioProduct.js'), 'PortfolioProduct');
const ContactMessage = await safeImport(path.join(modelsPath, 'ContactMessage.js'), 'ContactMessage');

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
   API routes (with null checks)
--------------------------------*/
if (productRoutes) app.use("/api/products", productRoutes);
if (serviceRoutes) app.use("/api/services", serviceRoutes);
if (categoryRoutes) app.use("/api/categories", categoryRoutes);
if (modificationRoutes) app.use("/api/modifications", modificationRoutes);
if (detailRoutes) app.use("/api/details", detailRoutes);
if (enquiryRoutes) app.use("/api/enquiries", enquiryRoutes);
if (authRoutes) app.use("/api/auth", authRoutes);
if (vehicleRoutes) app.use("/api/vehicle-services", vehicleRoutes);
if (locationRoutes) app.use("/api/locations", locationRoutes);
if (orderRoutes) app.use("/api/orders", orderRoutes);
if (portfolioRoutes) app.use("/api/portfolio", portfolioRoutes);

/* ------------------------------
   User Message Submission
--------------------------------*/
app.post("/api/messages/submit", async (req, res) => {
  try {
    if (!UserContact) {
      return res.status(500).json({ message: "UserContact model not available" });
    }
    
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
    if (!AdminUser) {
      return res.status(500).json({ message: "AdminUser model not available" });
    }
    
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
    if (!UserContact) {
      return res.status(500).json({ message: "UserContact model not available" });
    }
    
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
    if (!UserContact) {
      return res.status(500).json({ message: "UserContact model not available" });
    }
    
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
    if (!AdminUser) {
      return res.status(500).json({ message: "AdminUser model not available" });
    }
    
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
    if (!PortfolioProduct) {
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