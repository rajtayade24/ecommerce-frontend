import { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/Sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "@/pages/public/Index";
import Products from "@/pages/public/Products";
import ProductDetail from "@/pages/public/ProductDetail";
import Cart from "@/pages/public/Cart";
import NotFound from "@/pages/public/NotFound";
import PublicLayout from "@/layout/PublicLayout";
import AdminLayout from "@/layout/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ManageProducts from "@/pages/admin/ManageProducts";
import ProductForm from '@/pages/admin/ProductForm'
import ManageOrders from "@/pages/admin/ManageOrders";
import Settings from "@/pages/admin/Settings";
import Users from "@/pages/admin/Users";
import UserVerification from "@/pages/auth/UserVerification";
import Signup from "@/pages/auth/Signup";
import Login from "@/pages/auth/Login";
import SignupDetails from "@/pages/auth/SignupDetails";
import AddressDetails from "@/pages/auth/AddressDetails";
import useAuthStore from "@/store/useAuthStore";
import ManageCategories from "@/pages/admin/ManageCategories";
import CategoryForm from "@/pages/admin/CategoryForm";
import Categories from "@/pages/public/Categories";
import OrderCheckout from "@/pages/public/order/OrderCheckout";
import PaymentSuccess from "@/pages/public/order/PaymentSuccess";
import OrderDetails from "@/pages/admin/OrderDetails";
import UserDetails from "@/pages/admin/UserDetails";
import MyOrders from "@/pages/public/MyOrders";
import UserOrderDetails from "@/pages/public/UserOrderDetails";
import AboutPage from "@/pages/public/AboutPage";
import { getMe } from "@/service/authService";
import MyProfile from "@/pages/public/MyProfile";
import AddAddressModal from "@/pages/public/order/AddAddressModal";
import SignupGuard from "@/pages/auth/SignupGuard";
import PrivacyPolicyPage from "@/pages/public/PrivacyPolicyPage";
import TermsAndServices from "@/pages/public/TermsAndServices";

const queryClient = new QueryClient();

const App = () => {

  const { setUser, isAuthenticated, setAuthenticated, setUserMainId, darkMode } = useAuthStore()
  console.log("authentication: ", isAuthenticated);
  useEffect(() => {
    getMe()
      .then((user => {
        if (user) {
          setAuthenticated(true);
          setUser(user);
          setUserMainId(user.id);
        }
      }))
  }, [])

  useEffect(() => {
    console.log(darkMode ? "dark mode" : "light mode");
    document.documentElement.classList.toggle("dark", darkMode);
    try { localStorage.setItem("dark", darkMode ? "true" : "false"); } catch (e) { }
  }, [darkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* <TooltipProvider> */}
      <CartProvider>
        <Sonner theme={darkMode? "dark": "light"} />
        <BrowserRouter>
          <Routes>
            {/* Public routes wrapped by PublicLayout (Navbar included) */}
            <Route path="/verify" element={<UserVerification />}>
              <Route path="signup" element={<Signup />}>
                <Route index element={<SignupDetails />} />
                {/* Protected steps */}
                <Route element={<SignupGuard />}>
                  <Route path="address" element={<AddressDetails />} />
                </Route>
              </Route>

              <Route path="login" element={<Login />} />
            </Route>

            <Route element={<PublicLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/carts" element={<Cart />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/orders/:id" element={<UserOrderDetails />} />
              <Route path="/order/checkout" element={<OrderCheckout />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/me/profile" element={<MyProfile />} />
              <Route path="/address/new" element={<AddAddressModal />} />

              <Route path="/about" element={<AboutPage />} />
              <Route path="/term-service" element={<TermsAndServices />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            </Route>

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<ManageProducts />} />
              <Route path="categories" element={<ManageCategories />} />
              <Route path="categories/:id" element={<CategoryForm />} />
              <Route path="products/:id" element={<ProductForm />} />
              <Route path="orders" element={<ManageOrders />} />
              <Route path="orders/:id" element={<OrderDetails />} />
              <Route path="users" element={<Users />} />
              <Route path="users/:id" element={<UserDetails />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>
      </CartProvider>
      {/* </TooltipProvider> */}
    </QueryClientProvider >
  );
};

export default App;
