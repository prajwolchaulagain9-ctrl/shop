"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { CatalogProduct } from "@/lib/catalog/types";

const options: Record<string, [string, string][]> = {
  slippers: [
    ["flat", "Flat slippers"],
    ["blockHeel", "Block heels"],
    ["mediumHeel", "Medium heels"],
    ["smallHeel", "Small heels"],
  ],
  clothing: [
    ["pasni", "Pasni outfits"],
    ["krishnaRadha", "Krishna & Radha"],
    ["daura", "Daura Suruwal"],
    ["plainKurta", "Plain kurta"],
    ["specialKurta", "Embroidered kurta"],
    ["gunya", "Gunyu Choli"],
  ],
  collections: [],
};
import { useRemoteData } from "@/lib/hooks/useRemoteData";
const copy: Record<string, [string, string, string]> = {
  slippers: [
    "THE FOOTWEAR COLLECTION",
    "A little heritage, every step.",
    "Embroidered velvet, traditional details, and beautiful pairs for everyday life and special occasions.",
  ],
  clothing: [
    "THE CLOTHING COLLECTION",
    "Tradition, in every thread.",
    "Kurta, Newari attire, Gunyu Choli, and celebration outfits for your family’s meaningful moments.",
  ],
  collections: [
    "CELEBRATION ESSENTIALS",
    "The details make it yours.",
    "Malas, pouches, and ceremony pieces to bring your celebration together.",
  ],
};
export default function CatalogPage({ category }: { category: string }) {
  const params = useSearchParams();
  const [sub, setSub] = useState(params.get("collection") || ""),
    [search, setSearch] = useState(""),
    [debounced, setDebounced] = useState(""),
    [page, setPage] = useState(1),
    [retry, setRetry] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 250);
    return () => clearTimeout(t);
  }, [search]);
  const query = new URLSearchParams({
    category,
    page: String(page),
    limit: "24",
    search: debounced,
  });
  if (sub) query.set("subCategory", sub);
  const { data, loading, error } = useRemoteData<{
    products: CatalogProduct[];
    totalCount: number;
    totalPages: number;
  }>("/api/products?" + query, retry);
  const products = data?.products || [],
    total = data?.totalCount || 0,
    pages = data?.totalPages || 0;
  const [tag, title, description] = copy[category];
  return (
    <main id="main-content">
      <section className="catalog-header">
        <div className="container">
          <p className="eyebrow">{tag}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </section>
      <div className="container catalog-body">
        <div className="catalog-toolbar">
          <div className="catalog-search">
            <Search size={17} />
            <input
              aria-label="Search this collection"
              placeholder="Find your next favourite…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {options[category].length > 0 && (
            <select
              aria-label="Filter by style"
              value={sub}
              onChange={(e) => {
                setSub(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All styles</option>
              {options[category].map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          )}
          <span style={{ fontSize: 12 }}>{!loading && total + " pieces"}</span>
        </div>
        {loading ? (
          <div className="product-grid" aria-label="Loading collection">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="product-skeleton" />
            ))}
          </div>
        ) : error ? (
          <div className="collection-empty">
            <p>This collection couldn’t load just now.</p>
            <button className="text-link" onClick={() => setRetry(retry + 1)}>
              Try again
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
            <p>No pieces match your search.</p>
            <button
              className="text-link"
              onClick={() => {
                setSub("");
                setSearch("");
                setPage(1);
              }}
            >
              See the whole collection
            </button>
          </div>
        )}
        {pages > 1 && (
          <div className="pagination">
            <span>
              Page {page} of {pages} · {total} pieces
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
                disabled={page === pages || loading}
                onClick={() => setPage(page + 1)}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
