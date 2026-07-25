import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Truck } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { getOrderById } from '@/service/adminService';
import useAuthStore from '@/store/useAuthStore';
import UnAuthorizedUser from '@/pages/public/UnAuthorizedUser';
import { Skeleton } from '@/components/ui/Skeleton';

const OrderDetailsSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto p-2 lg:p-4 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-8 w-56" />
        <Skeleton className="ml-auto h-5 w-36" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="rounded-2xl border p-4 space-y-5">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-6 w-24" />
            </div>

            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="w-20 h-20 rounded-lg" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            ))}
          </div>

          {/* Address */}
          <div className="rounded-2xl border p-4 space-y-3">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-4 w-52" />
            <Skeleton className="h-4 w-60" />
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>

        {/* Right */}
        <div className="space-y-4">
          <div className="rounded-2xl border p-4 space-y-3">
            <Skeleton className="h-6 w-28" />

            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}

            <Skeleton className="h-7 w-28" />
          </div>

          <div className="rounded-2xl border p-4 space-y-3">
            <Skeleton className="h-6 w-28" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>

          <Skeleton className="h-11 rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
}

const UserOrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(null);

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  useEffect(() => {
    if (!id || !isAuthenticated) return;
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

  if (isLoading) {
    return <OrderDetailsSkeleton />;
  }

  if (!isAuthenticated) {
    return <UnAuthorizedUser />;
  }

  if (isError) return <div className="p-8 text-center text-red-600">Error: {error?.message}</div>;

  return (
    <div className="max-w-4xl mx-auto  p-2 lg:p-4">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/me/orders"><Button variant="ghost"><ArrowLeft className="h-4 w-4" /> Back</Button></Link>
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
              <div className="mt-2 text-sm text-slate-500">Phone: {order.shippingAddress?.mobile}</div>
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
              <div className="mt-2 text-sm"><strong>Subtotal:</strong> ₹{order.itemsTotal?.toFixed(2) ?? '—'}</div>
              <div className="text-sm"><strong>Delivery:</strong> ₹{order.shippingTotal?.toFixed(2) ?? '—'}</div>
              <div className="text-sm"><strong>Tax:</strong> ₹{order.taxTotal?.toFixed(2) ?? '—'}</div>
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
