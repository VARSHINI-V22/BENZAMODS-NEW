import axios from "axios";
import { API_BASE_URL } from '../config';

const API = `${API_BASE_URL}/api/products`;

export const getProducts = () => axios.get(API);
export const addProduct = (data) => axios.post(API, data);
export const updateProduct = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteProduct = (id) => axios.delete(`${API}/${id}`);