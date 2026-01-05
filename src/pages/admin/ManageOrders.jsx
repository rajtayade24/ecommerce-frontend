// src/pages/admin/ManageOrders.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Download, ArrowRightCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useOrder } from "@/hooks/useOrder";
import { exportCSV } from "@/utils/exportsCSV";
import OrdersTable from "@/components/OrdersTable";

const STATUS_OPTIONS = [
  "ALL",
  "PENDING",
  "PAID",
  "COMPLETED",
  "CANCELLED",
];

export default function ManageOrders() {

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 500);
    return () => clearTimeout(id);
  }, [searchQuery]);

  // Build API filters (stable memo)
  const orderFilters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      status: statusFilter === "ALL" ? undefined : statusFilter,
    }),
    [debouncedSearch, statusFilter]
  );

  const { orders = [], } = useOrder(orderFilters);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground">Manage and process customer orders</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => exportCSV(orders)}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Link to="/admin/orders/new">
            <Button>
              <ArrowRightCircle className="mr-2 h-4 w-4" /> New Order
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 justify-between">
        <Input
          className="max-w-md"
          placeholder="Search by order number, customer or phone…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-background rounded-md border px-3 py-2 text-sm"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <OrdersTable orders={orders} showAll={true} />

    </div>
  );
}
