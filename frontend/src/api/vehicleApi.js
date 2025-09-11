import axios from "axios";

const API = "http://localhost:5000/api/services";

export const getServices = () => axios.get(API);
export const getServiceById = (id) => axios.get(`${API}/${id}`);
export const createService = (data) => axios.post(API, data);
export const updateService = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteService = (id) => axios.delete(`${API}/${id}`);

// Optional: get services by category/type
export const getServicesByType = (type) => axios.get(`${API}?category=${type}`);

// Default export to fix previous imports
export default {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServicesByType,
};
