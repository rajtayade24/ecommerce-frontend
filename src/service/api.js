import axios from "axios";

// src/api.js
export const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:8080";

// You may also add a token if you have JWT auth
const jwttoken = localStorage.getItem("token"); // or wherever you store it
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: jwttoken ? `Bearer ${jwttoken}` : undefined,
  },
});

// Optional: central error formatting
// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     // Normalize server errors so callers can read err.response?.data || err.message
//     return Promise.reject(err);
//   }
// );
