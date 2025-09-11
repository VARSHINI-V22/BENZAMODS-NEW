import axios from "axios";

const API = "http://localhost:5000/api/products";

export const getProducts = () => axios.get(API);
export const addProduct = (data) => axios.post(API, data);
export const updateProduct = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteProduct = (id) => axios.delete(`${API}/${id}`);
