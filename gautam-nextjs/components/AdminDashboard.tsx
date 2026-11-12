"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  BarChart3,
  Settings,
  ArrowUpRight,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useRemoteData } from "@/lib/hooks/useRemoteData";
const placeholder = () => (
  <div className="admin-loading" aria-label="Loading section" />
);
const OrdersTable = dynamic(() => import("./admin/OrdersTable"), {
  loading: placeholder,
});
const ProductsTable = dynamic(() => import("./admin/ProductsTable"), {
  loading: placeholder,
});
const SiteSettingsPanel = dynamic(() => import("./admin/SiteSettingsPanel"), {
  loading: placeholder,
});
const RevenueChart = dynamic(() => import("./admin/RevenueChart"), {
  loading: placeholder,
});
interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  monthlyRevenue: number;
  ordersByStatus: Record<string, number>;
  dailyRevenue: { _id: string; revenue: number; orders: number }[];
}
const tabs = [
  ["orders", "Orders", ShoppingBag],
  ["products", "Products", Package],
  ["overview", "Overview", BarChart3],
  ["settings", "Site settings", Settings],
] as const;
export default function AdminDashboard() {
  const [active, setActive] = useState("orders"),
    [visited, setVisited] = useState(["orders"]),
    [retry, setRetry] = useState(0);
  const { user, logout } = useAuth();
  const {
    data: stats,
    loading,
    error,
  } = useRemoteData<DashboardStats>(
    visited.includes("overview") ? "/api/admin/stats" : null,
    retry,
  );
  return (
    <main id="main-content" className="admin-shell">
      <aside className="admin-nav">
        <Link className="wordmark" href="/">
          <span className="wordmark-name">gautam.</span>
          <span className="wordmark-sub">SHOP MANAGEMENT</span>
        </Link>
        <div>
          <p style={{ fontSize: 12, marginBottom: 14 }}>
            Namaste, {user?.firstName}.
          </p>
          <button className="text-link" onClick={logout}>
            <LogOut size={15} />
            Sign out
          </button>
        </div>
        <Link href="/">
          Back to the shop <ArrowUpRight size={16} />
        </Link>
      </aside>
      <section className="admin-content">
        <p className="admin-kicker">A LITTLE ORDER BEHIND THE BEAUTY</p>
        <h1>Your shop desk.</h1>
        <nav className="admin-tabs" aria-label="Shop management">
          {tabs.map(([id, label, Icon]) => (
            <button
              key={id}
              className={active === id ? "active" : ""}
              aria-current={active === id ? "page" : undefined}
              onClick={() => {
                setActive(id);
                setVisited((v) => (v.includes(id) ? v : [...v, id]));
              }}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>
        {visited.includes("orders") && (
          <div hidden={active !== "orders"}>
            <OrdersTable />
          </div>
        )}
        {visited.includes("products") && (
          <div hidden={active !== "products"}>
            <ProductsTable />
          </div>
        )}
        {visited.includes("settings") && (
          <div hidden={active !== "settings"}>
            <SiteSettingsPanel />
          </div>
        )}
        {active === "overview" &&
          (loading && !stats ? (
            <div className="admin-loading" />
          ) : error ? (
            <div className="admin-feedback">
              <p>
                Statistics couldn’t load. Orders and products are still
                available.
              </p>
              <button className="text-link" onClick={() => setRetry(retry + 1)}>
                Try again
              </button>
            </div>
          ) : stats ? (
            <>
              <div className="stat-grid">
                {[
                  ["Order value", "NPR " + stats.totalRevenue.toLocaleString()],
                  ["Orders", stats.totalOrders],
                  ["Customers", stats.totalUsers],
                  [
                    "This month",
                    "NPR " + stats.monthlyRevenue.toLocaleString(),
                  ],
                ].map(([label, value]) => (
                  <div className="stat-box" key={label}>
                    <p>{label}</p>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
              <div className="admin-grid" style={{ marginTop: 22 }}>
                <div className="admin-panel">
                  <h2>Orders at a glance</h2>
                  <div className="admin-status-list">
                    {Object.entries(stats.ordersByStatus).map(
                      ([status, count]) => (
                        <div key={status}>
                          <span>{status}</span>
                          <strong>{count}</strong>
                        </div>
                      ),
                    )}
                  </div>
                </div>
                <div className="admin-panel">
                  <h2>Keep the next moment moving.</h2>
                  <p style={{ lineHeight: 1.9 }}>
                    Start with pending orders, confirm the delivery details, and
                    keep product availability up to date.
                  </p>
                  <button
                    className="text-link"
                    style={{ marginTop: 20 }}
                    onClick={() => setActive("orders")}
                  >
                    Review orders <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
              <div style={{ marginTop: 22 }}>
                <RevenueChart data={stats.dailyRevenue} />
              </div>
            </>
          ) : null)}
      </section>
    </main>
  );
}
