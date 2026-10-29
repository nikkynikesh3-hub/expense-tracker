// One place for all calls to our backend.
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

// Before every request, add the saved login token (if there is one)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;