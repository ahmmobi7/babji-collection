// src/components/Header.js
import React, { useState } from "react";
import { useCart } from "../CartContext";
import "./Header.css";

export default function Header({ storeName, onCartClick, onHomeClick }) {
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <div className="header-left">
            <button className="menu-btn" onClick={toggleMenu} aria-label="Open menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <div className="header-brand" onClick={onHomeClick} style={{ cursor: "pointer" }}>
              <div className="circle-logo">Babji</div>
              <div>
                <h1 className="header-title glitter-text">{storeName}</h1>
                <p className="header-sub">Wholesale Price Latest Fashion</p>
              </div>
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

      {/* Hamburger Menu Drawer */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={toggleMenu}>
          <div className="menu-drawer" onClick={e => e.stopPropagation()}>
            <div className="menu-header">
              <div className="circle-logo dark">Babji</div>
              <button className="menu-close" onClick={toggleMenu}>&times;</button>
            </div>
            <nav className="menu-nav">
              <a href="#" className="menu-link active" onClick={(e) => { e.preventDefault(); onHomeClick(); toggleMenu(); }}>Home</a>
              <a href="#" className="menu-link" onClick={toggleMenu}>Categories</a>
              <a href="#" className="menu-link" onClick={toggleMenu}>My Orders</a>
              <a href="#" className="menu-link" onClick={toggleMenu}>Support</a>
              <a href="#" className="menu-link" onClick={toggleMenu}>About Us</a>
            </nav>
            <div className="menu-footer">
              <p>© 2024 {storeName}</p>
              <p>Powered by CatalogSnap</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

