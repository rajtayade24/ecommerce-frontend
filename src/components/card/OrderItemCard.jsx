import React from 'react';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion'
import { cardVariants } from '@/utils/motionVariants';

const MotionCard = motion.create(Card);

const OrderItemCard = ({ item }) => {
  return (
    <MotionCard
      layout  //  MAGIC Now:, Size changes → animated,  Position changes → animated,   Reorder → animated,
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex gap-4 pr-4 items-center mb-6">

      <img
        src={item.image || 'https://via.placeholder.com/120'}
        alt={item.productName}
        className="w-24 h-24 object-cover rounded-lg"
      />

      <div className="flex-1">
        <div className="font-semibold">{item.productName}</div>
        <div className="text-sm text-slate-500">
          Variant: {item.variantLabel}
        </div>

        <div className="mt-2 text-sm">
          ₹{item.unitPrice} × {item.quantity}
        </div>
      </div>

      <div className="text-right">
        <div className="text-sm text-slate-500">Total</div>
        <div className="font-semibold text-lg">
          ₹{item.lineTotal}
        </div>
      </div>

    </MotionCard>
  );
};

export default OrderItemCard;
