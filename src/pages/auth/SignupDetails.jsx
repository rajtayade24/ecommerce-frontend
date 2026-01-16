import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

import { useNavigate } from "react-router-dom";
import { useSignupStore } from "@/store/useSignupStore";
import MobileNumberInput from '@/components/MobileNumberInput'

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from '@/firebase';



function SignupDetails() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

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
    setDisableVerifyBtn,
    verString,
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
    useSignupStore.setState({ verString: "" });
    setLoading(true)

    if (!mobile || mobile.trim().length === 0) {
      useSignupStore.setState({ verString: "Mobile number is required" });
      return;
    }

    if (!isValidIndianMobile(mobile)) {
      useSignupStore.setState({ verString: "Enter a valid 10-digit mobile number" });
      return;
    }

    if (!name !== name.length <= 0) {
      useSignupStore.setState({ verString: "Name is required" });
      return;
    }
    if (!password) {
      useSignupStore.setState({ verString: "Password is required" });
      return;
    }
    if (!isValidPassword(password)) {
      useSignupStore.setState({
        verString: "Password must be at least 6 characters and contain letters and numbers",
      });
      return;
    }

    if (password !== confirmPassword) {
      useSignupStore.setState({ verString: "Passwords do not match" });
      return;
    }

    try {
      await sendOtpStore().then(() => {
        useSignupStore.setState({ isCodeOpen: true, verString: "Otp sent" });
        setTimeRemaining(30);
        setDisableVerifyBtn(true);
      })
    } catch (err) {
      console.error(err);
      useSignupStore.setState({ verString: err.message });
    } finally {
      setLoading(false)
    }
  };

  const handleVerifyOtp = async () => {
    useSignupStore.setState({ verString: "" });
    setLoading(true)
    try {
      const result = await submitOtp(otp);

      if (result.success == true) {
        navigate("/verify/signup/address");
        useSignupStore.setState({ verString: "" });
      }
    } catch (err) {
      useSignupStore.setState({ error: "Invalid OTP" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeRemaining <= 0) {
      setDisableVerifyBtn(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  useEffect(() => {
    if (otp.length === 6 && window.confirmationResult) {
      handleVerifyOtp();
    }
  }, [otp]);

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
          placeholder="abcdef@123"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Confirm Password</label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="abcdef@123"
          required
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
                onChange={(e) => setOtp(e.target.value)}
                required
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
                {timeRemaining > 0 ? timeRemaining : "Resend Otp"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`text-sm mb-2 ${success ? "text-green-600" : "text-red-600"}`}>{verString}</div>

      <Button
        onKeyUp={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
        type="button"
        disabled={isCodeOpen && otp.length !== 6}
        onClick={(e) => {
          if (!isCodeOpen) handleSendOtp(e);
          else handleVerifyOtp(e);
        }}
      >
        {isLoading ? "Loading..." : !isCodeOpen ? "Send otp" : "Verify"}
      </Button>
    </div >
  )
}

export default SignupDetails













// function SignupDetails() {
//   const navigate = useNavigate();
//   const [otp, setOtp] = useState("");
//   const [isLoading, setLoading] = useState(false);
//   const [timeRemaining, setTimeRemaining] = useState(0);

//   // pull everything once from the store (avoid multiple calls)
//   const {
//     name,
//     setName,
//     mobile,
//     setMobile,
//     password,
//     setPassword,
//     confirmPassword,
//     setConfirmPassword,
//     isCodeOpen,
//     setDisableVerifyBtn,
//     verString,
//     success,
//   } = useSignupStore();

//   const isValidIndianMobile = (mobile) => {
//     return /^[6-9]\d{9}$/.test(mobile);
//   };

//   const isValidPassword = (password) => {
//     return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password);
//   };

//   const handleSendOtp = async (e) => {
//     e?.preventDefault?.();
//     useSignupStore.setState({ verString: "" });
//     setLoading(true)

//     if (!mobile || mobile.trim().length === 0) {
//       useSignupStore.setState({ verString: "Mobile number is required" });
//       return;
//     }

//     if (!isValidIndianMobile(mobile)) {
//       useSignupStore.setState({ verString: "Enter a valid 10-digit mobile number" });
//       return;
//     }

//     if (!name !== name.length <= 0) {
//       useSignupStore.setState({ verString: "Name is required" });
//       return;
//     }
//     if (!password) {
//       useSignupStore.setState({ verString: "Password is required" });
//       return;
//     }
//     if (!isValidPassword(password)) {
//       useSignupStore.setState({
//         verString: "Password must be at least 6 characters and contain letters and numbers",
//       });
//       return;
//     }

//     if (password !== confirmPassword) {
//       useSignupStore.setState({ verString: "Passwords do not match" });
//       return;
//     }

//     const phoneNumber = `+91${mobile}`;

//     try {
//       if (!window.recaptchaVerifier) {
//         window.recaptchaVerifier = new RecaptchaVerifier(
//           auth,
//           "recaptcha-container",
//           { size: "invisible" }
//         );
//       }

//       const appVerifier = window.recaptchaVerifier;

//       const confirmationResult = await signInWithPhoneNumber(
//         auth,
//         phoneNumber,
//         appVerifier
//       );

//       window.confirmationResult = confirmationResult;

//       useSignupStore.setState({ isCodeOpen: true, verString: "Otp sent" });
//       setTimeRemaining(30);
//       setDisableVerifyBtn(true);

//     } catch (err) {
//       console.error(err);
//       useSignupStore.setState({ verString: err.message });
//     } finally {
//       setLoading(false)
//     }
//   };

//   const handleVerifyOtp = async () => {
//     useSignupStore.setState({ verString: "" });
//     setLoading(true)
//     try {
//       // const result = await submitOtp(otp);

//       const result = await window.confirmationResult.confirm(otp);
//       const idToken = await result.user.getIdToken();

//       console.log(result);
//       useSignupStore.setState({ verString: "Otp verified" });

//       // Send ID token to backend signup API
//       // fetch("/api/auth/signup", { Authorization: Bearer idToken })

//       // if (result.success == true) {
//       navigate("/verify/signup/address");
//       useSignupStore.setState({ verString: "" });
//       // }
//     } catch (err) {
//       useSignupStore.setState({ error: "Invalid OTP" });
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     if (timeRemaining <= 0) {
//       setDisableVerifyBtn(false);
//       return;
//     }

//     const timer = setInterval(() => {
//       setTimeRemaining((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeRemaining]);

//   useEffect(() => {
//     if (otp.length === 6 && window.confirmationResult) {
//       handleVerifyOtp();
//     }
//   }, [otp]);

//   return (
//     <div>
//       {/* MUST EXIST BEFORE send OTP */}
//       {/* <div id="recaptcha-container" className="max-h-[70vh]" inert></div> */}

//       <nav className="text-center text-xl font-semibold py-4">
//         <div> Let's create an account using your mobile number</div>
//       </nav>

//       <MobileNumberInput mobile={mobile} setMobile={setMobile} />
//       <div>
//         <label className="text-sm font-medium">Name</label>
//         <Input
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="Full name"
//           required
//         />
//       </div>

//       <div>
//         <label className="text-sm font-medium">Password</label>
//         <Input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="abcdef@123"
//           required
//         />
//       </div>

//       <div>
//         <label className="text-sm font-medium">Confirm Password</label>
//         <Input
//           type="password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           placeholder="abcdef@123"
//           required
//         />
//       </div>
//       {isCodeOpen && (
//         <div className={`secondary-info flex flex-col gap-3`}>
//           <div>
//             <div className="flex justify-between">
//               <input
//                 className="border rounded-sm px-3 py-2 text-sm"
//                 maxLength={6}
//                 value={otp}
//                 placeholder="Enter 6-digit code"
//                 onChange={(e) => setOtp(e.target.value)}
//                 required
//               />
//               <button
//                 disabled={disableVerifyBtn}
//                 type="button"
//                 onClick={async (e) => {
//                   if (disableVerifyBtn) return;
//                   await handleSendOtp(e);
//                 }}
//                 className="bg-blue-500 text-white py-2 px-4 rounded-md font-semibold mt-2 text-center cursor-pointer disabled:opacity-50"
//               >
//                 {timeRemaining > 0 ? timeRemaining : "Resend Otp"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className={`text-sm mb-2 ${success ? "text-green-600" : "text-red-600"}`}>{verString}</div>

//       <Button
//         onKeyUp={(e) => {
//           if (e.key === "Enter") e.preventDefault();
//         }}
//         type="button"
//         disabled={isCodeOpen && otp.length !== 6}
//         onClick={(e) => {
//           // if (!isCodeOpen) handleSendOtp(e);
//           // else handleVerifyOtp(e);
//           if (!mobile || mobile.trim().length === 0) {
//             useSignupStore.setState({ verString: "Mobile number is required" });
//             return;
//           }

//           if (!isValidIndianMobile(mobile)) {
//             useSignupStore.setState({ verString: "Enter a valid 10-digit mobile number" });
//             return;
//           }

//           if (!name !== name.length <= 0) {
//             useSignupStore.setState({ verString: "Name is required" });
//             return;
//           }
//           if (!password) {
//             useSignupStore.setState({ verString: "Password is required" });
//             return;
//           }
//           if (!isValidPassword(password)) {
//             useSignupStore.setState({
//               verString: "Password must be at least 6 characters and contain letters and numbers",
//             });
//             return;
//           }

//           if (password !== confirmPassword) {
//             useSignupStore.setState({ verString: "Passwords do not match" });
//             return;
//           }
//           navigate("/verify/signup/address");
//           useSignupStore.setState({ verString: "" });
//         }}
//       >
//         {/* {isLoading ? "Loading..." : !isCodeOpen ? "Send otp" : "Verify"} */}
//         verify
//       </Button>
//     </div >
//   )
// }

// export default SignupDetails;











// function SignupDetails() {
//   const navigate = useNavigate();
//   const [otp, setOtp] = useState("");
//   const [isLoading, setLoading] = useState(false);
//   const [timeRemaining, setTimeRemaining] = useState(0);

//   // pull everything once from the store (avoid multiple calls)
//   const {
//     name,
//     setName,
//     mobile,
//     setMobile,
//     password,
//     setPassword,
//     confirmPassword,
//     setConfirmPassword,
//     isCodeOpen,
//     disableVerifyBtn,
//     setDisableVerifyBtn,
//     verString,
//     sendOtpStore,
//     error,
//     success,
//     submitOtp,
//   } = useSignupStore();

//   const isValidIndianMobile = (mobile) => {
//     return /^[6-9]\d{9}$/.test(mobile);
//   };

//   const isValidPassword = (password) => {
//     return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password);
//   };

//   const handleSendOtp = async (e) => {
//     e?.preventDefault?.();
//     useSignupStore.setState({ verString: "" });
//     setLoading(true)

//     if (!mobile || mobile.trim().length === 0) {
//       useSignupStore.setState({ verString: "Mobile number is required" });
//       return;
//     }

//     if (!isValidIndianMobile(mobile)) {
//       useSignupStore.setState({ verString: "Enter a valid 10-digit mobile number" });
//       return;
//     }

//     if (!name !== name.length <= 0) {
//       useSignupStore.setState({ verString: "Name is required" });
//       return;
//     }
//     if (!password) {
//       useSignupStore.setState({ verString: "Password is required" });
//       return;
//     }
//     if (!isValidPassword(password)) {
//       useSignupStore.setState({
//         verString: "Password must be at least 6 characters and contain letters and numbers",
//       });
//       return;
//     }

//     if (password !== confirmPassword) {
//       useSignupStore.setState({ verString: "Passwords do not match" });
//       return;
//     }

//     try {
//       await sendOtpStore().then(() => {
//         useSignupStore.setState({ isCodeOpen: true, verString: "Otp sent" });
//         setTimeRemaining(30);
//         setDisableVerifyBtn(true);
//       })
//     } catch (err) {
//       console.error(err);
//       useSignupStore.setState({ verString: err.message });
//     } finally {
//       setLoading(false)
//     }
//   };

//   const handleVerifyOtp = async () => {
//     useSignupStore.setState({ verString: "" });
//     setLoading(true)
//     try {
//       const result = await submitOtp(otp);

//       if (result.success == true) {
//         navigate("/verify/signup/address");
//         useSignupStore.setState({ verString: "" });
//       }
//     } catch (err) {
//       useSignupStore.setState({ error: "Invalid OTP" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (timeRemaining <= 0) {
//       setDisableVerifyBtn(false);
//       return;
//     }

//     const timer = setInterval(() => {
//       setTimeRemaining((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeRemaining]);

//   useEffect(() => {
//     if (otp.length === 6 && window.confirmationResult) {
//       handleVerifyOtp();
//     }
//   }, [otp]);

//   return (
//     <div>

//       <nav className="text-center text-xl font-semibold py-4">
//         <div> Let's create an account using your mobile number</div>
//       </nav>

//       <MobileNumberInput mobile={mobile} setMobile={setMobile} />
//       <div>
//         <label className="text-sm font-medium">Name</label>
//         <Input
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="Full name"
//           required
//         />
//       </div>

//       <div>
//         <label className="text-sm font-medium">Password</label>
//         <Input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="abcdef@123"
//           required
//         />
//       </div>

//       <div>
//         <label className="text-sm font-medium">Confirm Password</label>
//         <Input
//           type="password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           placeholder="abcdef@123"
//           required
//         />
//       </div>
//       {isCodeOpen && (
//         <div className={`secondary-info flex flex-col gap-3`}>
//           <div>
//             <div className="flex justify-between">
//               <input
//                 className="border rounded-sm px-3 py-2 text-sm"
//                 maxLength={6}
//                 value={otp}
//                 placeholder="Enter 6-digit code"
//                 onChange={(e) => setOtp(e.target.value)}
//                 required
//               />
//               <button
//                 disabled={disableVerifyBtn}
//                 type="button"
//                 onClick={async (e) => {
//                   if (disableVerifyBtn) return;
//                   await handleSendOtp(e);
//                 }}
//                 className="bg-blue-500 text-white py-2 px-4 rounded-md font-semibold mt-2 text-center cursor-pointer disabled:opacity-50"
//               >
//                 {timeRemaining > 0 ? timeRemaining : "Resend Otp"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className={`text-sm mb-2 ${success ? "text-green-600" : "text-red-600"}`}>{verString}</div>

//       <Button
//         onKeyUp={(e) => {
//           if (e.key === "Enter") e.preventDefault();
//         }}
//         type="button"
//         disabled={isCodeOpen && otp.length !== 6}
//         onClick={(e) => {
//           if (!isCodeOpen) handleSendOtp(e);
//           else handleVerifyOtp(e);
//         }}
//       >
//         {isLoading ? "Loading..." : !isCodeOpen ? "Send otp" : "Verify"}
//       </Button>
//     </div >
//   )
// }

// export default SignupDetails

