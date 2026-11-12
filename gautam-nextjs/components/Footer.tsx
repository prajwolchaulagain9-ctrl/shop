import Link from "next/link";
export default function Footer() {
  return (
    <footer className="store-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link className="wordmark" href="/">
              <span className="wordmark-name">
                gautam<span>.</span>
              </span>
              <span className="wordmark-sub">LADY SHOES · KATHMANDU</span>
            </Link>
            <p className="footer-copy">
              Your tradition. Your style.
              <br />
              Footwear, clothing, and little things for life&apos;s meaningful
              moments.
            </p>
          </div>
          <div>
            <p className="footer-title">EXPLORE GAUTAM</p>
            <div className="footer-links">
              <Link href="/slippers">Footwear</Link>
              <Link href="/clothing">Clothing</Link>
              <Link href="/collections">Essentials</Link>
              <Link href="/#about">Our story</Link>
            </div>
          </div>
          <div>
            <p className="footer-title">A LITTLE PERSONAL HELP</p>
            <a
              href="https://wa.me/9779849591758"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp · +977 9849591758
            </a>
            <p>Machindranath, Kathmandu</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Gautam Lady Shoes. All rights reserved.
          </span>
          <div>
            <Link href="/terms">Terms & conditions</Link>
            <Link href="/account">My account</Link>
          </div>
          <span>आफ्नो परम्परा, आफ्नै शैली।</span>
        </div>
      </div>
    </footer>
  );
}
