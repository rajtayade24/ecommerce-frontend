import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE;
if (!BASE_URL) {
  throw new Error("VITE_API_BASE environment variable is not set!");
}

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

// import axios from "axios";

// // src/api.js
// export const BASE_URL = import.meta.env.VITE_API_BASE

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