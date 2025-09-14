import axios from "axios";
import { API_BASE_URL } from '../config';

const API = `${API_BASE_URL}/api/services`;

export const getServices = () => axios.get(API);
export const getServiceById = (id) => axios.get(`${API}/${id}`);
export const createService = (data) => axios.post(API, data);
export const updateService = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteService = (id) => axios.delete(`${API}/${id}`);
export const getServicesByType = (type) => axios.get(`${API}?category=${type}`);

export default {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServicesByType,
};