import axios from "axios";

const BASE_URL = import.meta.env.DEV
  ? import.meta.env.VITE_API_BASE
  : "/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

// Handle expired/invalid JWT
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove expired token
      localStorage.removeItem("token");

      // Remove Authorization header
      delete api.defaults.headers.common.Authorization;
    }

    return Promise.reject(error);
  }
);
