import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Truck } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getOrderById } from '@/service/adminService';
import useAuthStore from '@/store/useAuthStore';
import UnAuthorizedUser from '@/pages/public/UnAuthorizedUser';

const UserOrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(null);

  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <UnAuthorizedUser />;
  }

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    setError(null);

    getOrderById(id)
      .then((res) => {
        if (!mounted) return;
        setOrder(res);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.message || String(err));
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, [id]);

  if (isLoading) return <div className="p-8 text-center">Loading order...</div>;
  if (isError) return <div className="p-8 text-center text-red-600">Error: {error?.message}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/orders"><Button variant="ghost"><ArrowLeft className="h-4 w-4" /> Back</Button></Link>
        <h1 className="text-2xl font-semibold">Order #{order.orderNumber}</h1>
        <div className="ml-auto text-sm text-slate-500">{format(new Date(order.createdAt), 'dd MMM yyyy, hh:mm a')}</div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <section className="bg-muted/30 rounded-2xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Items ({order.items.length})</div>
              <div className="text-lg font-semibold">₹{order.totalAmount.toFixed(2)}</div>
            </div>

            <div className="mt-4 space-y-4">
              {order.items.map((it) => (
                <div key={it.variantId || it.productId} className="flex gap-4 items-center">
                  <div className="w-20 h-20 rounded overflow-hidden bg-slate-50">
                    <img src={it.image || 'https://via.placeholder.com/120'} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold">{it.productName}</div>
                    <div className="text-sm text-slate-500">{it.variantLabel}</div>
                    <div className="mt-2 text-sm">₹{it.unitPrice} × {it.quantity} = ₹{it.lineTotal}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-slate-500">Status</div>
                    <div className="font-medium">{order.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl p-4 shadow">
            <h3 className="font-semibold mb-3">Shipping Address</h3>
            <div className="text-sm text-slate-700">
              <div className="font-medium">{order.shippingAddress?.name}</div>
              <div>{order.shippingAddress?.line1}</div>
              <div>{order.shippingAddress?.line2}</div>
              <div>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</div>
              <div className="mt-2 text-sm text-slate-500">Phone: {order.shippingAddress?.phone}</div>
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="p-4 rounded-2xl shadow">
            <div className="flex items-center gap-2">
              <div className="text-sm text-slate-500">Order Status</div>
              <Badge>{order.status}</Badge>
            </div>

            <div className="mt-4 text-sm">
              <div><strong>Payment:</strong> {order.paymentMethod} • {order.currency} • {order.paymentStatus || '—'}</div>
              <div className="mt-2 text-sm"><strong>Subtotal:</strong> ₹{order.subtotal?.toFixed(2) ?? '—'}</div>
              <div className="text-sm"><strong>Delivery:</strong> ₹{order.deliveryFee?.toFixed(2) ?? '—'}</div>
              <div className="text-sm font-semibold mt-3">Total: ₹{order.totalAmount.toFixed(2)}</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">Tracking</div>
              {order.trackingUrl && <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600">Open carrier</a>}
            </div>

            {/* timeline */}
            <div className="space-y-3 text-sm">
              {/* {tracking && tracking.length > 0 ? (
                tracking.map(t => (
                  <div key={t.id} className="flex gap-3">
                    <div className="w-2">
                      <div className="w-2 h-2 rounded-full bg-slate-400 mt-1"></div>
                    </div>
                    <div>
                      <div className="font-medium">{t.status} <span className="text-xs text-slate-400">• {t.location ?? ''}</span></div>
                      <div className="text-xs text-slate-500">{format(new Date(t.timestamp), 'dd MMM yyyy, hh:mm a')}</div>
                      <div className="text-sm text-slate-600">{t.message}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500">No tracking events yet.</div>
              )} */}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow text-center">
            <Button variant="outline" className="w-full" onClick={() => window.print()}>
              Print / Invoice
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default UserOrderDetails;
