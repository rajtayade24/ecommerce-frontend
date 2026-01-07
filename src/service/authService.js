// src/service/authService.js
import { api } from "./api";

/**
 * Standardized helper to unwrap axios errors into a string
 */
function extractError(err, fallback = "Request failed") {
  return (
    err?.response?.data?.message ||
    err?.response?.data ||
    err?.message ||
    fallback
  );
}


export const signup = async (userObj) => {
  console.log("signup request: ", userObj);

  try {
    const response = await api.post("/auth/signup", userObj); console.log(response);
    // return a stable shape: { data, status }
    return { data: response.data, status: response.status };
  } catch (err) {
    throw new Error(extractError(err, "Signup failed"));
  }
};

export const login = async (userObj) => {
  try {
    const response = await api.post("/auth/login", userObj); console.log(response);
    return { data: response.data, status: response.status };
  } catch (err) {
    throw new Error(extractError(err, "Login failed"));
  }
}

export const sendOtp = async (identifier) => {
  console.log(identifier);
  try {
    const response = await api.post("/otp/send", { identifier }); console.log("send otp response: ", res);
    return { data: response.data, status: response.status };
  } catch (err) {
    throw new Error(extractError(err, "OTP request failed"));
  }
}

export const verifyOtp = async (identifier, otp) => {
  try {
    const response = await api.post("/otp/verify", { identifier, otp }); console.log("verify response: ", res);
    return { data: response.data, status: response.status };
  } catch (err) {
    throw new Error(extractError(err, "OTP verification failed"));
  }
}

export const getMe = async () => {
  try {
    const res = await api.get("/auth/me"); console.log("user: ", res);
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Failed to fetch current user"));
  }
}

export const getUserAddress = async (id) => {
  try {
    const response = await api.post(`/auth/addresses/${id}`); console.log("addresses: ", response);
    return response.data
  }
  catch (err) {
    throw new Error(extractError(err, "OTP verification failed"));
  }
}

// NEW: add address
export async function addUserAddress(payload) {
  try {
    const response = await api.post(`/auth/addresses/add`, { payload }); console.log("addresses: ", response);
    return response.data
  }
  catch (err) {
    throw new Error(extractError(err, "OTP verification failed"));
  }

}
