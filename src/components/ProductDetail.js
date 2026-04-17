// src/components/ProductDetail.js
import React from "react";
import { useCart } from "../CartContext";

export default function ProductDetail({ product, onClose }) {
  const { addItem, items } = useCart();
  const inCart = items.some(i => i.productId === product.id);
  const images = product.images ?? [];

  function handleAdd() {
    addItem({
      productId:   product.id,
      productName: product.name,
      price:       product.price,
      image:       images[0]?.url,
    });
  }

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} aria-hidden="true" />
      <div className="detail-sheet" role="dialog" aria-modal="true" aria-label={product.name}>

        {/* Image carousel (simple – swipe not implemented, shows first image) */}
        {images[0]
          ? <img className="detail-img" src={images[0].url} alt={product.name} />
          : <div className="detail-img" style={{ background: "#e5e7eb" }} />}

        {/* Thumbnail strip if multiple images */}
        {images.length > 1 && (
          <div style={{ display: "flex", gap: 8, padding: "8px 16px", overflowX: "auto" }}>
            {images.map((img, i) => (
              <img key={i} src={img.url} alt=""
                style={{ width: 56, height: 56, objectFit: "cover",
                  borderRadius: 8, flexShrink: 0, border: i === 0 ? "2px solid #25D366" : "2px solid transparent" }} />
            ))}
          </div>
        )}

        <div className="detail-body">
          {/* Close pill */}
          <button onClick={onClose}
            style={{ display: "block", margin: "0 auto 12px",
              background: "#e5e7eb", border: "none", borderRadius: 20,
              padding: "4px 20px", fontSize: 12, color: "#6b7280" }}>
            Close
          </button>

          <h2 className="detail-name">{product.name}</h2>
          <p className="detail-price">₹{product.price.toLocaleString("en-IN")}</p>

          <p className="detail-meta">
            <span>Category: <strong>{product.category}</strong></span>
            <span>Stock: <strong>{product.stock > 0 ? `${product.stock} left` : "Out of stock"}</strong></span>
          </p>

          {product.description && (
            <p className="detail-desc">{product.description}</p>
          )}

          <button
            className="checkout-btn"
            onClick={handleAdd}
            disabled={product.stock === 0}
            style={{ marginTop: 8 }}
          >
            {inCart ? "✓ Added to cart" : "+ Add to cart"}
          </button>
        </div>
      </div>
    </>
  );
}
