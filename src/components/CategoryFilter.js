// src/components/CategoryFilter.js
import React, { useEffect, useRef } from "react";

export default function CategoryFilter({ categories, active, focused, onSelect, allImage }) {
  const scrollRef = useRef(null);

  // Auto-scroll focused/active category into view
  useEffect(() => {
    if (!scrollRef.current) return;
    // Prioritize scrolling to the focused item if it exists
    const target = scrollRef.current.querySelector(".cat-pill.focused") || 
                   scrollRef.current.querySelector(".cat-pill.active");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [focused, active]);

  return (
    <nav className="categories" aria-label="Product categories">
      <div className="categories-scroll" ref={scrollRef}>

        <button
          className={`cat-pill ${active === "" ? "active" : ""} ${focused === "" ? "focused" : ""}`}
          onClick={() => onSelect("")}
        >
          {allImage ? (
            <img src={allImage} alt="" className="cat-thumb" />
          ) : (
            <div className="cat-thumb-placeholder">All</div>
          )}
          <span>All</span>
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`cat-pill ${active === cat.slug ? "active" : ""} ${focused === cat.slug ? "focused" : ""}`}
            onClick={() => onSelect(cat.slug)}
          >
            {cat.image ? (
              <img src={cat.image} alt="" className="cat-thumb" />
            ) : (
              <div className="cat-thumb-placeholder">{cat.emoji || "📦"}</div>
            )}
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}



