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
        url: "http://localhost:5000", // change if hosted
      },
    ],
    components: {
      schemas: {
        Contact: {
          type: "object",
          required: ["name", "email", "phone", "subject", "message"],
          properties: {
            _id: {
              type: "string",
              description: "Auto-generated ID of the contact"
            },
            name: {
              type: "string",
              description: "Name of the contact"
            },
            email: {
              type: "string",
              format: "email",
              description: "Email address of the contact"
            },
            phone: {
              type: "string",
              description: "Phone number of the contact"
            },
            subject: {
              type: "string",
              description: "Subject of the message"
            },
            message: {
              type: "string",
              description: "Message from the contact"
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Date when the contact was created"
            },
            status: {
              type: "string",
              enum: ["new", "read", "archived"],
              description: "Status of the contact message"
            }
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
  apis: ["./routes/*.js"], // your route files should include Swagger comments
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/* ------------------------------
   Import existing routes
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

// -----------------
// Models
// -----------------
const UserContact = require("./models/UserContact");
const AdminUser = require("./models/AdminUser");
const PortfolioProduct = require("./models/PortfolioProduct");
const ContactMessage = require("./models/ContactMessage");

/* ------------------------------
   Root route
--------------------------------*/
app.get("/", (req, res) => {
  res.send("✅ Benzamods Backend Server is Running...");
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
   Contact Form Routes (New)
--------------------------------*/
// ... (keep your existing contact routes as they are)

/* ------------------------------
   User Message Submission (Keep for backward compatibility)
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
      process.env.JWT_SECRET || "secretkey",
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
    jwt.verify(token, process.env.JWT_SECRET || "secretkey");
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
    jwt.verify(token, process.env.JWT_SECRET || "secretkey");
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
   Initialize Portfolio Products (Run once)
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
   Start Server
--------------------------------*/
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
  console.log(` Swagger docs available at http://localhost:${PORT}/api-docs`);
});