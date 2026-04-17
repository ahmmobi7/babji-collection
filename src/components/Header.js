// src/components/Header.js
import React from "react";
import { useCart } from "../CartContext";
import "./Header.css";

export default function Header({ storeName, onCartClick }) {
  const { itemCount } = useCart();

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <span className="header-logo">🛍️</span>
          <div>
            <h1 className="header-title">{storeName}</h1>
            <p className="header-sub">Fresh from supplier to you</p>
          </div>
        </div>
        <button className="cart-btn" onClick={onCartClick} aria-label="Open cart">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="7" cy="17" r="1.5" fill="currentColor"/>
            <circle cx="17" cy="17" r="1.5" fill="currentColor"/>
          </svg>
          {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
        </button>
      </div>
    </header>
  );
}
