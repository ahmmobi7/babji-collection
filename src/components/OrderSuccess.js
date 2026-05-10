// src/components/OrderSuccess.js
import React from "react";

export default function OrderSuccess({ order, storeName, onClose }) {
  const ownerPhone = process.env.REACT_APP_OWNER_PHONE; // set in .env

  // Build a WhatsApp message the customer can also send manually
  function openWhatsApp() {
    const lines = order.items
      .map(i => `• ${i.productName} × ${i.qty} = ₹${(i.price * i.qty).toLocaleString("en-IN")}`)
      .join("\n");
    const msg = encodeURIComponent(
      `Hi ${storeName}! I just placed order #${order.id.slice(0, 8)}.\n\n${lines}\n\nTotal: ₹${order.total.toLocaleString("en-IN")}`
    );
    const url = ownerPhone
      ? `https://wa.me/${ownerPhone}?text=${msg}`
      : `https://wa.me/?text=${msg}`;
    window.open(url, "_blank");
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="success">
          <div className="success-icon">🎉</div>
          <h2 className="success-title">Order placed!</h2>
          <p className="success-sub">
            {storeName} will confirm your order on WhatsApp shortly.
          </p>
          <div className="success-order">
            <p>Order ID: <strong>#{order.id.slice(0, 8).toUpperCase()}</strong></p>
            <p style={{ marginTop: 4 }}>Total: <strong>₹{order.total.toLocaleString("en-IN")}</strong></p>
          </div>
          <button className="checkout-btn" onClick={openWhatsApp} style={{ marginBottom: 12 }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
              <path d="M9 1C4.6 1 1 4.6 1 9c0 1.4.4 2.8 1 4L1 17l4.1-1.1C6.4 16.6 7.7 17 9 17c4.4 0 8-3.6 8-8s-3.6-8-8-8z"/>
            </svg>
            Also message on WhatsApp
          </button>
          <button className="btn-secondary" onClick={onClose} style={{ width: "100%", padding: 12 }}>
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  );
}
