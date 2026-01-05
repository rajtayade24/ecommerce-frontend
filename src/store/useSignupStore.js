// src/store/useSignupStore.js
import { create } from "zustand";
import { signup as signupService, login as loginService } from "@/service/authService";
import { sendOtp, verifyOtp } from "@/service/authService";

export const useSignupStore = create((set, get) => ({
  // form fields used across steps
  identifier: "", // email or mobile entered at step 1
  name: "",
  mobile: "", // explicit mobile (optional)
  password: "",
  confirmPassword: "",
  addresses: [],

  // UI state
  loading: false,
  error: null,
  success: null,

  // setters
  setIdentifier: (v) => set({ identifier: v }),
  setName: (v) => set({ name: v }),
  setMobile: (v) => set({ mobile: v }),
  setPassword: (v) => set({ password: v }),
  setConfirmPassword: (v) => set({ confirmPassword: v }),
  setAddresses: (v) => set({ addresses: v }),
  addAddress: (addressDto) => {
    set((state) => ({
      addresses: [...state.addresses, addressDto]
    }));
  },


  verificationSuccess: "",
  verificationStatus: "",
  disableVerifyBtn: false,
  setVerificationSuccess: (v) => set({ verificationSuccess: v }),
  setVerificationStatus: (v) => set({ verificationStatus: v }),
  setDisableVerifyBtn: (v) => set({ disableVerifyBtn: v }),

  isCodeOpen: false,
  setCodeOpen: (v) => set({ isCodeOpen: v }),

  // reset
  reset: () =>
    set({
      identifier: "",
      name: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      addresses: [],
      loading: false,
      error: null,
      success: null,
    }),

  // helper to build payload expected by backend
  buildUserDto: () => {
    const s = get();
    let email = null;
    let mobile = null;

    if (s.identifier) {
      if (s.identifier.includes("@")) email = s.identifier;
      else mobile = s.identifier;
    }

    if (s.mobile) mobile = s.mobile; // explicit mobile overrides identifier

    return {
      name: s.name || "",
      email,
      mobile,
      password: s.password,
      addresses: s.addresses || [],
    };
  },

  // perform signup network call
  submitSignup: async (onSuccess) => {
    set({ loading: true, error: null, success: null });
    const userDto = get().buildUserDto();

    try {
      const { data, error } = await signupService(userDto);
      if (error) {
        set({ loading: false, error });
        return { success: false, error };
      }

      // success
      set({ loading: false, success: "Account created", error: null });
      // option: store token if returned
      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("currentUser", JSON.stringify(data));
      }

      if (typeof onSuccess === "function") onSuccess(data); // If it function, then it calls that function and passes data (your signup response).

      return { success: true, data };
    } catch (err) {
      set({ loading: false, error: err.message || "Signup error" });
      return { success: false, error: err.message };
    }
  },

  submitLogin: async (onSuccess) => {
    set({ loading: true, error: null, success: null });
    const { identifier, password } = get();

    try {
      const { data, error } = await loginService({ identifier, password })

      if (error) {
        set({ loading: false, error });
        return { success: false, error };
      }

      // success
      set({ loading: false, success: "Account created", error: null });
      // option: store token if returned
      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("currentUser", JSON.stringify(data));
      }

      if (typeof onSuccess === "function") onSuccess(data); // If it function, then it calls that function and passes data (your signup response).

      return { success: true, data };
    } catch (err) {
      set({ loading: false, error: err.message || "Signup error" });
      return { success: false, error: err.message };
    }
  },

  // normalized identifier helper — use get() to read mobile safely
  getIdentifier: () => {
    const m = (get().mobile || "").trim();
    return /^\d{10}$/.test(m) ? "+91" + m : m;
  },

  sendOtpStore: async () => {
    set({ disableVerifyBtn: true, verificationStatus: "Waiting..." });
    setTimeout(() => set({ disableVerifyBtn: false }), 10000);

    try {
      const i = get().getIdentifier();
      const data = await sendOtp(i);

      set({
        verificationSuccess: data.success || "false",
        verificationStatus: data.message || "Code sent.",
        isCodeOpen: true,
      });
    }
    catch (err) {
      console.error("sendOtpStore error:", err);
      set({ verificationStatus: err.message || "Failed to send OTP" });
      return { success: false, error: err.message };
    };
  },

  submitOtp: async (otp) => {
    if (!get().isCodeOpen) {
      set({ verificationStatus: "Please request OTP first" });
      return { success: false, error: "otp_not_requested" };
    }
    if (!otp) {
      set({ verificationStatus: "Please enter the code." });
      return { success: false, error: "otp_missing" };
    }
    set({ disableVerifyBtn: true });

    try {
      const identifier = get().getIdentifier();
      const data = await verifyOtp(identifier, otp);

      set({
        verificationStatus:
          data.message || (data.success === "true" ? "Verified." : "Invalid code."),
        verificationSuccess: data.success || "false",
      });
      console.log(data);
      return { success: data.success === true || data.success === "true", data };
    } catch (err) {
      console.error("submitOtp error:", err);
      set({ verificationStatus: "Verification failed due to a server error." });
      return { success: false, error: err.message };
    } finally {
      set({ disableVerifyBtn: false });
    }
  },

  onLogout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser")
  }
}));
