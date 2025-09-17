import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Example: Locations API
export const getLocations = () => axios.get(`${BASE_URL}/api/locations`);

// Example: Products API
export const getProducts = () => axios.get(`${BASE_URL}/api/products`);

// Example: Services API
export const getServices = () => axios.get(`${BASE_URL}/api/services`);
