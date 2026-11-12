"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { CatalogProduct } from "@/lib/catalog/types";
import { imageUrl } from "@/lib/media/images";
import { useRemoteData } from "@/lib/hooks/useRemoteData";
const ProductFormModal = dynamic(() => import("./ProductFormModal"));
export default function ProductsTable() {
  const [search, setSearch] = useState(""),
    [debounced, setDebounced] = useState(""),
    [category, setCategory] = useState(""),
    [page, setPage] = useState(1),
    [error, setError] = useState(""),
    [retry, setRetry] = useState(0),
    [modal, setModal] = useState(false),
    [selected, setSelected] = useState<CatalogProduct | null>(null),
    [deleting, setDeleting] = useState("");
  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 250);
    return () => clearTimeout(t);
  }, [search]);
  const q = new URLSearchParams({
    page: String(page),
    limit: "12",
    search: debounced,
    category,
  });
  const {
    data,
    loading,
    error: loadError,
  } = useRemoteData<{
    products: CatalogProduct[];
    totalCount: number;
    totalPages: number;
  }>("/api/admin/products?" + q, retry);
  const products = data?.products || [],
    total = data?.totalCount || 0,
    pages = data?.totalPages || 0;
  async function remove(product: CatalogProduct) {
    if (!confirm("Delete " + product.name + "? This removes it from the shop."))
      return;
    setDeleting(product._id);
    try {
      const r = await fetch("/api/admin/products/" + product._id, {
        method: "DELETE",
      });
      if (!r.ok) throw new Error("The product could not be deleted.");
      if (products.length === 1 && page > 1) setPage(page - 1);
      else setRetry(retry + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setDeleting("");
    }
  }
  return (
    <section aria-label="Manage products">
      <div className="admin-toolbar">
        <div className="catalog-search">
          <Search size={17} />
          <input
            aria-label="Search products"
            placeholder="Search your products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          aria-label="Filter product category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All collections</option>
          <option value="slippers">Footwear</option>
          <option value="clothing">Clothing</option>
          <option value="collections">Essentials</option>
        </select>
        <button
          className="button-primary"
          onClick={() => {
            setSelected(null);
            setModal(true);
          }}
        >
          <Plus size={17} />
          Add product
        </button>
        <span style={{ fontSize: 11 }} aria-live="polite">
          {loading ? "Updating…" : total + " products"}
        </span>
      </div>
      {(error || loadError) && (
        <div className="admin-feedback" role="alert">
          <p>{error || loadError}</p>
          <button className="text-link" onClick={() => setRetry(retry + 1)}>
            Try again
          </button>
        </div>
      )}
      {loading && !products.length ? (
        <div className="admin-loading" />
      ) : (
        <div className="admin-table-wrap" aria-busy={loading}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Collection</th>
                <th>Price</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="admin-product-cell">
                      <div className="admin-thumb">
                        <Image
                          src={imageUrl(p.image, 160)}
                          alt={p.name}
                          fill
                          sizes="48px"
                          unoptimized
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <strong>{p.name}</strong>
                        <span>{p.subCategory?.replace(/([A-Z])/g, " $1")}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    {p.category === "slippers"
                      ? "Footwear"
                      : p.category === "clothing"
                        ? "Clothing"
                        : "Essentials"}
                  </td>
                  <td>{p.price}</td>
                  <td>
                    <span
                      className={
                        "status-pill " + (!p.isAvailable ? "cancelled" : "")
                      }
                    >
                      {p.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        aria-label={"Edit " + p.name}
                        onClick={() => {
                          setSelected(p);
                          setModal(true);
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        aria-label={"Delete " + p.name}
                        disabled={deleting === p._id}
                        onClick={() => remove(p)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!products.length && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 45 }}>
                    No products match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="pagination">
        <span>
          {total
            ? (page - 1) * 12 +
              1 +
              "–" +
              Math.min(page * 12, total) +
              " of " +
              total
            : "No products"}{" "}
          · Page {page}
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
      {modal && (
        <ProductFormModal
          isOpen={modal}
          product={selected}
          onClose={() => setModal(false)}
          onSuccess={() => setRetry(retry + 1)}
        />
      )}
    </section>
  );
}
