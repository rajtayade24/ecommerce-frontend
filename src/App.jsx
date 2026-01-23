import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster as Sonner } from "@/components/ui/Sonner";
import BackendLoader from "@/components/BackendLoader";
import AppContent from "@/AppContent";
import useAuthStore from "@/store/useAuthStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 30,
    },
  },
});

const App = () => {
  const darkMode = useAuthStore(state => state.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("dark", darkMode ? "true" : "false");
  }, [darkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Sonner theme={darkMode ? "dark" : "light"} />
        <BackendLoader>
          <AppContent />
        </BackendLoader>
      </CartProvider>
    </QueryClientProvider>
  );
};

export default App;
