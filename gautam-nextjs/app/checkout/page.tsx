"use client";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Banknote,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useCart } from "@/lib/contexts/CartContext";
import { useLogin } from "@/lib/contexts/LoginContext";
import { imageUrl } from "@/lib/media/images";
import { formatPrice, parsePrice } from "@/lib/utils/currency";
const LocationPicker = dynamic(() => import("@/components/LocationPicker"), {
  ssr: false,
});
interface DeliveryLocation {
  lat: number;
  lng: number;
  formattedAddress?: string;
}
interface DeliveryDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  location?: DeliveryLocation;
}
export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { cart, hydrated, clearCart, openCart } = useCart();
  const { openLogin } = useLogin();
  const [details, setDetails] = useState<DeliveryDetails | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");
  const submitting = useRef(false);
  const delivery = details || {
    name: [user?.firstName, user?.lastName].filter(Boolean).join(" "),
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
  };
  const total = cart.reduce(
    (sum, item) => sum + parsePrice(item.price) * item.quantity,
    0,
  );
  function change(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setDetails({ ...delivery, [event.target.name]: event.target.value });
  }
  async function placeOrder(event: React.FormEvent) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          totalAmount: total,
          paymentMethod: "cod",
          customerDetails: delivery,
        }),
      });
      const body = await response.json();
      if (!response.ok || !body.success)
        throw new Error(
          body.message || "Your order could not be placed. Please try again.",
        );
      setOrderId(body.order._id);
      clearCart();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Please try again.");
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  }
  if (authLoading || !hydrated)
    return (
      <main id="main-content" className="container panel-page">
        <div className="admin-loading" aria-label="Loading checkout" />
      </main>
    );
  if (!user)
    return (
      <main id="main-content" className="container panel-page">
        <div className="success-card">
          <h1>
            A little closer
            <br />
            to your next tradition.
          </h1>
          <p>Sign in to complete your order. Your bag will be waiting.</p>
          <button className="button-primary" onClick={openLogin}>
            Sign in to checkout <ArrowUpRight size={18} />
          </button>
        </div>
      </main>
    );
  if (orderId)
    return (
      <main id="main-content" className="container panel-page">
        <div className="success-card">
          <CheckCircle2 size={48} style={{ margin: "auto" }} />
          <h1>
            Thank you.
            <br />
            <em>Your order is in.</em>
          </h1>
          <p>
            Order #{orderId.slice(-8).toUpperCase()}
            <br />
            Pay in cash when your pieces arrive.
          </p>
          <Link className="button-primary" href={"/orders/" + orderId}>
            View your order <ArrowUpRight size={18} />
          </Link>
          <p style={{ marginTop: 20 }}>
            <Link className="text-link" href="/account">
              All your orders
            </Link>
          </p>
        </div>
      </main>
    );
  if (!cart.length)
    return (
      <main id="main-content" className="container panel-page">
        <div className="success-card">
          <h1>Your bag is waiting.</h1>
          <p>Choose a few pieces before checking out.</p>
          <Link className="button-primary" href="/slippers">
            Explore footwear <ArrowUpRight size={18} />
          </Link>
        </div>
      </main>
    );
  return (
    <main id="main-content" className="container panel-page">
      <div className="panel-heading">
        <div>
          <button className="text-link" type="button" onClick={openCart}>
            <ArrowLeft size={16} />
            Back to your bag
          </button>
          <h1>
            Make it <em>yours.</em>
          </h1>
        </div>
        <span className="eyebrow">CHECKOUT</span>
      </div>
      <form className="checkout-layout" onSubmit={placeOrder}>
        <div className="checkout-form">
          <section className="panel-card">
            <h2>Where shall we deliver?</h2>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="delivery-name">Full name</label>
                <input
                  id="delivery-name"
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={100}
                  value={delivery.name}
                  onChange={change}
                />
              </div>
              <div className="field">
                <label htmlFor="delivery-phone">Phone number</label>
                <input
                  id="delivery-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  maxLength={20}
                  value={delivery.phone}
                  onChange={change}
                />
              </div>
            </div>
            <div className="field" style={{ marginTop: 18 }}>
              <label htmlFor="delivery-email">Email (optional)</label>
              <input
                id="delivery-email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                value={delivery.email}
                onChange={change}
              />
            </div>
            <div className="field" style={{ marginTop: 18 }}>
              <label htmlFor="delivery-address">Delivery address</label>
              <textarea
                id="delivery-address"
                name="address"
                autoComplete="street-address"
                rows={3}
                required
                maxLength={500}
                placeholder="House, street, area and a nearby landmark"
                value={delivery.address}
                onChange={change}
              />
            </div>
            <button
              className="text-link"
              type="button"
              aria-expanded={mapOpen}
              style={{ marginTop: 15 }}
              onClick={() => setMapOpen(!mapOpen)}
            >
              {mapOpen ? "Hide delivery map" : "Add a map pin (optional)"}
            </button>
            {mapOpen && (
              <div style={{ marginTop: 15 }}>
                <LocationPicker
                  location={delivery.location || null}
                  onLocationChange={(location) =>
                    setDetails({ ...delivery, location })
                  }
                />
              </div>
            )}
          </section>
          <section className="panel-card">
            <h2>Simple, familiar payment.</h2>
            <div className="cod-choice">
              <Banknote size={25} />
              <div>
                <strong>Cash on Delivery</strong>
                <p>Pay in cash when you receive your order.</p>
              </div>
              <CheckCircle2 size={20} style={{ marginLeft: "auto" }} />
            </div>
            <p className="payment-note">
              Prefer eSewa?{" "}
              <a
                href="https://wa.me/9779849591758?text=Namaste%2C%20I%27d%20like%20to%20enquire%20about%20paying%20with%20eSewa."
                target="_blank"
                rel="noreferrer"
              >
                Contact us on WhatsApp
              </a>{" "}
              to arrange it with the shop.
            </p>
          </section>
        </div>
        <aside className="panel-card checkout-summary">
          <h2>In your bag.</h2>
          <div className="summary-items">
            {cart.map((item) => (
              <div className="summary-item" key={item.productId}>
                <div className="summary-image">
                  <Image
                    src={imageUrl(item.image, 160)}
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
          </div>
          <div className="summary-total">
            <p>
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </p>
            <p>
              <span>Delivery</span>
              <span>Free</span>
            </p>
            <p>
              <span>Total on delivery</span>
              <span>{formatPrice(total)}</span>
            </p>
          </div>
          {error && (
            <p
              role="alert"
              className="field-error"
              style={{ marginBottom: 16 }}
            >
              {error}
            </p>
          )}
          <button className="button-primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Placing your order…
              </>
            ) : (
              <>
                Place order · Cash on Delivery <ArrowUpRight size={18} />
              </>
            )}
          </button>
          <p className="payment-note">
            By placing your order, you agree to our{" "}
            <Link href="/terms">terms & conditions</Link>.
          </p>
        </aside>
      </form>
    </main>
  );
}
