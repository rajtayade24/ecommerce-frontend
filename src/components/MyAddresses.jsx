import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const MyAddresses = ({ addresses, isOrder = true }) => {
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const handleDeliver = (address) => {
    console.log('Deliver to:', address);
  };

  return (
    <div className="mt-4 space-y-3">
      <AnimatePresence>
        {addresses.length ? (
          addresses.map((a) => (
            <motion.label
              key={a.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center border rounded-lg p-4 transition-shadow hover:shadow-md ${a.id === selectedAddressId ? 'ring-2 ring-blue-200' : ''}`}
            >
              <input
                type="radio"
                name="address"
                checked={a.id === selectedAddressId}
                onChange={() => setSelectedAddressId(a.id)}
                className="mr-4"
              />

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{a.name}</div>
                  {a.label && (
                    <div className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">{a.label}</div>
                  )}
                  <div className="ml-auto text-sm text-slate-500">{a.phone}</div>
                </div>

                <div className="text-sm text-slate-600 mt-2">{a.line1}</div>
                <div className="text-sm text-slate-600">
                  {a.line2} — {a.city}, {a.state} — <span className="font-medium">{a.pincode}</span>
                </div>
              </div>

              <Button
                onClick={() => handleDeliver(a)}
                variant="orange"
                className="ml-4"
              >
                DELIVER HERE
              </Button>
            </motion.label>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 text-center text-slate-500"
          >
            No saved addresses. Add a new address to continue.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-2 border-t">
        <Button className="text-sm text-blue-600 mt-3">+ Add a new address</Button>
      </div>
    </div>
  );
};

export default MyAddresses;