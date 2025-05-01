import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // ej: http://localhost:3001
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");  // o donde guardes tu JWT
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;