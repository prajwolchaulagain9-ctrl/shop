"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package } from "lucide-react";
import { useRemoteData } from "@/lib/hooks/useRemoteData";
import { imageUrl } from "@/lib/media/images";
import { formatPrice } from "@/lib/utils/currency";
interface Order {
  _id: string;
  items: {
    productId: string;
    name: string;
    price: string;
    image: string;
    quantity: number;
  }[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  customerDetails: { name: string; phone: string; address: string };
  createdAt: string;
}
export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [retry, setRetry] = useState(0);
  const { data, loading, error } = useRemoteData<{ order: Order }>(
    "/api/orders/" + orderId,
    retry,
  );
  const order = data?.order;
  return (
    <main id="main-content" className="container panel-page">
      <Link className="text-link" href="/account">
        <ArrowLeft size={16} />
        Back to your account
      </Link>
      {loading ? (
        <div className="admin-loading" style={{ marginTop: 30 }} />
      ) : error || !order ? (
        <div className="success-card">
          <h1>Your order details.</h1>
          <p>
            This order could not be loaded. Please sign in to the account you
            used to place it.
          </p>
          <button
            className="button-primary"
            onClick={() => setRetry((v) => v + 1)}
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <div className="panel-heading">
            <div>
              <p className="eyebrow" style={{ marginTop: 25 }}>
                YOUR GAUTAM ORDER
              </p>
              <h1>#{order._id.slice(-8).toUpperCase()}</h1>
            </div>
            <span className={"status-pill " + order.orderStatus}>
              <Package size={15} style={{ marginRight: 8 }} />
              {order.orderStatus}
            </span>
          </div>
          <div className="checkout-layout">
            <section className="panel-card">
              <h2>Your pieces.</h2>
              {order.items.map((item) => (
                <div className="summary-item" key={item.productId}>
                  <div className="summary-image">
                    <Image
                      src={imageUrl(item.image, 200)}
                      alt={item.name}
                      fill
                      sizes="58px"
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3>{item.name}</h3>
                    <p>
                      {item.price} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
              <div className="summary-total">
                <p>
                  <span>Order total</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </p>
              </div>
            </section>
            <aside className="panel-card">
              <h2>The details.</h2>
              <dl className="account-details">
                <div>
                  <dt>Placed on</dt>
                  <dd>
                    {new Date(order.createdAt).toLocaleDateString("en-GB")}
                  </dd>
                </div>
                <div>
                  <dt>Payment</dt>
                  <dd>
                    {order.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : order.paymentMethod}{" "}
                    ·{" "}
                    {order.paymentMethod === "cod" &&
                    order.paymentStatus === "pending"
                      ? "Collect on delivery"
                      : order.paymentStatus}
                  </dd>
                </div>
                <div>
                  <dt>Deliver to</dt>
                  <dd>
                    {order.customerDetails.name}
                    <br />
                    {order.customerDetails.address}
                    <br />
                    {order.customerDetails.phone}
                  </dd>
                </div>
              </dl>
              <p className="payment-note">
                <a
                  href="https://wa.me/9779849591758"
                  target="_blank"
                  rel="noreferrer"
                >
                  Need help with your order? Chat with the shop.
                </a>
              </p>
            </aside>
          </div>
        </>
      )}
    </main>
  );
}
