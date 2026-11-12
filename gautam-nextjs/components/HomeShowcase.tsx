"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Play,
  MapPin,
  Phone,
  Truck,
  Heart,
  MessageCircle,
} from "lucide-react";
import StudioHero from "./StudioHero";
import ProductCard from "./ProductCard";
import { CatalogProduct } from "@/lib/catalog/types";
import { imageUrl, mediaUrl } from "@/lib/media/images";
import { useRemoteData } from "@/lib/hooks/useRemoteData";
const collections = [
  {
    name: "Every step, a little heritage.",
    tag: "01 — FOOTWEAR",
    href: "/slippers",
    image: "/media/products/footwear.webp",
    note: "Velvet, intricate embroidery, everyday elegance.",
  },
  {
    name: "Tradition in every thread.",
    tag: "02 — TRADITIONAL CLOTHING",
    href: "/clothing",
    image: "/media/products/clothing.webp",
    note: "Newari attire, kurta, and Gunyu Choli.",
  },
  {
    name: "Their first celebrations.",
    tag: "03 — LITTLE CELEBRATIONS",
    href: "/clothing?collection=pasni",
    image: "/media/products/celebrations.webp",
    note: "Pasni outfits for the moments you will keep.",
  },
];
export default function HomeShowcase() {
  const [category, setCategory] = useState("slippers"),
    [videoOpen, setVideoOpen] = useState(false),
    [retry, setRetry] = useState(0);
  const { data, loading, error } = useRemoteData<{
    products: CatalogProduct[];
  }>("/api/products?limit=4&category=" + category, retry);
  const products = data?.products || [];
  return (
    <main id="main-content" className="showcase">
      <section className="home-hero container">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="tiny-diamond" /> A KATHMANDU ORIGINAL
          </p>
          <h1>
            Some things
            <br />
            never go
            <br />
            <em>out of tradition.</em>
          </h1>
          <p className="hero-description">
            Beautiful pieces for the moments that matter. Discover Nepalese
            footwear, traditional clothing, and little celebrations — all in one
            place.
          </p>
          <div className="hero-actions">
            <Link className="button-primary" href="#collections">
              Explore the collections <ArrowUpRight size={19} />
            </Link>
            <a className="text-link" href="#about">
              Meet Gautam <ArrowRight size={17} />
            </a>
          </div>
          <div className="hero-footnote">
            <span>आफ्नो परम्परा, आफ्नै शैली।</span>
            <span>YOUR TRADITION. YOUR STYLE.</span>
          </div>
        </div>
        <div className="hero-art">
          <span className="hero-number">THE GAUTAM COLLECTION / VOL. 01</span>
          <StudioHero />
          <div className="hero-art-caption">
            <span>A closer look at the details.</span>
            <Link href="/slippers">
              Discover footwear <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      <div className="service-strip">
        <div className="container">
          <span>
            <Truck size={18} />
            Cash on Delivery
          </span>
          <span>
            <Heart size={18} />
            For everyday & extraordinary moments
          </span>
          <a
            href="https://wa.me/9779849591758"
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={18} />
            Personal help on WhatsApp
          </a>
        </div>
      </div>
      <section id="about" className="story-section container">
        <div className="story-film">
          <div className="film-frame">
            {videoOpen ? (
              <video
                src={mediaUrl("/media/video/gautam-story.mp4")}
                controls
                autoPlay
                playsInline
                crossOrigin="anonymous"
                preload="metadata"
                poster={imageUrl("/media/video/gautam-story.webp")}
                aria-label="Gautam Lady Shoes promotional film"
              >
                <track
                  kind="captions"
                  src={mediaUrl("/media/video/gautam-story.vtt")}
                  srcLang="ne"
                  label="Nepali and English"
                />
              </video>
            ) : (
              <button
                className="film-preview"
                onClick={() => setVideoOpen(true)}
                aria-label="Play the 44-second Gautam story film"
              >
                <Image
                  src={imageUrl("/media/video/gautam-story.webp")}
                  alt="Meet the Gautam family and discover our traditional collections"
                  fill
                  sizes="(max-width:800px) 75vw, 28vw"
                  className="object-cover"
                />
                <span className="film-play">
                  <Play size={23} fill="currentColor" />
                </span>
                <span className="film-time">THE GAUTAM FILM · 00:44</span>
              </button>
            )}
          </div>
          <span className="film-caption">A little glimpse into our world.</span>
        </div>
        <div className="story-copy">
          <p className="eyebrow">MORE THAN A PAIR OF SHOES</p>
          <h2>
            A place for
            <br />
            <em>your traditions.</em>
          </h2>
          <p>
            In the heart of Machindranath, Kathmandu, Gautam Lady Shoes brings
            together the pieces that make a celebration feel like home.
          </p>
          <p>
            From embroidered footwear to traditional outfits and your little
            one’s first Pasni, explore a collection for every chapter of your
            family’s story.
          </p>
          <a className="text-link" href="#contact">
            Come say namaste <ArrowUpRight size={18} />
          </a>
          <span className="story-signature">With love, from Kathmandu.</span>
        </div>
      </section>
      <section id="collections" className="collection-section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THOUGHTFULLY BROUGHT TOGETHER</p>
            <h2>
              For every <em>kind of moment.</em>
            </h2>
          </div>
          <span className="section-index">01 — 03</span>
        </div>
        <div className="collection-grid">
          {collections.map((c, i) => (
            <Link
              className={"collection-card collection-" + i}
              key={c.href}
              href={c.href}
            >
              <div className="collection-photo">
                <Image
                  src={imageUrl(c.image)}
                  alt={c.name}
                  fill
                  sizes="(max-width:650px) 100vw, 33vw"
                  className="object-contain"
                />
                <span className="collection-arrow">
                  <ArrowUpRight size={24} />
                </span>
              </div>
              <p className="eyebrow">{c.tag}</p>
              <h3>{c.name}</h3>
              <p>{c.note}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="featured-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A FEW PIECES TO FALL FOR</p>
              <h2>
                The collection, <em>up close.</em>
              </h2>
            </div>
            <Link className="text-link" href={"/" + category}>
              View the collection <ArrowUpRight size={18} />
            </Link>
          </div>
          <div
            className="collection-tabs"
            aria-label="Choose featured collection"
          >
            {[
              ["slippers", "Footwear"],
              ["clothing", "Clothing"],
              ["collections", "Essentials"],
            ].map(([id, label]) => (
              <button
                key={id}
                className={category === id ? "active" : ""}
                aria-pressed={category === id}
                onClick={() => setCategory(id)}
              >
                {label}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="product-grid" aria-label="Loading products">
              {[1, 2, 3, 4].map((i) => (
                <div className="product-skeleton" key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="collection-empty">
              <p>We couldn’t load this collection just now.</p>
              <button className="text-link" onClick={() => setRetry(retry + 1)}>
                Try again <ArrowRight size={16} />
              </button>
            </div>
          ) : products.length ? (
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p._id} {...p} id={p._id} />
              ))}
            </div>
          ) : (
            <div className="collection-empty">
              <p>New pieces are on their way.</p>
              <a
                className="text-link"
                href="https://wa.me/9779849591758"
                target="_blank"
                rel="noreferrer"
              >
                Ask us about availability <ArrowUpRight size={16} />
              </a>
            </div>
          )}
        </div>
      </section>
      <section className="details-section container">
        <div className="details-copy">
          <p className="eyebrow">THE FINISHING TOUCHES</p>
          <h2>
            It’s the little things
            <br />
            that make it <em>yours.</em>
          </h2>
          <p>
            Malas, traditional pouches, and ceremony essentials. Beautiful
            details to bring the whole occasion together.
          </p>
          <Link className="button-primary" href="/collections">
            Discover the essentials <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="detail-art">
          <Image
            src={imageUrl("/media/studio/ceremony-jewellery.webp")}
            alt="A rendered gold and green necklace study inspired by ceremony jewellery"
            fill
            sizes="(max-width:800px) 100vw, 50vw"
            className="object-cover"
          />
          <span className="detail-caption">A STUDY IN CELEBRATION</span>
        </div>
      </section>
      <section id="contact" className="visit-section">
        <div className="container visit-grid">
          <div>
            <p className="eyebrow">FIND US IN THE VALLEY</p>
            <h2>
              Your next tradition
              <br />
              starts <em>right here.</em>
            </h2>
            <a
              className="button-light"
              href="https://www.google.com/maps/search/?api=1&query=Gautam+Lady+Shoes+Machindranath+Kathmandu"
              target="_blank"
              rel="noreferrer"
            >
              Get directions <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="visit-details">
            <p>
              <MapPin size={20} />
              <span>
                Machindranath
                <br />
                Kathmandu, Nepal
              </span>
            </p>
            <p>
              <Phone size={20} />
              <a href="tel:+9779849591758">+977 984 959 1758</a>
            </p>
            <a
              className="text-link"
              href="https://wa.me/9779849591758"
              target="_blank"
              rel="noreferrer"
            >
              Let’s chat on WhatsApp <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
