// src/components/Cart.js
import React from "react";
import { useCart } from "../CartContext";

export default function Cart({ onClose, onCheckout }) {
  const { items, removeItem, changeQty, total } = useCart();

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} aria-hidden="true" />
      <div className="drawer" role="dialog" aria-modal="true" aria-label="Shopping cart">
        <div className="drawer-header">
          <h2 className="drawer-title">Your cart ({items.length} item{items.length !== 1 ? "s" : ""})</h2>
          <button className="drawer-close" onClick={onClose} aria-label="Close cart">✕</button>
        </div>

        {items.length === 0 ? (
          <p className="cart-empty">Your cart is empty 🛒</p>
        ) : (
          <>
            <ul className="cart-items">
              {items.map(item => (
                <li key={item.productId} className="cart-item">
                  {item.image
                    ? <img className="cart-item-img" src={item.image} alt={item.productName} />
                    : <div className="cart-item-img" style={{ background: "#e5e7eb" }} />}
                  <div style={{ flex: 1 }}>
                    <p className="cart-item-name">{item.productName}</p>
                    <p className="cart-item-price">₹{item.price.toLocaleString("en-IN")} each</p>
                  </div>
                  <div className="qty-ctrl">
                    <button
                      className="qty-btn"
                      onClick={() => changeQty(item.productId, item.qty - 1)}
                      aria-label="Decrease quantity"
                    >−</button>
                    <span className="qty-val">{item.qty}</span>
                    <button
                      className="qty-btn"
                      onClick={() => changeQty(item.productId, item.qty + 1)}
                      aria-label="Increase quantity"
                    >+</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="cart-footer">
              <div className="cart-total-row">
                <span className="cart-total-label">Total</span>
                <span className="cart-total-val">₹{total.toLocaleString("en-IN")}</span>
              </div>
              <button className="checkout-btn" onClick={onCheckout}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
                  <path d="M9 1C4.6 1 1 4.6 1 9c0 1.4.4 2.8 1 4L1 17l4.1-1.1C6.4 16.6 7.7 17 9 17c4.4 0 8-3.6 8-8s-3.6-8-8-8z"/>
                </svg>
                Place Order via WhatsApp
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
