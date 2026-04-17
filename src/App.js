// src/App.js
import React, { useState, useEffect, useCallback } from "react";
import Header        from "./components/Header";
import CategoryFilter from "./components/CategoryFilter";
import ProductGrid   from "./components/ProductGrid";
import Cart          from "./components/Cart";
import OrderModal    from "./components/OrderModal";
import OrderSuccess  from "./components/OrderSuccess";
import ProductDetail from "./components/ProductDetail";
import { CartProvider } from "./CartContext";
import { api }       from "./services/api";
import { useToast }  from "./useToast";
import "./index.css";

const STORE_NAME = process.env.REACT_APP_STORE_NAME || "My Store";

// ── Inner app (needs CartProvider above) ────────────────────────────────────
function AppInner() {
  const [categories,  setCategories]  = useState([]);
  const [products,    setProducts]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [activeCategory, setActiveCategory] = useState("");

  // UI state
  const [cartOpen,    setCartOpen]    = useState(false);
  const [orderOpen,   setOrderOpen]   = useState(false);
  const [successOrder,setSuccessOrder]= useState(null);
  const [detailItem,  setDetailItem]  = useState(null);

  const { toast, showToast } = useToast();

  // ── Fetch categories once ────────────────────────────────────────────────
  useEffect(() => {
    api.getCategories()
      .then(d => setCategories(d.categories))
      .catch(err => console.error("Categories:", err));
  }, []);

  // ── Fetch products when category changes ─────────────────────────────────
  const fetchProducts = useCallback(async (category) => {
    setLoading(true);
    try {
      const params = category ? { category } : {};
      const data   = await api.getProducts(params);
      setProducts(data.products);
    } catch (err) {
      console.error("Products:", err);
      showToast("Failed to load products — retrying…");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchProducts(activeCategory); }, [activeCategory, fetchProducts]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  function handleCategorySelect(slug) {
    setActiveCategory(slug);
  }

  function handleProductClick(product) {
    setDetailItem(product);
  }

  function handleCheckout() {
    setCartOpen(false);
    setOrderOpen(true);
  }

  function handleOrderSuccess(order) {
    setOrderOpen(false);
    setSuccessOrder(order);
  }

  function handleSuccessClose() {
    setSuccessOrder(null);
    fetchProducts(activeCategory); // refresh stock
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="app">
      <Header storeName={STORE_NAME} onCartClick={() => setCartOpen(true)} />
      <CategoryFilter
        categories={categories}
        active={activeCategory}
        onSelect={handleCategorySelect}
      />
      <ProductGrid
        products={products}
        loading={loading}
        onProductClick={handleProductClick}
      />

      {/* Overlays */}
      {cartOpen && (
        <Cart
          onClose={() => setCartOpen(false)}
          onCheckout={handleCheckout}
        />
      )}
      {orderOpen && (
        <OrderModal
          onClose={() => setOrderOpen(false)}
          onSuccess={handleOrderSuccess}
        />
      )}
      {successOrder && (
        <OrderSuccess
          order={successOrder}
          storeName={STORE_NAME}
          onClose={handleSuccessClose}
        />
      )}
      {detailItem && (
        <ProductDetail
          product={detailItem}
          onClose={() => setDetailItem(null)}
        />
      )}

      {/* Toast */}
      {toast && <div className="toast" role="alert">{toast}</div>}
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppInner />
    </CartProvider>
  );
}
