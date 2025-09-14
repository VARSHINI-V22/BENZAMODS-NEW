import axios from "axios";
import { API_BASE_URL } from '../config';

const API = `${API_BASE_URL}/api/services`;

export const getServices = () => axios.get(API);
export const addService = (data) => axios.post(API, data);
export const updateService = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteService = (id) => axios.delete(`${API}/${id}`);