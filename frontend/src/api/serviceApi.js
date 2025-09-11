import axios from "axios";

const API = "http://localhost:5000/api/services";

export const getServices = () => axios.get(API);
export const addService = (data) => axios.post(API, data);
export const updateService = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteService = (id) => axios.delete(`${API}/${id}`);
