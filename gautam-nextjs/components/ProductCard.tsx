"use client";
import { useState } from "react";
import Image from "next/image";
import { Plus, Check } from "lucide-react";
import { useCart } from "@/lib/contexts/CartContext";
import { useAuth } from "@/lib/contexts/AuthContext";
import { imageUrl } from "@/lib/media/images";
interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  image: string;
  description?: string;
  index?: number;
  category?: string;
}
export default function ProductCard({
  id,
  name,
  price,
  image,
  description,
  category,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [failed, setFailed] = useState(false);
  const [added, setAdded] = useState(false);
  return (
    <article className="product-card" aria-label={`Product: ${name}`}>
      <div className="product-image">
        <Image
          src={
            failed ? "/media/brand/image-unavailable.svg" : imageUrl(image, 900)
          }
          alt={name}
          fill
          sizes="(max-width: 600px) 50vw, (max-width: 1000px) 33vw, 25vw"
          className="object-contain"
          onError={() => setFailed(true)}
        />
        <span className="product-category">
          {category === "slippers"
            ? "Footwear"
            : category === "clothing"
              ? "Traditional clothing"
              : "Celebration essentials"}
        </span>
        <button
          className="product-add"
          aria-label={`Add ${name} to cart`}
          onClick={() => {
            addToCart({ productId: id, name, price, image });
            if (isAuthenticated) {
              setAdded(true);
              setTimeout(() => setAdded(false), 1800);
            }
          }}
        >
          {added ? <Check size={20} /> : <Plus size={20} />}
        </button>
      </div>
      <div className="product-info">
        <h3>{name}</h3>
        <p className="product-price">{price}</p>
        {description && <p className="product-description">{description}</p>}
      </div>
    </article>
  );
}
