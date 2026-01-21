import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom'
import { MapPin, CreditCard, ArrowLeft } from 'lucide-react';
import { getUserAddress } from '@/service/authService';
import useAuthStore from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { getCartItems, postOrder } from '@/service/userService';
import OrderItemCard from '@/components/card/OrderItemCard';
import { Card } from '@/components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import UnAuthorizedUser from '@/pages/public/UnAuthorizedUser';
import { toast } from '@/components/ui/Sonner';
import AddAddressModal from '@/pages/public/AddAddressModal';
import { extractError } from '@/utils/extractError';

const OrderCheckout = () => {
  const { state } = useLocation();

  const { id } = useParams()
  const [data, setData] = useState([]);
  const { isAuthenticated, user } = useAuthStore()


  const [addresses, setAddresses] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingDeliver, setLoadingDeliver] = useState(false);

  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    const primary = addresses.find(a => a.primaryAddress);
    if (primary && !selectedAddressId) {
      setSelectedAddressId(primary.id);
    }
  }, [addresses]);

  useEffect(() => {
    if (!state?.items) return;

    setLoadingItems(true);
    getCartItems(state.items)
      .then(res => setData(res))
      .catch(console.error)
      .finally(() => setLoadingItems(false));
  }, [state?.items]);

  const refreshAddresses = async () => {
    setLoadingAddress(true);
    try {
      const list = await getUserAddress();
      setAddresses(list);
    } catch (err) {
      console.error(err);
      toast.error(extractError(err, "Failed to load addresses"));
    }
    finally {
      setLoadingAddress(false);
    }
  };
  useEffect(() => {
    if (addresses.length !== 0) return;
    refreshAddresses();
  }, [])

  const handleDeliver = async () => {
    if (!data?.items?.length) {
      toast.error("Your cart is empty");
      return;
    }

    setLoadingDeliver(true)

    const order = {
      userId: user.id,
      currency: "INR",
      paymentMethod: "STRIPE",
      shippingAddress: addresses.find((a) => a.id === selectedAddressId),
      items: data?.items ?? []
    };

    try {
      const res = await postOrder(order);
      console.log(res);
      if (res?.status === "SUCCESS" && res?.sessionUrl) {
        window.location.assign(res.sessionUrl);
      } else {
        toast.error("Payment initialization failed");
      }
    } catch (err) {
      toast.error(extractError(err, "Unable to place order. Please try again."));
    }
    finally {
      setLoadingDeliver(false);
    }
  };
  if (!isAuthenticated) {
    return <UnAuthorizedUser />;
  }
  return (
    <div className="bg-background container max-w-6xl mx-auto ">
      <div className="flex items-center gap-4 mb-6">
        <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800">
          <ArrowLeft size={16} /> Back
        </button>
        <h2 className="text-2xl font-semibold">Checkout — Confirm delivery</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          <section className="rounded-2xl shadow p-4">
            <h3 className="font-medium text-lg mb-4">Order Summary</h3>

            {loadingItems ? (
              <div className="text-center">Loading order Items</div>
            ) : data?.items?.length === 0 ? (
              <div className="text-center">No order Items found</div>
            ) : (
              data?.items?.map((item, i) => <OrderItemCard key={i} item={item} />)
            )}

            <div className="mt-6 text-sm text-slate-500">Items are dispatched from nearby warehouses — estimated delivery: Before One day.</div>
          </section>

          <section className="rounded-2xl shadow p-4">
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-lg">Delivery Address</h3>
              <p className="text-sm text-slate-500">Choose where you'd like your order delivered</p>
            </div>

            <div className="mt-4 space-y-3">

              <AnimatePresence>

                {loadingAddress ? (
                  <div className="text-center p-4">Loading Addresses...</div>
                ) : addresses?.length === 0 ? (
                  <div className="text-center p-4 text-slate-500">No saved addresses. Add a new address to continue.</div>
                ) : (
                  addresses?.map(a => (
                    <motion.Label
                      key={a.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={`flex items-center border rounded-lg p-4 transition-shadow hover:shadow-md ${a.id === selectedAddressId ? 'ring-2 ring-blue-200' : ''
                        }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={a.id === selectedAddressId}
                        onChange={() => setSelectedAddressId(a.id)}
                        className="mr-4"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                          <div className="font-semibold truncate">{a.name}</div>
                          <div className="w-fit text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {a.label}
                          </div>
                          <div className="sm:ml-auto text-sm text-slate-500">{a.phone}</div>
                        </div>

                        {/* Address */}
                        <div className="mt-2 space-y-0.5 text-sm text-slate-600">
                          <div>{a.line1}</div>
                          <div>
                            {a.line2} — {a.city}, {a.state} —{' '}
                            <span className="font-medium">{a.pincode}</span>
                          </div>
                        </div>
                      </div>
                    </motion.Label>
                  ))
                )}
              </AnimatePresence>

              <div className="flex justify-between items-center pt-2 border-t">
                <Button onClick={() => setIsAddOpen(true)}>
                  + Add a new address
                </Button>

                <Button
                  disabled={!selectedAddressId || loadingDeliver}
                  onClick={handleDeliver}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow-lg"
                >
                  {loadingDeliver ? "Loading..." : "DELIVER HERE"}
                </Button>

              </div>
            </div>
            <AddAddressModal
              open={isAddOpen}
              onClose={() => setIsAddOpen(false)}
              onAdded={(saved) => {
                refreshAddresses();
              }}
            />
          </section>
        </div>

        {/* RIGHT: Price details */}
        <aside className="space-y-4">
          <Card className="rounded-2xl shadow p-4">
            <h4 className="font-medium text-lg">Price Details</h4>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
              </div>

              <div className="flex justify-between text-slate-600">
                <div>Platform Fee</div>
                {/* <div>{platformFee}</div> */}
              </div>

              <div className="border-t pt-3 flex justify-between text-base font-semibold">
                <div>Total Payable</div>
                {/* <div>{total}</div> */}
              </div>

              {/* <div className="text-sm text-green-600 mt-2">Your Total Savings on this order {Math.max(0, savings)}</div> */}
            </div>
          </Card>

          <Card className="rounded-2xl shadow p-4 flex items-center gap-3 text-sm text-slate-600">
            <MapPin size={18} />
            <div>
              <div className="font-medium">Safe and Secure Payments.</div>
              <div className="text-xs">100% Authentic products. Easy returns.</div>
            </div>
          </Card>


          <Card className="rounded-2xl shadow p-4 flex items-center gap-3 text-sm text-slate-600">
            <CreditCard size={18} />
            <div>
              <div className="font-medium">Payments</div>
              <div className="text-xs">Choose payment method at checkout</div>
            </div>
          </Card>
        </aside>
      </div >
    </div >
  )
}

export default OrderCheckout
