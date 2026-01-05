import { api } from "./api";

export const signup = async (userObj) => {
console.log("signup request: ", userObj);

  try {
    const response = await api.post(`/auth/signup`, userObj); console.log("user: ", response); // send object directly
    return { data: response.data, error: null };
  } catch (err) {
    const error =
      err.response?.data?.message ||
      err.response?.data ||
      err.message ||
      "Signup failed";
    throw new Error(error);  // IMPORTANT
  }
};

export const login = async (userObj) => {
  try {
    const response = await api.post("/auth/login", userObj); console.log("user: ", response);
    return { data: response.data, error: null }
  }
  catch (err) {
    const error =
      err.response?.data?.message ||
      err.response?.data ||
      err.message ||
      "Signup failed";
    throw new Error(error);  // IMPORTANT
  }
}

export const sendOtp = async (identifier) => {
  console.log(identifier);
  try {
    const res = await api.post(`/otp/send`, {
      identifier: identifier
    }); console.log("send otp response: ", res);
    return res.data
  }
  catch (err) {
    console.error("sendOtp error:", err);

    const errorMessage =
      err.response?.data?.message ||
      err.response?.data ||
      err.message ||
      "OTP request failed";

    throw new Error(errorMessage);
  }
}

export const verifyOtp = async (identifier, otp) => {
  try {
    const res = await api.post(`/otp/verify`, {
      identifier, otp
    }); console.log("verify response: ", res);
    return res.data
  }
  catch (err) {
    const error = err.res?.data?.message || err.res?.data || err.message || "Signup failed";
    throw new Error(error);  // IMPORTANT
  }
}

export const getMe = async () => {
  const res = await api.get("/auth/me"); console.log("user: ", res);
  return res.data;
}

export const getUserAddress = async (id) => {
  try {
    const response = await api.post(`/auth/addresses/${id}`); console.log("addresses: ", response);
    return response.data
  }
  catch (err) {
    const error = err.response?.data?.message || err.response?.data || err.message || "Signup failed";
    throw new Error(error);  // IMPORTANT
  }
}



// NEW: add address
export async function addUserAddress(payload) {
  try {
    const response = await api.post(`/auth/addresses/add`, { payload }); console.log("addresses: ", response);
    return response.data
  }
  catch (err) {
    const error = err.response?.data?.message || err.response?.data || err.message || "add address failed";
    throw new Error(error);  // IMPORTANT
  }

}
