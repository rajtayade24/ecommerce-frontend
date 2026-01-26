import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import { getMe } from "@/service/authService";

// layouts
import PublicLayout from "@/layout/PublicLayout";
import AdminLayout from "@/layout/AdminLayout";

// public pages
import Index from "@/pages/public/Index";
import Products from "@/pages/public/Products";
import ProductDetail from "@/pages/public/ProductDetail";
import Cart from "@/pages/public/Cart";
import Categories from "@/pages/public/Categories";
import MyOrders from "@/pages/public/MyOrders";
import UserOrderDetails from "@/pages/public/UserOrderDetails";
import OrderCheckout from "@/pages/public/order/OrderCheckout";
import PaymentSuccess from "@/pages/public/order/PaymentSuccess";
import MyProfile from "@/pages/public/MyProfile";
import AboutPage from "@/pages/public/AboutPage";
import PrivacyPolicyPage from "@/pages/public/PrivacyPolicyPage";
import TermsAndServices from "@/pages/public/TermsAndServices";
import Feedback from "@/pages/public/Feedback";
import NotFound from "@/pages/public/NotFound";

// auth
import UserVerification from "@/pages/auth/UserVerification";
import Signup from "@/pages/auth/Signup";
import SignupDetails from "@/pages/auth/SignupDetails";
import AddressDetails from "@/pages/auth/AddressDetails";
import Login from "@/pages/auth/Login";
import SignupGuard from "@/pages/auth/SignupGuard";

// admin
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ManageProducts from "@/pages/admin/ManageProducts";
import ProductForm from "@/pages/admin/ProductForm";
import ManageOrders from "@/pages/admin/ManageOrders";
import ManageCategories from "@/pages/admin/ManageCategories";
import CategoryForm from "@/pages/admin/CategoryForm";
import Users from "@/pages/admin/Users";
import UserDetails from "@/pages/admin/UserDetails";
import OrderDetails from "@/pages/admin/OrderDetails";
import Settings from "@/pages/admin/Settings";
import AddAddressModal from "@/pages/public/AddAddressModal";
import ManageFeedback from "@/pages/admin/ManageFeedback";
import AdminGuard from "@/pages/admin/AdminGuard";

const AppContent = () => {
  const setUser = useAuthStore(state => state.setUser);
  const setAuthenticated = useAuthStore(state => state.setAuthenticated);
  const setUserMainId = useAuthStore(state => state.setUserMainId);
  const setLoading = useAuthStore(state => state.setLoading);

  useEffect(() => {
    let mounted = true;

    getMe()
      .then((user) => {
        if (!mounted || !user) return;
        setAuthenticated(true);
        setUser(user);
        setUserMainId(user.id);
      })
      .catch(() => {
        setAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [setAuthenticated, setUser, setUserMainId]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/verify" element={<UserVerification />}>
          <Route path="signup" element={<Signup />}>
            <Route index element={<SignupDetails />} />
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
          <Route path="/cart" element={<Cart />} />
          <Route path="/me/orders" element={<MyOrders />} />
          <Route path="/me/orders/:id" element={<UserOrderDetails />} />
          <Route path="/order/checkout" element={<OrderCheckout />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/me/profile" element={<MyProfile />} />
          <Route path="/me/address/new" element={<AddAddressModal />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/feedbacks" element={<Feedback />} />
          <Route path="/term-service" element={<TermsAndServices />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="products/:id" element={<ProductForm />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="categories/:id" element={<CategoryForm />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<UserDetails />} />
          <Route path="feedbacks" element={<ManageFeedback />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppContent;
