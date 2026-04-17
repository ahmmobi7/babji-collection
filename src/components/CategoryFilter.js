// src/components/CategoryFilter.js
import React from "react";

export default function CategoryFilter({ categories, active, onSelect }) {
  return (
    <nav className="categories" aria-label="Product categories">
      <div className="categories-scroll">
        <button
          className={`cat-pill ${active === "" ? "active" : ""}`}
          onClick={() => onSelect("")}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`cat-pill ${active === cat.slug ? "active" : ""}`}
            onClick={() => onSelect(cat.slug)}
          >
            {cat.emoji && <span style={{ marginRight: 4 }}>{cat.emoji}</span>}
            {cat.name}
          </button>
        ))}
      </div>
    </nav>
  );
}
