// src/components/layouts/PublicLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/layout/Navbar";
import Footer from "./Footer";
import { useEffect } from "react";
import useAuthStore from "../store/useAuthStore";

export default function PublicLayout() {
  const location = useLocation();
  const { setShowProfileDetails, setMobileMenuOpen } = useAuthStore();

  useEffect(() => {
    console.log(location)
    setMobileMenuOpen(false)
    setShowProfileDetails(false);
  }, [location.pathname]);

  return (
    <div className=" min-h-screen bg-background">
      {/* Public Navbar */}
      <Navbar />

      {/* Page content */}
      <main className="container pt-4">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
