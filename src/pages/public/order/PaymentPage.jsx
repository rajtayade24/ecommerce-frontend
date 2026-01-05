import { useState } from "react";
import { ArrowLeft, CreditCard, Smartphone, Gift, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useParams, useLocation, useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const { id } = useParams()
  const { state } = useLocation();

  const product = state?.product;
  const total = state?.total;

  const [upi, setUpi] = useState("");
  const [method, setMethod] = useState("upi");

  const price = 349;
  const platformFee = 7;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <ArrowLeft className="cursor-pointer" />
        <h1 className="text-xl font-semibold">Complete Payment</h1>
        <span className="ml-auto text-sm text-green-600 font-medium">🔒 100% Secure</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Payment Methods */}
        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3">
              {/* Methods */}
              <div className="border-r">
                <PaymentOption
                  active={method === "upi"}
                  icon={<Smartphone />}
                  title="UPI"
                  subtitle="Pay by any UPI app"
                  onClick={() => setMethod("upi")}
                />
                <PaymentOption
                  active={method === "card"}
                  icon={<CreditCard />}
                  title="Credit / Debit Card"
                  subtitle="Visa, MasterCard, RuPay"
                  onClick={() => setMethod("card")}
                />
                <PaymentOption
                  active={method === "cod"}
                  icon={<Truck />}
                  title="Cash on Delivery"
                  subtitle="Pay when item arrives"
                  onClick={() => setMethod("cod")}
                />
                {/* <PaymentOption
                  active={method === "gift"}
                  icon={<Gift />}
                  title="Gift Card"
                  subtitle="Apply gift card"
                  onClick={() => setMethod("gift")}
                /> */}
              </div>

              {/* Details */}
              <div className="md:col-span-2 p-6">
                {method === "upi" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <h2 className="font-semibold mb-4">Add new UPI ID</h2>
                    <div className="flex gap-3">
                      <input
                        value={upi}
                        onChange={(e) => setUpi(e.target.value)}
                        placeholder="Enter your UPI ID"
                        className="flex-1 border rounded-xl px-4 py-2 focus:outline-none"
                      />
                      <Button variant="outline">Verify</Button>
                    </div>
                    <Button className="w-full mt-6 rounded-xl" disabled={!upi}>
                      Pay ₹{total}
                    </Button>
                  </motion.div>
                )}

                {method === "card" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="font-semibold mb-4">Add Card Details</h2>
                    <input className="w-full border rounded-xl px-4 py-2 mb-3" placeholder="Card Number" />
                    <div className="grid grid-cols-2 gap-3">
                      <input className="border rounded-xl px-4 py-2" placeholder="MM / YY" />
                      <input className="border rounded-xl px-4 py-2" placeholder="CVV" />
                    </div>
                    <Button className="w-full mt-6 rounded-xl">Pay ₹{total}</Button>
                  </motion.div>
                )}

                {method === "cod" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="font-semibold">Cash on Delivery</h2>
                    <p className="text-sm text-slate-500 mt-2">Pay when your order is delivered.</p>
                    <Button className="w-full mt-6 rounded-xl">Place Order</Button>
                  </motion.div>
                )}

                {/* {method === "gift" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="font-semibold mb-4">Apply Gift Card</h2>
                    <input className="w-full border rounded-xl px-4 py-2" placeholder="Enter Gift Card Code" />
                    <Button className="w-full mt-6 rounded-xl">Apply</Button>
                  </motion.div>
                )} */}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Price Summary */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Price Details</h3>
            <div className="flex justify-between text-sm mb-2">
              <span>Price (1 item)</span>
              <span>₹{price}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>Platform Fee</span>
              <span>₹{platformFee}</span>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between font-semibold text-lg text-blue-600">
              <span>Total Amount</span>
              <span>₹{total}</span>
            </div>

            <div className="mt-6 bg-green-50 text-green-700 p-4 rounded-xl text-sm">
              🎉 5% Cashback available with select payment offers
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PaymentOption({ icon, title, subtitle, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex gap-3 p-4 cursor-pointer border-b transition ${active ? "bg-blue-50 border-l-4 border-l-blue-600" : "hover:bg-slate-50"
        }`}
    >
      <div className="text-slate-600">{icon}</div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}