// src/components/ProductDetail.js
import React, { useState, useRef, useEffect } from "react";
import { useCart } from "../CartContext";

export default function ProductDetail({ product, onClose }) {
  const { addItem, items } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);
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

  // Scroll to a specific image index
  const scrollTo = (index) => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.offsetWidth;
    scrollRef.current.scrollTo({ left: index * width, behavior: "smooth" });
  };

  const nextImage = () => {
    const nextIdx = (currentIndex + 1) % images.length;
    scrollTo(nextIdx);
  };

  const prevImage = () => {
    const prevIdx = (currentIndex - 1 + images.length) % images.length;
    scrollTo(prevIdx);
  };

  // Sync state with scroll position
  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.offsetWidth;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} aria-hidden="true" />
      <div className="detail-sheet" role="dialog" aria-modal="true" aria-label={product.name}>
        
        {/* Close button (top right of sheet) */}
        <button onClick={onClose} className="detail-close-btn" aria-label="Close detail">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Image carousel with native swipe support */}
        <div className="carousel-container">
          {images.length > 0 ? (
            <>
              <div 
                className="carousel-scroll" 
                ref={scrollRef}
                onScroll={handleScroll}
              >
                {images.map((img, i) => (
                  <div key={i} className="carousel-item">
                    <img src={img.url} alt={`${product.name} - ${i + 1}`} />
                  </div>
                ))}
              </div>
              
              {images.length > 1 && (
                <>
                  <button className="carousel-nav prev" onClick={prevImage} aria-label="Previous image">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <button className="carousel-nav next" onClick={nextImage} aria-label="Next image">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                  <div className="carousel-dots">
                    {images.map((_, i) => (
                      <span 
                        key={i} 
                        className={`dot ${i === currentIndex ? 'active' : ''}`} 
                        onClick={() => scrollTo(i)}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="detail-img" style={{ background: "#e5e7eb" }} />
          )}
        </div>

        {/* Thumbnail strip if multiple images */}
        {images.length > 1 && (
          <div className="thumbnail-strip">
            {images.map((img, i) => (
              <img 
                key={i} 
                src={img.url} 
                alt=""
                onClick={() => scrollTo(i)}
                className={`thumb ${i === currentIndex ? 'active' : ''}`}
              />
            ))}
          </div>
        )}

        <div className="detail-body">
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


