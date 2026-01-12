import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const statusVariant = (status) => {
  switch (status) {
    case 'PENDING': return 'secondary';
    case 'PAID': return 'default';
    case 'SHIPPED': return 'outline';
    case 'DELIVERED': return 'success';
    case 'CANCELLED': return 'destructive';
    default: return 'secondary';
  }
};

const MotionCard = motion.create(Card);

const OrderCard = ({ order, onCancel, cancelling }) => {
  const first = order.items?.[0];
  const moreCount = Math.max(0, (order.items?.length || 0) - 1);

  return (
    <MotionCard
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="rounded-2xl p-4 shadow-sm flex gap-4 items-center"
    >
      <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-muted">
        <img
          src={first?.image || 'https://via.placeholder.com/120'}
          alt={first?.productName || `Order ${order.orderNumber}`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground truncate">
            Order id: {order.orderNumber}
          </div>

          <Badge variant={statusVariant(order.status)}>
            {order.status}
          </Badge>

          <div className="text-xs text-muted-foreground ml-auto">
            {format(new Date(order.createdAt), 'dd MMM yyyy, hh:mm a')}
          </div>
        </div>

        <div className="mt-2 text-sm">
          <div className="font-semibold truncate">
            {first?.productName}
            {first?.variantLabel ? ` • ${first.variantLabel}` : ''}
          </div>
          {moreCount > 0 && (
            <div className="text-xs text-muted-foreground">
              +{moreCount} more item{moreCount > 1 ? 's' : ''}
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="text-lg font-semibold">
            ₹{order?.totalAmount?.toFixed(2)}
          </div>

          <Link to={`/orders/${order.orderNumber}`}>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              View
            </Button>
          </Link>

          {order.status === 'PENDING' && (
            <Button
              size="sm"
              onClick={() => onCancel(order.id)}
              disabled={cancelling}
              className="whitespace-normal h-auto"
            >
              {cancelling ? 'Cancelling…' : 'Cancel Order'}
            </Button>
          )}
        </div>
      </div>
    </MotionCard>
  );
};

export default OrderCard;