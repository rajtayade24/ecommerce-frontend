// components/OrderCard.jsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Truck, Check, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';

const statusColor = (status) => {
  switch (status) {
    case 'PENDING': return 'bg-yellow-100 text-yellow-800';
    case 'PAID': return 'bg-blue-100 text-blue-800';
    case 'SHIPPED': return 'bg-indigo-100 text-indigo-800';
    case 'DELIVERED': return 'bg-green-100 text-green-800';
    case 'CANCELLED': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const OrderCard = ({ order, onCancel, cancelling }) => {
  const first = order.items?.[0];
  const moreCount = Math.max(0, (order.items?.length || 0) - 1);

  return (
    <Card className="rounded-2xl shadow-sm p-4 flex gap-4 items-center">
      <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
        <img
          src={first?.image || 'https://via.placeholder.com/120'}
          alt={first?.productName || `Order ${order.orderNumber}`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1  min-w-0">
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-500">Order id: {order.orderNumber}</div>
          <div className={`px-2 py-1 rounded-full text-xs ${statusColor(order.status)}`}>
            {order.status}
          </div>
          <div className="text-xs text-slate-400 ml-auto">{format(new Date(order.createdAt), 'dd MMM yyyy, hh:mm a')}</div>
        </div>

        <div className="mt-2 text-sm text-slate-700">
          <div className="font-semibold">{first?.productName} {first?.variantLabel ? `• ${first.variantLabel}` : ''}</div>
          {moreCount > 0 && (<div className="text-xs text-slate-500">+{moreCount} more item{moreCount > 1 ? 's' : ''}</div>)}
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="text-lg font-semibold">₹{order?.totalAmount?.toFixed(2)}</div>

          <Link to={`/orders/${order.orderNumber}`}>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Eye className="h-4 w-4" /> View
            </Button>
          </Link>

          {order.status === 'PENDING' && (
            <Button
              size="sm"
              className="whitespace-normal text-center h-auto px-3 sm:ml-2 w-full sm:w-auto"
              onClick={() => onCancel(order.id)}
              disabled={cancelling}
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default OrderCard;
