import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { addUserAddress } from "@/service/authService";
import useAuthStore from "@/store/useAuthStore";
import UnAuthorizedUser from "@/pages/public/UnAuthorizedUser";
import MobileNumberInput from "@/components/MobileNumberInput";
import { toast } from "@/components/ui/Sonner";

const AddAddressModal = ({ open, onClose, onAdded }) => {
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    label: "home",
  });

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ PAYLOAD MATCHES AddAddressRequest
      const payload = {
        name: form.name,
        line1: form.line1,
        line2: form.line2,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        phone: form.phone,
        label: form.label,
      };

      const saved = await addUserAddress(payload);
      onAdded(saved);
      onClose();
    } catch (err) {
      console.error("Add address failed", err);
      toast.error("Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <UnAuthorizedUser />;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 max-h-[90vh] flex flex-col rounded-2xl">
        {/* Header */}
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold">
            Add new address
          </DialogTitle>
          <DialogDescription>
            Use this address for delivery and billing purposes.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-5"
        >
          {/* Name */}
          <div>
            <Label>Full name</Label>
            <Input
              value={form.name}
              onChange={handleChange("name")}
              placeholder="John Doe"
              required
            />
          </div>

          {/* Address */}
          <div>
            <Label>Address line 1</Label>
            <Input
              value={form.line1}
              onChange={handleChange("line1")}
              placeholder="House no, Street"
              required
            />
          </div>

          <div>
            <Label>Address line 2</Label>
            <Input
              value={form.line2}
              onChange={handleChange("line2")}
              placeholder="Apartment, Landmark (optional)"
            />
          </div>

          {/* City / State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>City</Label>
              <Input
                value={form.city}
                onChange={handleChange("city")}
                required
              />
            </div>
            <div>
              <Label>State</Label>
              <Input
                value={form.state}
                onChange={handleChange("state")}
                required
              />
            </div>
          </div>

          {/* Pincode / Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Pincode</Label>
              <Input
                value={form.pincode}
                onChange={handleChange("pincode")}
                required
              />
            </div>

            <MobileNumberInput
              mobile={form.phone}
              setMobile={(value) =>
                setForm((prev) => ({ ...prev, phone: value }))
              }
            />
          </div>

          {/* Address Type */}
          <div>
            <Label>Address type</Label>
            <select
              className="w-full border rounded-xl p-2 mt-1"
              value={form.label}
              onChange={handleChange("label")}
            >
              <option value="home">Home</option>
              <option value="work">Work</option>
            </select>
          </div>

          {/* Footer */}
          <DialogFooter className="pt-4 sticky bottom-0 bg-background">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save address"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAddressModal;
