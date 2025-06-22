import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // All API calls go to /api/*
});

// Intercept all requests to attach user's email
axiosInstance.interceptors.request.use((config) => {
  const email = sessionStorage.getItem("userEmail");
  if (email) {
    config.headers["user-email"] = email;
  }
  return config;
}, (error) => Promise.reject(error));

export default axiosInstance;
