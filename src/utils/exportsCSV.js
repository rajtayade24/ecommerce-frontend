import { toast } from "@/components/ui/Sonner";

export function exportCSV(orders) {
  if (!orders.length) return toast.warning("No orders to export");

  const header = [
    "Order Number",
    "Customer",
    "Phone",
    "Items",
    "Grand Total",
    "Status",
    "Created At",
  ];

  const rows = orders.map((o) => [
    o.orderNumber,
    o.customer ?? "",
    o.shippingAddress?.phone ?? "",
    o.items?.length ?? 0,
    o.totalAmount,
    o.status,
    o.createdAt,
  ]);

  const csv = [header, ...rows]
    .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `orders_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
