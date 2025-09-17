import axios from "axios";

// Dynamically choose API URL
const BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

// Create an axios instance for reusability
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// -----------------------------
// API ENDPOINT FUNCTIONS
// -----------------------------

// Locations
export const getLocations = () => api.get("/api/locations");

// Products
export const getProducts = () => api.get("/api/products");

// Services
export const getServices = () => api.get("/api/services");

// Orders (example: POST request)
export const createOrder = (orderData) => api.post("/api/orders", orderData);

// Contact form (example: POST request)
export const submitContactForm = (formData) =>
  api.post("/api/contact", formData);

// Auth (example: login)
export const loginUser = (credentials) =>
  api.post("/api/auth/login", credentials);
