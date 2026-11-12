"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, UserRound, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useCart } from "@/lib/contexts/CartContext";
interface NavbarProps {
  onSidebarToggle?: () => void;
  onLoginClick?: () => void;
}
const links = [
  ["/slippers", "Footwear"],
  ["/clothing", "Clothing"],
  ["/collections", "Celebration essentials"],
  ["/#about", "Our story"],
];
export default function Navbar({ onLoginClick }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { cartCount, toggleCart } = useCart();
  const pathname = usePathname();
  return (
    <header className="site-header">
      <div className="announcement">
        <span>Rooted in tradition. Made for your moments.</span>
        <a href="https://wa.me/9779849591758" target="_blank" rel="noreferrer">
          A little help choosing? <ArrowUpRight size={13} />
        </a>
      </div>
      <nav className="store-nav container" aria-label="Main navigation">
        <Link className="wordmark" href="/" onClick={() => setOpen(false)}>
          <span className="wordmark-name">
            gautam<span>.</span>
          </span>
          <span className="wordmark-sub">LADY SHOES · KATHMANDU</span>
        </Link>
        <div className="desktop-links">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={pathname === href ? "active" : ""}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="nav-actions">
          <button
            className="icon-button"
            aria-label={isAuthenticated ? "Your account" : "Sign in"}
            onClick={() => {
              if (isAuthenticated) window.location.assign("/account");
              else onLoginClick?.();
            }}
          >
            <UserRound size={20} />
          </button>
          {user?.role === "admin" && (
            <Link className="admin-link" href="/admin">
              Admin <ArrowUpRight size={13} />
            </Link>
          )}
          <button
            className="icon-button bag-button"
            aria-label={`Shopping bag, ${cartCount} items`}
            onClick={toggleCart}
          >
            <ShoppingBag size={20} />
            <span>{cartCount}</span>
          </button>
          <button
            className="icon-button mobile-menu-button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>
      {open && (
        <div id="mobile-nav" className="mobile-links container">
          {links.map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              {label}
              <ArrowUpRight size={18} />
            </Link>
          ))}
          <Link href="/account" onClick={() => setOpen(false)}>
            My account
            <ArrowUpRight size={18} />
          </Link>
        </div>
      )}
    </header>
  );
}
