import { Navigate, Outlet } from "react-router-dom";
import { useSignupStore } from "@/store/useSignupStore";

export default function SignupGuard() {
  const { mobile } = useSignupStore();

  // Reload → Zustand reset → go back to first step
  if (!mobile) {
    return <Navigate to="/verify/signup" replace />;
  }

  return <Outlet />;
}
