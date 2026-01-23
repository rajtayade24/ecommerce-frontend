// src/pages/admin/OrderDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Printer,
  CheckCircle,
  XCircle,
  CreditCard,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatMoney } from "@/utils/formatMoney";
import { getOrderById, markOrderComplete, cancelOrder } from "@/service/adminService";
import { Card } from "@/components/ui/Card";
import { toast } from "@/components/ui/Sonner";

const STATUS_BADGE = {
  PENDING: "bg-gray-100 text-gray-800",
  PAID: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-yellow-100 text-yellow-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};
export default function OrderDetails() {
  const { id } = useParams(); // id expected to be orderNumber or DB id depending on route
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

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

  const doMarkComplete = async () => {
    if (!order) return;
    if (!window.confirm(`Mark ${order.orderNumber} as COMPLETED?`)) return;
    try {
      setBusy(true);
      // If your service returns updated order, use it; otherwise refetch after action
      await markOrderComplete(order.orderNumber);
      const refreshed = await getOrderById(order.orderNumber);
      setOrder(refreshed);
    } catch (err) {
      toast.error(err?.message || "Failed to mark complete");
    } finally {
      setBusy(false);
    }
  };

  const doCancel = async () => {
    if (!order) return;
    if (!window.confirm(`Cancel ${order.orderNumber}? This cannot be undone.`)) return;
    try {
      setBusy(true);
      await cancelOrder(order.orderNumber);
      const refreshed = await getOrderById(order.orderNumber);
      setOrder(refreshed);
    } catch (err) {
      toast.error(err?.message || "Failed to cancel order");
    } finally {
      setBusy(false);
    }
  };

  const exportJson = () => {
    if (!order) return;
    const blob = new Blob([JSON.stringify(order, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${order.orderNumber || id}_order.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="p-4">Loading order…</div>;
  if (error) return <div className="p-4 text-red-600">Error: {String(error.message ?? error)}</div>;
  if (!order) return <div className="p-4 text-muted-foreground">Order not found</div>;

  const items = order.items ?? [];
  const createdAt = order.createdAt ? new Date(order.createdAt).toLocaleString() : "—";

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Order {order.orderNumber}</h2>
            <div className="text-sm text-muted-foreground">Placed on <span className="font-medium">{createdAt}</span></div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={exportJson} title="Export JSON">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button variant="outline" onClick={() => window.print()} title="Print Invoice">
            <Printer className="h-4 w-4 mr-2" /> Print
          </Button>
        </div>
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className=" rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Customer</div>
              <div className="font-medium">{order.customer ?? order.user?.email ?? "—"}</div>
              <div className="text-sm text-muted-foreground">{order.user?.name ?? ""}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Phone</div>
              <div className="font-medium">{order.shippingAddress?.phone ?? order.user?.mobile ?? "—"}</div>
            </div>
          </div>

          <hr className="my-3" />

          <div className="text-xs text-muted-foreground">Shipping address</div>
          <div className="mt-1 text-sm">
            <div className="font-medium">{order.shippingAddress?.name ?? order?.user?.name ?? "—"}</div>
            <div className="text-sm text-muted-foreground">{order.shippingAddress?.line1 ?? ""}{order.shippingAddress?.line2 ?? ""}</div>
            <div className="text-sm text-muted-foreground">{order.shippingAddress?.city ?? ""} {order.shippingAddress?.pincode ?? ""}</div>
            <div className="text-sm text-muted-foreground">{order.shippingAddress?.country ?? ""}</div>
          </div>
        </Card>

        <Card className="rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Payment</div>
              <div className="font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> {order.paymentMethod ?? "—"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Paid at</div>
              <div className="font-medium">{order.paidAt ? new Date(order.paidAt).toLocaleString() : "—"}</div>
            </div>
          </div>

          <hr className="my-3" />

          <div className="text-xs text-muted-foreground">Status</div>
          <div className="mt-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${STATUS_BADGE[order.status] ?? 'bg-gray-100 text-gray-800'}`}>
              {order.status}
            </span>
          </div>
        </Card>

        <Card className="rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Summary</div>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between text-sm"><span>Items</span><span>{formatMoney(order.itemsTotal, order.currency)}</span></div>
            <div className="flex justify-between text-sm"><span>Shipping</span><span>{formatMoney(order.shippingTotal, order.currency)}</span></div>
            <div className="flex justify-between text-sm"><span>Tax</span><span>{formatMoney(order.taxTotal, order.currency)}</span></div>
            <div className="flex justify-between text-sm"><span>Discount</span><span>-{formatMoney(order.discountTotal, order.currency)}</span></div>
            <hr />
            <div className="flex justify-between font-semibold text-lg"> <span>Total</span> <span>{formatMoney(order.totalAmount, order.currency)}</span></div>
          </div>
        </Card>
      </div>

      {/* Items list */}
      <div className="rounded-2xl p-4 shadow-sm">
        <h3 className="text-sm font-medium mb-3">Items ({items.length})</h3>
        <div className="divide-y">
          {items.map((it, idx) => (
            <Card key={it.id ?? idx} className="flex pr-6  items-center gap-4 py-3">
              <img src={it.product?.image[0] || it.image} alt={it.product?.name || it.name} className="w-16 h-16 object-cover rounded" />
              <div className="flex-1">
                <div className="font-medium">{it.product?.name ?? it.name}</div>
                <div className="text-xs text-muted-foreground">SKU: {it.product?.sku ?? it.sku ?? '—'}</div>
                <div className="text-sm text-muted-foreground">Qty: {it.quantity} × {formatMoney(it.unitPrice ?? it.price, order.currency)}</div>
              </div>
              <div className="text-right font-medium">{formatMoney((it.quantity ?? 1) * (it.unitPrice ?? it.price ?? 0), order.currency)}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
          <Button onClick={doMarkComplete} disabled={busy}>
            <CheckCircle className="h-4 w-4 mr-2" /> Mark as completed
          </Button>
        )}

        {order.status !== 'CANCELLED' && (
          <Button variant="destructive" onClick={doCancel} disabled={busy}>
            <XCircle className="h-4 w-4 mr-2" /> Cancel order
          </Button>
        )}

        <Button variant="ghost" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <MapPin className="h-4 w-4 mr-2" /> Jump to address
        </Button>

      </div>
    </div>
  );
}
