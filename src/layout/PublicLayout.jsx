// src/components/layouts/PublicLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/layout/Navbar";
import Footer from "@/layout/Footer";
import { useEffect } from "react";
import useAuthStore from "@/store/useAuthStore";
import { toast } from "@/components/ui/Sonner";

export default function PublicLayout() {
  const location = useLocation();
  const { setShowProfileDetails, setMobileMenuOpen } = useAuthStore();

  useEffect(() => {
    console.log(location)
    setMobileMenuOpen(false)
    setShowProfileDetails(false);
  }, [location.pathname]);

  // useEffect(() => {
  //   const toasts = [
  //     () => toast("Hello world"),
  //     () => toast.success("Saved successfully"),
  //     () => toast.error("Something went wrong"),
  //     () => toast.warning("Careful!"),

  //     () => toast.success("Message deleted", {
  //       description: "You can undo this action.",
  //       action: {
  //         label: "Undo",
  //         onClick: () => {
  //           console.log("Undo clicked");
  //         },
  //       },
  //     })
  //   ];

  //   toasts.forEach((showToast, index) => {
  //     setTimeout(showToast, index * 5000);
  //   });
  // }, []);

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
