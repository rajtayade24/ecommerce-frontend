import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

const AddressCard = ({
  a,
  handleDeliver,
  isOrder = true,
  loadingDeliver = false
}) => {
  const isPrimary = a.primaryAddress;

  return (
    <motion.label
      key={a.id}
      layout //  MAGIC Now:, Size changes → animated,  Position changes → animated,   Reorder → animated,
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={
        `block border rounded-xl p-4 md:p-5 cursor-pointer transition-shadow ` +
        `hover:shadow-md ${isPrimary ? 'ring-2 ring-blue-200' : ''}`
      }
    >
      {/* Top row: radio + name/label + phone */}
      <div className="flex items-start gap-3">

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
      </div>

      {/* Action button */}
      {isOrder && (
        <div className="mt-4 flex sm:justify-end">
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleDeliver(a);
            }}
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg shadow-lg"
          >
            {loadingDeliver ? "Loading..." : "DELIVER HERE"}
          </Button>
        </div>
      )}
    </motion.label>
  );
};

export default AddressCard;
