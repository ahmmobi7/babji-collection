// src/components/ProductGrid.js
import React from "react";
import ProductCard from "./ProductCard";

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-img" />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text short" />
    </div>
  );
}

export default function ProductGrid({ products, loading, onProductClick }) {
  if (loading) {
    return (
      <div className="products">
        <div className="product-grid">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="empty-state">
        <p style={{ fontSize: 32, marginBottom: 8 }}>📦</p>
        <p>No products in this category yet.</p>
        <p style={{ fontSize: 12, marginTop: 4 }}>Check back soon!</p>
      </div>
    );
  }

  return (
    <section className="products">
      <div className="product-grid">
        {products.map(p => (
          <ProductCard key={p.id} product={p} onClick={onProductClick} />
        ))}
      </div>
    </section>
  );
}
