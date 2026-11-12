"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRemoteData } from "@/lib/hooks/useRemoteData";
import { formatPrice } from "@/lib/utils/currency";
interface ShopOrder {
  _id: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  customerDetails?: { name: string; phone: string; address: string };
  items: { name: string; quantity: number }[];
  createdAt: string;
}
const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
export default function OrdersTable() {
  const [status, setStatus] = useState(""),
    [page, setPage] = useState(1),
    [retry, setRetry] = useState(0),
    [expanded, setExpanded] = useState(""),
    [updating, setUpdating] = useState(""),
    [error, setError] = useState("");
  const query = new URLSearchParams({
    page: String(page),
    limit: "10",
    status,
  });
  const {
    data,
    loading,
    error: loadError,
  } = useRemoteData<{
    orders: ShopOrder[];
    totalCount: number;
    totalPages: number;
  }>("/api/admin/orders?" + query, retry);
  const orders = data?.orders || [],
    pages = data?.totalPages || 0;
  async function update(orderId: string, orderStatus: string) {
    setUpdating(orderId);
    setError("");
    try {
      const r = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, orderStatus }),
      });
      const d = await r.json();
      if (!r.ok)
        throw new Error(d.message || "The order could not be updated.");
      setRetry((v) => v + 1);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Please try again.");
    } finally {
      setUpdating("");
    }
  }
  return (
    <section aria-label="Manage orders">
      <div className="admin-toolbar">
        <select
          aria-label="Filter order status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All orders</option>
          {statuses.map((s) => (
            <option value={s} key={s}>
              {s[0].toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="text-link"
          onClick={() => setRetry((v) => v + 1)}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh orders
        </button>
        <span aria-live="polite">
          {loading ? "Updating…" : (data?.totalCount || 0) + " orders"}
        </span>
      </div>
      {(error || loadError) && (
        <div role="alert" className="admin-feedback">
          <p>{error || loadError}</p>
          <button className="text-link" onClick={() => setRetry((v) => v + 1)}>
            Try again
          </button>
        </div>
      )}
      {loading && !data ? (
        <div className="admin-loading" />
      ) : (
        <div className="admin-table-wrap" aria-busy={loading}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Delivery status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <OrderRow
                  key={o._id}
                  order={o}
                  expanded={expanded === o._id}
                  toggle={() => setExpanded(expanded === o._id ? "" : o._id)}
                  update={(s) => update(o._id, s)}
                  updating={updating === o._id}
                />
              ))}
              {!orders.length && (
                <tr>
                  <td colSpan={6} style={{ padding: 40, textAlign: "center" }}>
                    No orders match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="pagination">
        <span>
          Page {page}
          {pages ? " of " + pages : ""}
        </span>
        <div>
          <button
            disabled={page === 1 || loading}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          <button
            disabled={page >= pages || loading}
            onClick={() => setPage(page + 1)}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
function OrderRow({
  order: o,
  expanded,
  toggle,
  update,
  updating,
}: {
  order: ShopOrder;
  expanded: boolean;
  toggle: () => void;
  update: (status: string) => void;
  updating: boolean;
}) {
  return (
    <>
      <tr>
        <td>
          <strong>#{o._id.slice(-8).toUpperCase()}</strong>
          <br />
          {new Date(o.createdAt).toLocaleDateString("en-GB")}
        </td>
        <td>
          {o.customerDetails?.name || "Customer"}
          <br />
          {o.customerDetails?.phone && (
            <a href={"tel:" + o.customerDetails.phone}>
              {o.customerDetails.phone}
            </a>
          )}
        </td>
        <td>{formatPrice(o.totalAmount)}</td>
        <td>
          {o.paymentMethod === "cod" ? "Cash on Delivery" : o.paymentMethod}
          <br />
          <span className={"status-pill " + o.paymentStatus}>
            {o.paymentStatus === "pending" && o.paymentMethod === "cod"
              ? "Collect on delivery"
              : o.paymentStatus}
          </span>
        </td>
        <td>
          <select
            aria-label={"Delivery status for order " + o._id.slice(-8)}
            value={o.orderStatus}
            disabled={updating}
            onChange={(e) => update(e.target.value)}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </td>
        <td>
          <button
            className="text-link"
            aria-expanded={expanded}
            onClick={toggle}
          >
            {expanded ? "Hide" : "Details"}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={6}>
            <div className="admin-order-details">
              <div>
                <strong>Delivery address</strong>
                <p>{o.customerDetails?.address || "No address provided"}</p>
              </div>
              <div>
                <strong>Pieces</strong>
                {o.items.map((item, i) => (
                  <p key={i}>
                    {item.name} × {item.quantity}
                  </p>
                ))}
              </div>
              <Link className="text-link" href={"/orders/" + o._id}>
                Full order <ArrowUpRight size={16} />
              </Link>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
