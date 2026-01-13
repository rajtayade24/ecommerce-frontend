// src/pages/admin/Settings.jsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea"; // if not available, replace with <textarea>
import { Image, CreditCard, Truck, Mail } from "lucide-react";

/**
 * Settings
 * - Mock UI for store settings. Replace mockLoad / mockSave with API + react-query.
 * - Drop into /src/pages/admin/Settings.jsx and add route: /admin/settings
 */

const mockLoad = async () =>
  new Promise((res) =>
    setTimeout(
      () =>
        res({
          storeName: "FreshMart",
          storeEmail: "support@freshmart.example",
          description: "Local fresh produce delivered daily.",
          currency: "INR",
          enablePayments: true,
          taxPercent: 5,
          shippingFlat: 40,
          notifyEmail: "orders@freshmart.example",
          logoUrl: "", // server URL if exists
        }),
      300
    )
  );

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // settings state
  const [storeName, setStoreName] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [enablePayments, setEnablePayments] = useState(true);
  const [taxPercent, setTaxPercent] = useState(0);
  const [shippingFlat, setShippingFlat] = useState(0);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  useEffect(() => {
    let mounted = true;
    mockLoad().then((data) => {
      if (!mounted) return;
      setStoreName(data.storeName || "");
      setStoreEmail(data.storeEmail || "");
      setDescription(data.description || "");
      setCurrency(data.currency || "INR");
      setEnablePayments(Boolean(data.enablePayments));
      setTaxPercent(data.taxPercent ?? 0);
      setShippingFlat(data.shippingFlat ?? 0);
      setNotifyEmail(data.notifyEmail || "");
      setLogoPreview(data.logoUrl || "");
      setLoading(false);
    });
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    return () => {
      // cleanup preview URL on unmount
      if (logoPreview && logoPreview.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  function handleLogoSelect(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setLogoFile(f);
    setLogoPreview(url);
  }

  function removeLogo() {
    if (logoPreview && logoPreview.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
    setLogoFile(null);
    setLogoPreview("");
  }

  async function handleSave(e) {
    e.preventDefault();
    // basic validation
    if (!storeName.trim()) return alert("Store name is required");
    if (!storeEmail || !storeEmail.includes("@")) return alert("Valid store email is required");

    setSaving(true);

    // Build payload (if you upload logo, use FormData)
    // Example:
    // const fd = new FormData();
    // fd.append('storeName', storeName);
    // ...
    // if (logoFile) fd.append('logo', logoFile);

    // TODO: Replace with useMutation / API call
    setTimeout(() => {
      setSaving(false);
      alert("Settings saved (mock). Replace with API call.");
    }, 700);
  }

  if (loading) return <div>Loading settings…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Store Settings</h1>
          <p className="text-sm text-muted-foreground">Configure store details, payments, taxes and shipping.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reload
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save settings"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className=" rounded-2xl shadow-sm p-4 space-y-6">
        {/* Store info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-3">
            <label className="block text-sm font-medium">Store name</label>
            <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} />

            <label className="block text-sm font-medium mt-3">Store email</label>
            <Input value={storeEmail} onChange={(e) => setStoreEmail(e.target.value)} />

            <label className="block text-sm font-medium mt-3">Description</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium">Store logo</label>

            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 border rounded-md">
                <Image className="h-4 w-4" /> Upload logo
                <input type="file" accept="image/*" onChange={handleLogoSelect} className="hidden" />
              </label>

              {logoPreview ? (
                <div className="relative w-24 h-24 rounded-md overflow-hidden border">
                  <img src={logoPreview} alt="logo-preview" className="w-full h-full object-contain p-2 " />
                  <button type="button" onClick={removeLogo} className="absolute top-1 right-1 text-xs px-2 py-1 rounded">
                    Remove
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-md flex items-center justify-center border text-xs text-muted-foreground">
                  No logo
                </div>
              )}
            </div>

            <div className="text-xs text-muted-foreground">SVG/PNG recommended. Max 2MB.</div>
          </div>
        </div>

        {/* Payments / Currency */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">Payments</div>
              <div className="text-xs text-muted-foreground">Enable or disable checkout payments</div>
            </div>
          </div>

          <div className="lg:col-span-2 flex items-center gap-4">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={enablePayments} onChange={(e) => setEnablePayments(e.target.checked)} />
              <span className="text-sm">Enable payments</span>
            </label>

            <div className="ml-auto max-w-xs">
              <label className="block text-sm font-medium">Currency</label>
              <Input value={currency} onChange={(e) => setCurrency(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Taxes & shipping */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div>
              <div className="text-sm font-medium">Taxes</div>
              <div className="text-xs text-muted-foreground">Global tax percent applied to orders</div>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-sm font-medium">Tax percent (%)</label>
              <Input type="number" value={taxPercent} onChange={(e) => setTaxPercent(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-sm font-medium">Flat shipping (₹)</label>
              <Input type="number" value={shippingFlat} onChange={(e) => setShippingFlat(Number(e.target.value))} />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">Notifications</div>
              <div className="text-xs text-muted-foreground">Where order / system emails should be sent</div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium">Notification email</label>
            <Input value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)} />
            <div className="text-xs text-muted-foreground mt-2">Separate support or orders email if needed.</div>
          </div>
        </div>

        {/* Save row (redundant, form also has top save) */}
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
