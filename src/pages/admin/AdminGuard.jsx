import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";

/**
 * Guards admin routes.
 * - Requires authentication
 * - Requires ADMIN role
 */
const AdminGuard = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);
  const location = useLocation();
  const loading = useAuthStore(state => state.loading);

  if (loading) {
    return <div>Checking session...</div>; // or spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/verify/login" state={{ from: location }} replace />;
  }

  // Logged in but not admin
  const roles = user?.roles || [];
  const isAdmin = roles.includes("ADMIN");

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminGuard;
