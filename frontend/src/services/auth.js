import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // your backend URL

export const signup = (data) => axios.post(`${API_URL}/signup`, data);
export const login = (data) => axios.post(`${API_URL}/login`, data);
