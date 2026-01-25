import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Box,
  Users,
  DollarSign,
  BarChart2,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import {
  getAllCategoriesCount,
  getAllOrdersCount,
  getAllProductsCount,
  getAllUsersCount,
  getRevenue,
} from "@/service/adminService";
import OrdersTable from "@/components/OrdersTable";
import { useOrder } from "@/hooks/useOrder";

/* ---------------- STAT CARD ---------------- */
function StatCard({ icon: Icon, label, value, delta }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-card rounded-2xl shadow-sm p-4"
    >
      <div className="flex items-start gap-3">
        <div className="bg-primary/10 text-primary p-2 rounded-lg">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="mt-1 text-2xl font-semibold">{value}</div>
        </div>
        {delta && (
          <div className="text-sm text-emerald-600 font-medium">
            {delta}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ---------------- MINI CHART ---------------- */
function MiniBarChart({ values = [] }) {
  const max = Math.max(...values, 1);
  const w = 120;
  const h = 40;
  const barW = Math.floor(w / values.length);

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {values.map((v, i) => {
        const barH = (v / max) * (h - 8);
        return (
          <rect
            key={i}
            x={i * barW + 2}
            y={h - barH - 2}
            width={barW - 4}
            height={barH}
            rx="2"
            className="fill-primary/80"
          />
        );
      })}
    </svg>
  );
}

export default function AdminDashboard() {
  const [usersCount, setUsersCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [revenue, setRevenue] = useState(0);

  const { orders } = useOrder();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [u, r, o, p, c] = await Promise.all([
          getAllUsersCount(),
          getRevenue(),
          getAllOrdersCount(),
          getAllProductsCount(),
          getAllCategoriesCount(),
        ]);
        setUsersCount(u);
        setOrdersCount(o);
        setProductsCount(p);
        setCategoriesCount(c);
        setRevenue(r);
      } catch (err) {
        console.error("Failed to load dashboard counts", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of store performance and recent activity
          </p>
        </div>

        <div className="flex gap-3">
          <Link to="/admin/products/new">
            <Button title="Add new product" >Add product</Button>
          </Link>
          <Link to="/admin/orders">
            <Button variant="outline">View all orders</Button>
          </Link>
        </div>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingCart} label="Total Orders" value={ordersCount} delta="+8%" />
        <StatCard icon={Box} label="Products" value={productsCount} delta="+2%" />
        <StatCard icon={Users} label="Customers" value={usersCount} delta="+5%" />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-card rounded-2xl shadow-sm p-4"
        >
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
              <DollarSign className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">Revenue (30d)</div>
              <div className="mt-1 text-2xl font-semibold">
                ₹{revenue.toLocaleString()}
              </div>
              <div className="mt-2">
                <MiniBarChart values={[600, 900, 450, 1200, 800, 700, 1100]} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RECENT ORDERS */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-card rounded-2xl shadow-sm p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
            <span className="text-sm text-muted-foreground">Last 7</span>
          </div>

          <OrdersTable orders={orders.slice(0, 3)} />

          <div className="flex justify-center mt-4">
            <Link to="/admin/orders">
              <Button>
                <ShoppingCart className="mr-2 h-4 w-4" /> See All
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* QUICK ACTIONS */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card rounded-2xl shadow-sm p-4"
        >
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

          <div className="flex flex-col gap-2">
            <Link to="/admin/products">
              <Button variant="ghost" className="w-full justify-start">
                <Box className="mr-2 h-4 w-4" /> Manage Products
              </Button>
            </Link>
            <Link to="/admin/orders">
              <Button variant="ghost" className="w-full justify-start">
                <ShoppingCart className="mr-2 h-4 w-4" /> View Orders
              </Button>
            </Link>
            <Link to="/admin/users">
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" /> Manage Users
              </Button>
            </Link>
            <Link to="/admin/settings">
              <Button variant="outline" className="w-full justify-start">
                <BarChart2 className="mr-2 h-4 w-4" /> Reports & Settings
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
