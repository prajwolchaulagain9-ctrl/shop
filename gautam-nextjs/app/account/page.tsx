"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, LogOut, Package } from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useLogin } from "@/lib/contexts/LoginContext";
import { useRemoteData } from "@/lib/hooks/useRemoteData";
interface CustomerOrder {
  _id: string;
  totalAmount: number;
  orderStatus: string;
  paymentMethod: string;
  createdAt: string;
}
export default function AccountPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const { openLogin } = useLogin();
  const [page, setPage] = useState(1),
    [retry, setRetry] = useState(0);
  const { data, loading, error } = useRemoteData<{
    orders: CustomerOrder[];
    totalPages: number;
  }>(user ? "/api/orders?page=" + page : null, String(retry) + user?.id);
  const orders = data?.orders || [],
    pages = data?.totalPages || 0;
  if (authLoading)
    return (
      <main id="main-content" className="container panel-page">
        <div className="admin-loading" />
      </main>
    );
  if (!user)
    return (
      <main id="main-content" className="container panel-page">
        <div className="success-card">
          <h1>
            Your little corner
            <br />
            of Gautam.
          </h1>
          <p>Sign in to see your orders and account details.</p>
          <button className="button-primary" onClick={openLogin}>
            Sign in <ArrowUpRight size={18} />
          </button>
        </div>
      </main>
    );
  return (
    <main id="main-content" className="container panel-page">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">YOUR GAUTAM ACCOUNT</p>
          <h1>Namaste, {user.firstName}.</h1>
        </div>
        <button className="text-link" onClick={logout}>
          <LogOut size={15} />
          Sign out
        </button>
      </div>
      <div className="account-layout">
        <aside className="panel-card">
          <h2>Your details</h2>
          <dl className="account-details">
            <div>
              <dt>Name</dt>
              <dd>
                {user.firstName} {user.lastName}
              </dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd style={{ overflowWrap: "anywhere" }}>{user.email}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{user.phone || "Add your number at checkout"}</dd>
            </div>
          </dl>
          <a
            className="text-link"
            href="https://wa.me/9779849591758"
            target="_blank"
            rel="noreferrer"
            style={{ marginTop: 20 }}
          >
            Need a little help? <ArrowUpRight size={16} />
          </a>
          {user.role === "admin" && (
            <Link className="text-link" href="/admin" style={{ marginTop: 15 }}>
              Open shop management <ArrowUpRight size={16} />
            </Link>
          )}
        </aside>
        <section className="panel-card">
          <h2>Your orders</h2>
          {loading ? (
            <div className="admin-loading" />
          ) : error ? (
            <div className="admin-feedback">
              <p>We couldn’t load your orders.</p>
              <button className="text-link" onClick={() => setRetry(retry + 1)}>
                Try again
              </button>
            </div>
          ) : orders.length ? (
            orders.map((o) => (
              <div className="order-card" key={o._id}>
                <div>
                  <h3>Order #{o._id.slice(-8).toUpperCase()}</h3>
                  <div className="order-meta">
                    <span>
                      {new Date(o.createdAt).toLocaleDateString("en-GB")}
                    </span>
                    <span>NPR {o.totalAmount.toLocaleString()}</span>
                    <span className={"status-pill " + o.orderStatus}>
                      {o.orderStatus}
                    </span>
                  </div>
                </div>
                <Link className="text-link" href={"/orders/" + o._id}>
                  View order <ArrowUpRight size={16} />
                </Link>
              </div>
            ))
          ) : (
            <div style={{ padding: "35px 0" }}>
              <Package size={30} />
              <p style={{ marginTop: 15 }}>
                Your next tradition is waiting. Your orders will appear here.
              </p>
              <Link
                className="text-link"
                href="/slippers"
                style={{ marginTop: 20 }}
              >
                Explore footwear <ArrowUpRight size={16} />
              </Link>
            </div>
          )}
          {pages > 1 && (
            <div className="pagination">
              <span>
                Page {page} of {pages}
              </span>
              <div>
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                  Previous
                </button>
                <button
                  disabled={page === pages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
