import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { verifyPayment } from "@/service/userService";

const PaymentSuccess = () => {
  // used to read and manipulate the query parameters in the URL.
  const [searchParams] = useSearchParams();// http://localhost:5173/payment-success?session_id=cs_test_a1QFrVGgJeNpK6Jce0H626VkfMG1UlXdl3g5Y26JhTwttxf2pEjgOIoFdE

  // session_id is a query parameter.
  const sessionId = searchParams.get("session_id"); // Here ?session_id=cs_test_a1QFrVGgJeNpK6Jce0H626VkfMG1UlXdl3g5Y26JhTwttxf2pEjgOIoFdE 

  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); // loading | success | failed
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setStatus("failed");
      setMessage("Invalid payment session.");
      return;
    }

    const verify = async () => {
      try {
        const res = await verifyPayment(sessionId);
        setStatus("success");
        setMessage(res || "Payment completed successfully");
      } catch (err) {
        setStatus("failed");
        setMessage("Payment verification failed");
      }
    };

    verify();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        {status === "loading" && (
          <div>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
            <h2 className="mt-4 text-lg font-semibold">Verifying payment...</h2>
            <p className="text-sm text-slate-500 mt-2">
              Please wait while we confirm your transaction
            </p>
          </div>
        )}

        {status === "success" && (
          <div>
            <CheckCircle className="mx-auto h-14 w-14 text-green-600" />
            <h2 className="mt-4 text-xl font-semibold text-green-700">
              Payment Successful 🎉
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Your order has been placed successfully.
            </p>

            <div className="mt-6 flex gap-3 justify-center">
              <Button onClick={() => navigate("/orders")}>
                View Orders
              </Button>
              <Button variant="outline" onClick={() => navigate("/products")}>
                Continue Shopping
              </Button>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div>
            <XCircle className="mx-auto h-14 w-14 text-red-600" />
            <h2 className="mt-4 text-xl font-semibold text-red-700">
              Payment Failed
            </h2>
            <p className="text-sm text-slate-600 mt-2">{message}</p>

            <div className="mt-6">
              <Button onClick={() => navigate("/")}>
                Go Home
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
