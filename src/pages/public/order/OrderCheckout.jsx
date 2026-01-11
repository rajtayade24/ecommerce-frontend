import React, { useState, useEffect } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom'
import { MapPin, CreditCard, ArrowLeft } from 'lucide-react';
import { getUserAddress } from '@/service/authService';
import useAuthStore from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { getCartItems, postOrder } from '@/service/userService';
import OrderItemCard from '@/components/card/OrderItemCard';
import { Label } from '@/components/ui/Label';
import { Card } from '@/components/ui/Card';
import AddAddressModal from '@/pages/public/order/AddAddressModal';
import UnAuthorizedUser from '@/pages/public/UnAuthorizedUser';

const OrderCheckout = () => {
  const { state } = useLocation();

  const { id } = useParams()
  const [data, setData] = useState([]);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!state?.items) return;
    setLoadinItems(true);

    getCartItems(state.items)
      .then(res => {
        setData(res);
        setLoadinItems(false);
      })
      .catch(err => console.log(err));
  }, [state.items]);

  const [addresses, setAddresses] = useState([]);
  const { user } = useAuthStore()
  const primaryAddress = addresses?.find(a => a.primaryAddress === true);
  const [selectedAddressId, setselectedAddressId] = useState(primaryAddress ?? null)
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [loadinItems, setLoadinItems] = useState(false);

  const refreshAddresses = async () => {
    setLoadingAddress(true);
    const list = await getUserAddress(user.id);
    setAddresses(list);
    setLoadingAddress(false);
  };

  useEffect(() => {
    setLoadingAddress(true);
    const fetchAddress = async () => {
      const adds = await getUserAddress(user?.id ?? 1);
      setAddresses(adds);
      setLoadingAddress(false);
    }
    fetchAddress();
  }, []);

  useEffect(() => {
    if (addresses.length > 0) {
      const primary = addresses.find(a => a.primaryAddress === true);
      setselectedAddressId(primary?.id ?? addresses[0]?.id ?? null); // fallback to first address if none primary
    }
  }, [addresses]);

  const handleDeliver = async () => {
    const order = {
      userId: user.id,
      currency: "INR",
      paymentMethod: "STRIPE",
      shippingAddress: addresses.find((a) => a.id === selectedAddressId),
      items: data.items
    }

    const res = await postOrder(order);

    if (res?.status === "SUCCESS" && res?.sessionUrl) {
      window.location.href = res.sessionUrl; // redirect to Stripe
    } else {
      alert("Payment initialization failed");
    }
  };
  if (!isAuthenticated) {
    return <UnAuthorizedUser />;
  }
  return (
    <div className="bg-background max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800">
          <ArrowLeft size={16} /> Back
        </button>
        <h2 className="text-2xl font-semibold">Checkout — Confirm delivery</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          <section className="rounded-2xl shadow p-6">
            <h3 className="font-medium text-lg mb-4">Order Summary</h3>

            {loadinItems ? (
              <div className="text-center">Loading order Items</div>
            ) : data?.items?.length === 0 ? (
              <div className="text-center">No order Items found</div>
            ) : (
              data?.items?.map((item, i) => <OrderItemCard key={i} item={item} />)
            )}

            <div className="mt-6 text-sm text-slate-500">Items are dispatched from nearby warehouses — estimated delivery: Before One day.</div>
          </section>

          <section className="rounded-2xl shadow p-6">
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-lg">Delivery Address</h3>
              <p className="text-sm text-slate-500">Choose where you'd like your order delivered</p>
            </div>

            <div className="mt-4 space-y-3">

              {loadingAddress ? (
                <div className="text-center p-6">Loading Addresses...</div>
              ) : addresses?.length === 0 ? (
                <div className="text-center p-6 text-slate-500">No saved addresses. Add a new address to continue.</div>
              ) : (
                addresses?.map(a => (
                  <Label
                    key={a.id}
                    className={`flex items-center border rounded-lg p-4 transition-shadow hover:shadow-md ${a.id === selectedAddressId ? 'ring-2 ring-blue-200' : ''
                      }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={a.id === selectedAddressId}
                      onChange={() => setselectedAddressId(a.id)}
                      className="mr-4"
                    />

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold">{a.name}</div>
                        <div className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">{a.label}</div>
                        <div className="ml-auto text-sm text-slate-500">{a.phone}</div>
                      </div>

                      <div className="text-sm text-slate-600 mt-2">{a.line1}</div>
                      <div className="text-sm text-slate-600">{a.line2} — {a.city}, {a.state} — <span className="font-medium">{a.pincode}</span></div>
                    </div>

                    <Button
                      onClick={handleDeliver}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow-lg"
                    >
                      DELIVER HERE
                    </Button>
                  </Label>
                ))
              )}

              <div className="pt-2 border-t">
                <Button onClick={() => setIsAddOpen(true)}>
                  + Add a new address
                </Button>

                <AddAddressModal
                  open={isAddOpen}
                  onClose={() => setIsAddOpen(false)}
                  onAdded={(saved) => {
                    refreshAddresses();
                    setselectedAddressId(saved.id);
                  }}
                />
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT: Price details */}
        <aside className="space-y-4">
          <Card className="rounded-2xl shadow p-6">
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
