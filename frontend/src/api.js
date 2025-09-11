import axios from "axios";

export const getLocations = () => axios.get("http://localhost:5000/api/locations");
