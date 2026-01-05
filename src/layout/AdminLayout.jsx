// src/components/layouts/AdminLayout.jsx
import { Link, Outlet, useLocation } from "react-router-dom";
import AdminTopBar from "./AdminTopBar";
import Footer from "./Footer";
import useAuthStore from "@/store/useAuthStore";
import { useEffect } from "react";

export default function AdminLayout() {
  const location = useLocation()
  const { setMobileMenuOpen } = useAuthStore()
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname]);

  return (
    <div className="px-0 flex-1 bg-background">

      <AdminTopBar />

      <div className="min-h-screen  container flex-1 py-6 px-4 ">
        {/* Nested admin pages */}
        {/* <Outlet> is a placeholder component provided by React Router that renders the nested child routes of the current route. */}
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}
