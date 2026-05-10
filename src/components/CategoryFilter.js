// src/components/CategoryFilter.js
import React, { useEffect, useRef } from "react";

export default function CategoryFilter({ categories, active, focused, onSelect, allImage }) {
  const scrollRef = useRef(null);

  // Auto-scroll focused/active category into view (horizontal only)
  useEffect(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const target = container.querySelector(".cat-pill.focused") || 
                   container.querySelector(".cat-pill.active");
    
    if (target) {
      const rect = container.getBoundingClientRect();
      // Only scroll horizontally if the category bar is actually visible to the user.
      // This prevents browsers from "helpfully" scrolling the window vertically to 
      // bring the category bar into view when the automatic focus rotation triggers.
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible) {
        const targetLeft = target.offsetLeft;
        const targetWidth = target.offsetWidth;
        const containerWidth = container.offsetWidth;
        const scrollPos = targetLeft - (containerWidth / 2) + (targetWidth / 2);

        container.scrollLeft = scrollPos;
      }
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



