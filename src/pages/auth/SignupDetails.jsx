import React, { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

import { useNavigate } from "react-router-dom";
import { useSignupStore } from "@/store/useSignupStore";
import MobileNumberInput from '@/components/MobileNumberInput'

function SignupDetails() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  // pull everything once from the store (avoid multiple calls)
  const {
    name,
    setName,
    mobile,
    setMobile,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isCodeOpen,
    disableVerifyBtn,
    resString,
    sendOtpStore,
    error,
    success,
    submitOtp,
  } = useSignupStore();

  const isValidIndianMobile = (mobile) => {
    return /^[6-9]\d{9}$/.test(mobile);
  };

  const isValidPassword = (password) => {
    return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password);
  };

  const handleSendOtp = async (e) => {
    e?.preventDefault?.();

    if (!mobile || mobile.trim().length === 0) {
      useSignupStore.setState({ error: "Mobile number is required" });
      return;
    }

    if (!isValidIndianMobile(mobile)) {
      useSignupStore.setState({ error: "Enter a valid 10-digit mobile number" });
      return;
    }

    if (!name !== name.length <= 0) {
      useSignupStore.setState({ error: "Name is required" });
      return;
    }
    if (!password) {
      useSignupStore.setState({ error: "Password is required" });
      return;
    }
    if (!isValidPassword(password)) {
      useSignupStore.setState({
        error: "Password must be at least 6 characters and contain letters and numbers",
      });
      return;
    }

    if (password !== confirmPassword) {
      useSignupStore.setState({ error: "Passwords do not match" });
      return;
    }

    await sendOtpStore();
  };

  const handleVerifyOtp = async (e) => {
    e?.preventDefault?.();
    const result = await submitOtp(otp);
    console.log(result);
    if (result.success == true) {
      navigate("/verify/signup/address");
    }
  };

  return (
    <div>
      <nav className="text-center text-xl font-semibold py-4">
        <div> Let's create an account using your mobile number</div>
      </nav>

      <MobileNumberInput mobile={mobile} setMobile={setMobile} />
      <div>
        <label className="text-sm font-medium">Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Password</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Confirm Password</label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>
      {isCodeOpen && (
        <div className={`secondary-info flex flex-col gap-3`}>
          <div>
            <div className="flex justify-between">
              <input
                className="border rounded-sm px-3 py-2 text-sm"
                maxLength={6}
                value={otp}
                placeholder="Enter 6-digit code"
                onChange={(e) => {
                  const value = e.target.value;
                  setOtp(value);
                  console.log(value, value.length);
                  // auto-submit when 6 digits entered using the input value
                  if (value.length === 6) {
                    handleVerifyOtp(e);
                  }
                }}
              />
              <button
                disabled={disableVerifyBtn}
                type="button"
                onClick={async (e) => {
                  if (disableVerifyBtn) return;
                  await handleSendOtp(e);
                }}
                className="bg-blue-500 text-white py-2 px-4 rounded-md font-semibold mt-2 text-center cursor-pointer disabled:opacity-50"
              >
                Resend Otp
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <div className="text-sm text-red-600 mb-2">{error?.message}</div>}
      {success && <div className="text-sm text-green-600 mb-2">{success}</div>}
      <p>{resString}</p>

      <Button
        onKeyUp={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
        type="button"
        onClick={(e) => {
          if (!isCodeOpen) handleSendOtp(e);
          else handleVerifyOtp(e);
        }}
      >
        {!isCodeOpen ? "Send otp" : "Verify"}
      </Button>
    </div >
  )
}

export default SignupDetails
