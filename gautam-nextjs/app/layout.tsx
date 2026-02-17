import type { Metadata, Viewport } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "@/components/RootLayoutClient";
import "@/lib/utils/validateEnv"; // Validate environment variables on server startup

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#8b0000" },
    { media: "(prefers-color-scheme: dark)", color: "#dc143c" },
  ],
};

export const metadata: Metadata = {
  title: "Gautam Lady Shoes - Traditional Nepalese Slippers & Clothing",
  description: "Authentic traditional Nepalese slippers and handcrafted garments by Gautam Lady Shoes",
  metadataBase: new URL("https://gautam-lady-shoes.com"),
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Gautam Lady Shoes",
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  icons: [
    { rel: "icon", url: "/favicon.ico", type: "image/x-icon" },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png", sizes: "180x180" },
  ],
  openGraph: {
    title: "Gautam Lady Shoes",
    description: "Authentic traditional Nepalese slippers and clothing",
    url: "https://gautam-lady-shoes.com",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Gautam Lady Shoes",
      },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Gautam Lady Shoes",
    "msapplication-TileColor": "#8b0000",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${lato.variable} antialiased bg-white text-gray-900`}
      >
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
