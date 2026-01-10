// src/store/useSignupStore.js
import { create } from "zustand";
import {
  signup as signupService,
  login as loginService,
  sendOtp,
  verifyOtp,
} from "@/service/authService";

/**
 * Notes:
 * - success: boolean (null/true/false) used by UI to show color
 * - verString: message to show to user (error/success)
 * - disableVerifyBtn: prevents rapid OTP re-requests (cooldown)
 */

const OTP_COOLDOWN_MS = 30_000; // 30 seconds cooldown for requests (configurable)

export const useSignupStore = create((set, get) => {
  // internal timer id for OTP cooldown (not stored in persisted state)
  let otpCooldownTimer = null;

  return {
    // form fields
    identifier: "",
    name: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    addresses: [],

    // UI state
    loading: false,
    success: null, // null = neutral, true = success, false = failure
    verString: "", // message shown to user
    disableVerifyBtn: false,
    isCodeOpen: false,

    // setters
    setIdentifier: (v) => set({ identifier: v }),
    setName: (v) => set({ name: v }),
    setMobile: (v) => set({ mobile: v }),
    setPassword: (v) => set({ password: v }),
    setConfirmPassword: (v) => set({ confirmPassword: v }),
    setAddresses: (v) => set({ addresses: v }),
    addAddress: (addressDto) => set((s) => ({ addresses: [...s.addresses, addressDto] })),
    setVerString: (v) => set({ verString: v }),
    setDisableVerifyBtn: (v) => set({ disableVerifyBtn: v }),
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
        success: null,
        verString: "",
      }),

    // helper - canonical identifier to send to backend
    // prefer explicit mobile if provided, else use identifier (email or mobile)
    getIdentifier: () => {
      const m = (get().mobile || "").trim();
      if (/^\d{10}$/.test(m)) return "+91" + m;
      const id = (get().identifier || "").trim();
      if (/^\d{10}$/.test(id)) return "+91" + id;
      return id;
    },

    // build payload expected by backend
    buildUserDto: () => {
      const s = get();
      let email = null;
      let mobile = null;

      // identifier can be email or 10-digit local or E.164
      if (s.identifier) {
        if (s.identifier.includes("@")) email = s.identifier.trim();
        else {
          // if identifier looks like 10 digits or starts with +, prefer normalized mobile
          const id = s.identifier.trim();
          if (/^\d{10}$/.test(id)) mobile = id;
          else mobile = id.startsWith("+") ? id : id;
        }
      }

      // explicit mobile overrides identifier
      if (s.mobile) mobile = s.mobile.trim();

      return {
        name: s.name || "",
        email,
        mobile,
        password: s.password,
        addresses: s.addresses || [],
      };
    },

    // Sign up
    submitSignup: async (onSuccess) => {
      set({ loading: true, success: null, verString: "" });
      // basic client-side validation
      const s = get();
      if (!s.password || !s.confirmPassword || s.password !== s.confirmPassword) {
        set({ loading: false, success: false, verString: "Passwords do not match" });
        return { success: false, error: "password_mismatch" };
      }

      const userDto = get().buildUserDto();

      try {
        const { data, status } = await signupService(userDto);
        set({ loading: false, success: true, verString: "Signup successful" });

        // store token if present
        if (data?.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("currentUser", JSON.stringify(data));
        }

        if (typeof onSuccess === "function") onSuccess(data);
        return { success: true, data };
      } catch (err) {
        const message = err.message || "Signup error";
        set({ loading: false, success: false, verString: message });
        return { success: false, error: message };
      }
    },

    // Login
    submitLogin: async (onSuccess) => {
      set({ loading: true, success: null, verString: "" });
      const { identifier, password } = get();
      try {
        const { data } = await loginService({ identifier, password });
        set({ loading: false, success: true, verString: "Login successful" });

        if (data?.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("currentUser", JSON.stringify(data));
        }

        if (typeof onSuccess === "function") onSuccess(data);
        return { success: true, data };
      } catch (err) {
        const message = err.message || "Login failed";
        set({ loading: false, success: false, verString: message });
        return { success: false, error: message };
      }
    },

    // send OTP
    sendOtpStore: async () => {
      set({loading: true, success: null, verString: "Sending OTP..." });

      try {
        const identifier = get().getIdentifier();
        const { data } = await sendOtp(identifier);

        set({
          loading: false,
          success: true,
          verString: "OTP sent",
          isCodeOpen: true
        });

        return { success: false, error: msg };
      } catch (err) {
        const message = err.message || "Failed to send OTP";
        set({ loading: false, success: false, verString: message });
        return { success: false, error: message };
      }
    },

    // verify OTP
    submitOtp: async (otp) => {
      if (!get().isCodeOpen) {
        set({ verString: "Please request OTP first", success: false });
        return { success: false, error: "otp_not_requested" };
      }
      if (!otp) {
        set({ verString: "Please enter the code.", success: false });
        return { success: false, error: "otp_missing" };
      }

      set({ loading: true, success: null, verString: "" });

      try {
        const identifier = get().getIdentifier();
        const { data } = await verifyOtp(identifier, otp);

        set({ loading: false, success: true, verString: "OTP verified" });
        return { success: true, data };
      } catch (err) {
        const message = err.message || "Verification failed due to a server error.";
        set({ loading: false, success: false, verString: message });
        return { success: false, error: message };
      }
    },

    onLogout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      set({ success: null, verString: "" });
    },
  };
});
