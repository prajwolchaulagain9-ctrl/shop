"use client";
import { useState, useRef, useEffect } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import { CatalogProduct } from "@/lib/catalog/types";
import { imageUrl } from "@/lib/media/images";
import { prepareProductImage } from "@/lib/media/prepare-upload";
interface Props {
  isOpen: boolean;
  onClose: () => void;
  product?: CatalogProduct | null;
  onSuccess: () => void;
}
const subcategories: Record<string, [string, string][]> = {
  slippers: [
    ["flat", "Flat slippers"],
    ["blockHeel", "Block heel"],
    ["mediumHeel", "Medium heel"],
    ["smallHeel", "Small heel"],
  ],
  clothing: [
    ["pasni", "Pasni"],
    ["krishnaRadha", "Krishna / Radha"],
    ["daura", "Daura Suruwal"],
    ["plainKurta", "Plain kurta"],
    ["specialKurta", "Embroidered kurta"],
    ["gunya", "Gunyu Choli"],
  ],
  collections: [],
};
export default function ProductFormModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false),
    [file, setFile] = useState<File | null>(null),
    [preview, setPreview] = useState(""),
    [error, setError] = useState("");
  const [form, setForm] = useState({
    name: product?.name || "",
    price: product?.price || "",
    description: product?.description || "",
    category: product?.category || "slippers",
    subCategory: product?.subCategory || "",
    isAvailable: product?.isAvailable ?? true,
  });
  const input = useRef<HTMLInputElement>(null),
    dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!file) {
      setPreview(product?.image ? imageUrl(product.image, 800) : "");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file, product]);
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = setTimeout(
      () => dialog.current?.querySelector<HTMLButtonElement>("button")?.focus(),
      0,
    );
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [isOpen]);
  if (!isOpen) return null;
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      let url: string | undefined;
      if (file) {
        const body = new FormData();
        body.append("file", await prepareProductImage(file));
        const response = await fetch("/api/upload", { method: "POST", body });
        const data = await response.json();
        if (!response.ok || !data.url)
          throw new Error(data.message || "Image upload failed.");
        url = data.url;
      }
      if (!product && !url)
        throw new Error("Choose a product image before saving.");
      const body = { ...form, ...(url ? { image: url } : {}) };
      const response = await fetch(
        product ? "/api/admin/products/" + product._id : "/api/admin/products",
        {
          method: product ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "The product could not be saved.");
      onSuccess();
      onClose();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Save failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }
  function choose(e: React.ChangeEvent<HTMLInputElement>) {
    const chosen = e.target.files?.[0];
    if (!chosen) return;
    if (
      !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(
        chosen.type,
      ) ||
      chosen.size > 10 * 1024 * 1024
    ) {
      setError("Choose a JPEG, PNG, WebP or AVIF image smaller than 10 MB.");
      return;
    }
    setError("");
    setFile(chosen);
  }
  return (
    <div
      className="admin-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-dialog-title"
        ref={dialog}
        onKeyDown={(e) => {
          if (e.key === "Escape" && !loading) onClose();
          if (e.key === "Tab") {
            const els = dialog.current?.querySelectorAll<HTMLElement>(
              "button:not(:disabled),input:not([type=hidden]),select,textarea",
            );
            if (!els?.length) return;
            const first = els[0],
              last = els[els.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }}
      >
        <div className="admin-modal-header">
          <h2 id="product-dialog-title">
            {product ? "Edit product" : "Add a beautiful new piece"}
          </h2>
          <button
            type="button"
            className="icon-button"
            aria-label="Close product form"
            disabled={loading}
            onClick={onClose}
          >
            <X size={21} />
          </button>
        </div>
        <form onSubmit={submit}>
          <button
            type="button"
            className="upload-button"
            onClick={() => input.current?.click()}
          >
            {preview ? (
              <Image
                src={preview}
                alt="Selected product image"
                fill
                sizes="600px"
                unoptimized
                className="object-contain"
              />
            ) : (
              <>
                <Upload size={25} />
                <span>Choose a product image</span>
              </>
            )}
          </button>
          <input
            ref={input}
            type="file"
            hidden
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={choose}
          />
          <p style={{ fontSize: 11, color: "#697762" }}>
            JPEG, PNG, WebP or AVIF · up to 10 MB
          </p>
          <div className="field-grid">
            <div className="field">
              <label htmlFor="product-name">Product name</label>
              <input
                id="product-name"
                required
                maxLength={100}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="product-price">Price (e.g. NPR 1200)</label>
              <input
                id="product-price"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
          </div>
          <div className="field-grid">
            <div className="field">
              <label htmlFor="product-category">Collection</label>
              <select
                id="product-category"
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as CatalogProduct["category"],
                    subCategory: "",
                  })
                }
              >
                <option value="slippers">Footwear</option>
                <option value="clothing">Clothing</option>
                <option value="collections">Essentials</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="product-style">Style</label>
              <select
                id="product-style"
                value={form.subCategory}
                onChange={(e) =>
                  setForm({ ...form, subCategory: e.target.value })
                }
              >
                <option value="">General collection</option>
                {subcategories[form.category].map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="product-description">Description</label>
            <textarea
              id="product-description"
              required
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <label style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={form.isAvailable}
              onChange={(e) =>
                setForm({ ...form, isAvailable: e.target.checked })
              }
            />
            Available to order
          </label>
          {error && (
            <p role="alert" className="field-error">
              {error}
            </p>
          )}
          <div className="modal-actions">
            <button
              className="text-link"
              type="button"
              disabled={loading}
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="button-primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Saving…
                </>
              ) : (
                "Save product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
