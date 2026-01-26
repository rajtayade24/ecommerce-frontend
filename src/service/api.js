import axios from "axios";

export const BASE_URL =
  import.meta.env.VITE_API_BASE || "https://ecommerce-backend-clean-18-lspu.onrender.com/api";

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

// import axios from "axios";

// // src/api.js
// export const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:8080/api";

// // You may also add a token if you have JWT auth
// const jwttoken = localStorage.getItem("token"); // or wherever you store it
// export const api = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: jwttoken ? `Bearer ${jwttoken}` : undefined,
//   },
// });

// // This runs ONCE, when the file is imported.
// // What actually happens:

// // App loads

// // token does not exist yet

// // Axios instance is created with: