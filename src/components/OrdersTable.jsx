import React, { useEffect, useRef, useState } from 'react'
import { useOrder } from '@/hooks/useOrder';
import { useNavigate } from "react-router-dom";
import { Eye, CheckCircle, XCircle, Download, ArrowRightCircle } from "lucide-react";
import { formatMoney } from '@/utils/formatMoney';

import { Button } from "@/components/ui/Button";
import { Card } from '@/components/ui/Card';
import { Dialog, DialogTrigger } from '@/components/ui/Dialog';
import DialogContentImpl from '@/components/DialogContentImpl'
import { toast } from '@/components/ui/Sonner';

const STATUS_BADGE = {
  PENDING: "bg-gray-100 text-gray-800",
  PAID: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-yellow-100 text-yellow-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const OrdersTable = ({ orders, showAll = false }) => {
  const {
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useOrder();

  const loadMoreRef = useRef(null);
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <Card className="rounded-2xl shadow-sm p-4 overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="text-left text-xs text-muted-foreground border-b">
            <th className="py-2">Order</th>
            <th className="py-2">Customer</th>
            <th className="py-2">Items</th>
            <th className="py-2">Total</th>
            <th className="py-2">Status</th>
            <th className="py-2">Date</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>

          {isLoading ? (
            <tr>
              <td colSpan={5} className="py-4 text-center">
                Loading...
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={5} className="py-4 text-center text-red-500">
                Error loading orders: {String(error.message ?? error)}
              </td>
            </tr>
          ) : orders.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-4 text-center">
                No Order found
              </td>
            </tr>
          ) : (
            orders?.map((o) => (
              <OrderRow
                o={o}
                key={o.orderNumber}
              />
            ))
          )}

        </tbody>
      </table>

      {/* Infinite loader */}
      <div ref={loadMoreRef} className={`${showAll && 'py-6'} text-center`} >
        {isFetchingNextPage && <div>Loading more…</div>}
        {showAll && !hasNextPage && orders.length > 0 && (
          <div className="text-xs text-muted-foreground">End of results</div>
        )}
      </div>
    </Card >
  )
}


export function OrderRow({ o, }) {
  const [openCancelOrder, setOpenCancelOrder] = useState(false);
  const [openMarkComplote, setOpenMarkComplote] = useState(false);
  const navigate = useNavigate();

  function StatusBadge({ status }) {
    const cls = STATUS_BADGE[status] ?? "bg-gray-100 text-gray-800";
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
        {status}
      </span>
    );
  }

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    markCompleteOrderMutation,
    cancelOrderMutation,
  } = useOrder();

  const handleCancel = async (orderNumber) => {
    if (!window.confirm(`Cancel order ${orderNumber}? This cannot be undone.`)) return;
    await cancelOrderMutation.mutateAsync(orderNumber);
    toast.success(`Order ${orderNumber} cancelled (mock).`);
  };

  const handleView = (id) => {
    navigate(`/admin/orders/${id}`);
  };

  return (

    <tr key={o.orderNumber} className="border-b last:border-0">
      <td className="py-3 font-medium">{o.orderNumber}</td>
      <td className="py-3">
        <div className="font-medium">{o.customer ?? "—"}</div>
        <div className="text-xs text-muted-foreground">
          {o.shippingAddress?.phone ?? "—"}
        </div>
      </td>
      <td className="py-3">{o.items?.length ?? 0}</td>
      <td className="py-3">{formatMoney(o.totalAmount, o.currency)}</td>
      <td className="py-3"><StatusBadge status={o.status} /></td>
      <td className="py-3">
        {o.createdAt ? new Date(o.createdAt).toLocaleString() : "—"}
      </td>
      <td className="py-3">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" onClick={() => handleView(o.orderNumber)}>
            <Eye className="h-4 w-4" />
          </Button>

          {/* Delete dialog */}
          <Dialog open={openMarkComplote} onOpenChange={setOpenMarkComplote}>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost" disabled={o.status == "COMPLETED" || o.status == "CANCELLED"}>
                <CheckCircle className="h-4 w-4" />
              </Button>
            </DialogTrigger>

            <DialogContentImpl
              title="Complete conformation"
              desc={`Do you want to Compete Order having order number ${o.orderNumber}?`}
              save="Delete"
              onSave={() =>
                o.orderNumber &&
                markCompleteOrderMutation.mutate(o.orderNumber, {
                  onSuccess: () => setOpenMarkComplote(false),
                })
              }
            />
          </Dialog>


          <Dialog open={openCancelOrder} onOpenChange={setOpenCancelOrder}>
            <DialogTrigger asChild>
              <Button size="icon" variant="destructive" disabled={o.status === "COMPLETED" || o.status === "CANCELLED"}>
                <XCircle className="h-4 w-4" />
              </Button>
            </DialogTrigger>

            <DialogContentImpl
              title="Cancel Order Confirmation"
              desc={`Do you want to Cancel order having order number ${o.orderNumber}?`}
              save="Delete"
              onSave={() =>
                o.orderNumber &&
                cancelOrderMutation.mutate(o.orderNumber, {
                  onSuccess: () => setOpenCancelOrder(false),
                })
              }
            />
          </Dialog>

        </div>
      </td>
    </tr>
  )
}

export default OrdersTable
