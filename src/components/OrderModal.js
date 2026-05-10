// src/components/OrderModal.js
import React, { useState } from "react";
import { useCart } from "../CartContext";
import { api } from "../services/api";

const EMPTY = { name: "", phone: "", address: "" };

export default function OrderModal({ onClose, onSuccess }) {
  const { items, total, clearCart } = useCart();
  const [form,   setForm]   = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!form.name.trim())    e.name    = "Please enter your name";
    if (!form.phone.trim())   e.phone   = "Please enter your phone number";
    if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Enter a valid 10-digit number";
    if (!form.address.trim()) e.address = "Please enter your delivery address";
    return e;
  }

  function change(field) {
    return e => {
      setForm(f => ({ ...f, [field]: e.target.value }));
      if (errors[field]) setErrors(er => ({ ...er, [field]: undefined }));
    };
  }

  async function submit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    try {
      const order = await api.placeOrder({
        customerName:    form.name.trim(),
        customerPhone:   form.phone.trim(),
        customerAddress: form.address.trim(),
        items: items.map(i => ({
          productId:   i.productId,
          productName: i.productName,
          qty:         i.qty,
          price:       i.price,
        })),
      });
      clearCart();
      onSuccess(order);
    } catch (err) {
      setErrors({ api: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Place your order">
        <h2 className="modal-title">Delivery details</h2>

        {errors.api && (
          <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8,
            padding: "10px 12px", marginBottom: 12, fontSize: 13, color: "#dc2626" }}>
            {errors.api}
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="cname">Full name *</label>
          <input id="cname" className={`form-input ${errors.name ? "error" : ""}`}
            placeholder="Priya Sharma" value={form.name} onChange={change("name")} />
          {errors.name && <p className="form-err">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cphone">WhatsApp number *</label>
          <input id="cphone" className={`form-input ${errors.phone ? "error" : ""}`}
            placeholder="9876543210" type="tel" inputMode="numeric"
            value={form.phone} onChange={change("phone")} />
          {errors.phone && <p className="form-err">{errors.phone}</p>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="caddress">Delivery address *</label>
          <textarea id="caddress" className={`form-input ${errors.address ? "error" : ""}`}
            placeholder="Flat no, Street, City, PIN code"
            rows={3} style={{ resize: "none" }}
            value={form.address} onChange={change("address")} />
          {errors.address && <p className="form-err">{errors.address}</p>}
        </div>

        {/* Order summary */}
        <div style={{ background: "#f9fafb", borderRadius: 8, padding: "10px 12px",
          fontSize: 13, marginBottom: 4 }}>
          {items.map(i => (
            <div key={i.productId} style={{ display: "flex", justifyContent: "space-between",
              marginBottom: 4, color: "#6b7280" }}>
              <span>{i.productName} × {i.qty}</span>
              <span>₹{(i.price * i.qty).toLocaleString("en-IN")}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between",
            fontWeight: 700, color: "#1a1a1a", borderTop: "1px solid #e5e7eb",
            marginTop: 6, paddingTop: 6 }}>
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn-primary" onClick={submit} disabled={loading}>
            {loading ? "Placing…" : (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                  <path d="M8 1C4.1 1 1 4.1 1 8c0 1.2.3 2.4.9 3.5L1 15l3.6-1c1 .6 2.2.9 3.4.9 3.9 0 7-3.1 7-7s-3.1-7-7-7z"/>
                </svg>
                Confirm Order
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
