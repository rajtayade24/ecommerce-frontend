import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { addUserAddress } from '@/service/authService';
import { Input } from '../../../components/ui/Input';
import { DialogDescription } from '../../../components/ui/Dialog';
import useAuthStore from '../../../store/useAuthStore';
import UnAuthorizedUser from '../UnAuthorizedUser';

const AddAddressModal = ({ open, onClose, onAdded }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <UnAuthorizedUser />;
  }
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    label: 'home',
    primaryAddress: false
  });

  const handleChange = (k) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [k]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        address: `${form.line1}${form.line2 ? ', ' + form.line2 : ''}`,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        phone: form.phone,
        Label: form.Label,
        primaryAddress: form.primaryAddress
      };
      // payload shape: { name, line1, line2, city, state, pincode, phone, label, primaryAddress }
      payload.address = `${form.line1}${form.line2 ? ', ' + form.line2 : ''}`;
      delete payload.line1; delete payload.line2;

      const saved = await addUserAddress(payload);
      onAdded(saved);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add new address</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input className="Input" value={form.name} onChange={handleChange('name')} />
          </div>

          <div>
            <Label>Address line 1</Label>
            <Input className="Input" value={form.line1} onChange={handleChange('line1')} />
          </div>

          <div>
            <Label>Address line 2</Label>
            <Input className="Input" value={form.line2} onChange={handleChange('line2')} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>City</Label>
              <Input className="Input" value={form.city} onChange={handleChange('city')} />
            </div>
            <div>
              <Label>State</Label>
              <Input className="Input" value={form.state} onChange={handleChange('state')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Pincode</Label>
              <Input className="Input" value={form.pincode} onChange={handleChange('pincode')} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input className="Input" value={form.phone} onChange={handleChange('phone')} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select className="border p-2 rounded" value={form.label} onChange={handleChange('label')}>
              <option value="home">Home</option>
              <option value="work">Work</option>
            </select>

            <Label className="flex items-center gap-2">
              <Input type="checkbox" checked={form.primaryAddress} onChange={handleChange('primaryAddress')} />
              Primary
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// AddAddressModal.propTypes = {
//   open: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onAdded: PropTypes.func.isRequired
// };

export default AddAddressModal;
