// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Box,
  Users,
  DollarSign,
  BarChart2,
  Eye,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllCategoriesCount, getAllOrdersCount, getAllProductsCount, getAllUsersCount, getRevenue, postCategory } from "../../service/adminService";
import OrdersTable from "../../components/OrdersTable";
import { useOrder } from "../../hooks/useOrder";

/**
 * AdminDashboard
 * - Replace the `mock*` data with real API calls (use react-query).
 * - The small inline SVG chart is a lightweight placeholder. Replace with recharts / chart.js later if needed.
 */


const mockRecentOrders = [
  {
    id: "ORD-1001",
    customer: "Anita Sharma",
    items: 3,
    total: 450,
    status: "processing",
    date: "2025-11-25",
  },
  {
    id: "ORD-1000",
    customer: "Rahul Verma",
    items: 1,
    total: 120,
    status: "completed",
    date: "2025-11-24",
  },
  {
    id: "ORD-0999",
    customer: "Sana Khan",
    items: 2,
    total: 260,
    status: "cancelled",
    date: "2025-11-23",
  },
];

function StatCard({ icon: Icon, label, value, delta }) {
  return (
    <div className="bg-card rounded-2xl shadow-sm p-4 flex-1 min-w-[160px]">
      <div className="flex items-start gap-3">
        <div className="bg-primary/10 text-primary p-2 rounded-lg">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="mt-1 text-2xl font-semibold">{value}</div>
        </div>
        {delta != null && (
          <div className="text-sm text-success self-center">{delta}</div>
        )}
      </div>
    </div>
  );
}

function MiniBarChart({ values = [] }) {

  // Small inline responsive spark/bar chart
  const max = Math.max(...values, 1);
  const w = 120;
  const h = 40;
  const barW = Math.floor(w / values.length);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block">
      {values.map((v, i) => {
        const barH = (v / max) * (h - 8);
        const x = i * barW + 2;
        const y = h - barH - 2;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barW - 4}
            height={barH}
            rx="2"
            ry="2"
            className="fill-current text-primary/80"
          />
        );
      })}
    </svg>
  );
}

export default function AdminDashboard() {
  // TODO: replace mock data with react-query hooks:
  // const { data: stats } = useQuery(['admin-stats'], fetchAdminStats)
  // const { data: recentOrders } = useQuery(['recent-orders'], fetchRecentOrders)

  const [usersCount, setUsersCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [revenue, setRevenue] = useState(0);

  const { orders } = useOrder()

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
        setUsersCount(u * 457)
        setOrdersCount(o);
        setProductsCount(p);
        setCategoriesCount(c);
        setRevenue(r);
      } catch (error) {
        console.error("Failed to load dashboard counts", error);
      }
    };

    fetchData();
  }, []);

  const mockStats = {
    orders: ordersCount,
    products: productsCount,
    users: usersCount,
    revenue: revenue,
  };


  return (
    <div className="bg-background space-y-6">
      {/* Top header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of store performance and recent activity
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/products/new">
            <Button>Add product</Button>
          </Link>
          <Link to="/admin/orders">
            <Button variant="outline">View all orders</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={ShoppingCart}
          label="Total Orders"
          value={mockStats.orders}
          delta="+8%"
        />
        <StatCard
          icon={Box}
          label="Products"
          value={mockStats.products}
          delta="+2%"
        />
        <StatCard
          icon={Users}
          label="Customers"
          value={mockStats.users}
          delta="+5%"
        />
        <div className=" rounded-2xl shadow-sm p-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
              <DollarSign className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">Revenue (30d)</div>
              <div className="mt-1 text-2xl font-semibold">
                ₹{mockStats?.revenue?.toLocaleString()}
              </div>
              <div className="mt-2">
                <MiniBarChart values={[600, 900, 450, 1200, 800, 700, 1100]} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main grid: recent orders + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders (larger column) */}
        <div className="lg:col-span-2  rounded-2xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
            <div className="text-sm text-muted-foreground">Last 7 orders</div>
          </div>

          <OrdersTable orders={orders.slice(0, 3)} />
          
          <Link to="/admin/orders">
            <div className="flex justify-center">
              <Button>
                <ShoppingCart className="mr-2 h-4 w-4" /> See All
              </Button>
            </div >
          </Link>
        </div>

        {/* Quick actions */}
        <div className=" rounded-2xl shadow-sm p-4 flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Quick Actions</h3>

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
        </div>
      </div>
    </div>
  );
}
