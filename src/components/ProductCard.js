// src/components/ProductCard.js
import React from "react";
import { useCart } from "../CartContext";

function badge(product) {
  const ageHours = product.createdAt
    ? (Date.now() - new Date(product.createdAt)) / 36e5
    : 999;
  if (ageHours < 48) return { label: "New", cls: "" };
  if (product.stock > 0 && product.stock < 5) return { label: "Hot", cls: "hot" };
  return null;
}

export default function ProductCard({ product, onClick }) {
  const { addItem, items } = useCart();
  const inCart = items.some(i => i.productId === product.id);
  const b      = badge(product);
  const thumb  = product.images?.[0]?.url;

  function handleAdd(e) {
    e.stopPropagation();
    addItem({
      productId:   product.id,
      productName: product.name,
      price:       product.price,
      image:       thumb,
    });
  }

  return (
    <article className="product-card" onClick={() => onClick(product)} role="button" tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onClick(product)}>
      <div className="product-img-wrap">
        {thumb
          ? <img src={thumb} alt={product.name} loading="lazy" />
          : <div style={{ width: "100%", height: "100%", background: "#e5e7eb" }} />}
        {b && <span className={`product-badge ${b.cls}`}>{b.label}</span>}
        {product.stock === 0 && (
          <div className="out-of-stock-overlay">Out of stock</div>
        )}
      </div>
      <div className="product-info">
        <p className="product-name">{product.name}</p>
        {product.description && (
          <p className="product-sub">{product.description.slice(0, 40)}{product.description.length > 40 ? "…" : ""}</p>
        )}
        <div className="product-row">
          <span className="product-price">₹{product.price.toLocaleString("en-IN")}</span>
          <button
            className="add-btn"
            onClick={handleAdd}
            disabled={product.stock === 0}
            aria-label={inCart ? "Added to cart" : "Add to cart"}
          >
            {inCart ? "✓ Added" : "+ Add"}
          </button>
        </div>
      </div>
    </article>
  );
}
