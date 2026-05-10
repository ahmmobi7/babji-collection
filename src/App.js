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

const STORE_NAME = process.env.REACT_APP_STORE_NAME || "BABJI COLLECTION";
const OWNER_PHONE = process.env.REACT_APP_OWNER_PHONE || "919999999999";



// ── Inner app (needs CartProvider above) ────────────────────────────────────
function AppInner() {
  const [categories,  setCategories]  = useState([]);
  const [products,    setProducts]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const [focusedCategory, setFocusedCategory] = useState("");


  // UI state
  const [cartOpen,    setCartOpen]    = useState(false);
  const [orderOpen,   setOrderOpen]   = useState(false);
  const [successOrder,setSuccessOrder]= useState(null);
  const [detailItem,  setDetailItem]  = useState(null);
  const [allCategoryThumb, setAllCategoryThumb] = useState(null);


  const { toast, showToast } = useToast();

  // ── Fetch categories and initial products ──────────────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        const [catData, prodData] = await Promise.all([
          api.getCategories(),
          api.getProducts() // Fetch all products to get category thumbnails
        ]);

        const enrichedCategories = catData.categories.map(cat => {
          // Find the first product that belongs to this category
          // Match by name, slug, or category property
          const repProduct = prodData.products.find(p => 
            p.category === cat.name || 
            p.category === cat.slug || 
            p.categoryId === cat.id
          );
          return {
            ...cat,
            image: repProduct?.images?.[0]?.url || cat.image
          };
        });

        setCategories(enrichedCategories);
        
        // Use the first available product image as the "All" category thumbnail
        const allThumb = prodData.products.find(p => p.images?.[0]?.url)?.images[0].url;
        setAllCategoryThumb(allThumb);

        
        // If we are on "All" category, we already have the products
        if (activeCategory === "") {
          setProducts(prodData.products);
          setLoading(false);
        }
      } catch (err) {
        console.error("Initialization failed:", err);
      }
    };
    init();
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


  useEffect(() => { 
    fetchProducts(activeCategory); 
  }, [activeCategory, fetchProducts]);


  // ── Automatic Category Focus Rotation ──────────────────────────
  useEffect(() => {
    if (categories.length === 0) return;

    const timer = setInterval(() => {
      const allSlugs = ["", ...categories.map(c => c.slug)];
      const currentIndex = allSlugs.indexOf(focusedCategory);
      const nextIndex = (currentIndex + 1) % allSlugs.length;
      
      setFocusedCategory(allSlugs[nextIndex]);
    }, 4000); // Rotate focus every 4 seconds

    return () => clearInterval(timer);
  }, [categories, focusedCategory]);


  // ── Handlers ─────────────────────────────────────────────────────────────
  const goHome = useCallback(() => {
    setActiveCategory("");
    setCartOpen(false);
    setOrderOpen(false);
    setSuccessOrder(null);
    setDetailItem(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  function handleCategorySelect(slug) {
    if (slug === "") {
      goHome();
    } else {
      setActiveCategory(slug);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
      <Header 
        storeName={STORE_NAME} 
        onCartClick={() => setCartOpen(true)} 
        onHomeClick={goHome}
      />


      <CategoryFilter
        categories={categories}
        active={activeCategory}
        focused={focusedCategory}
        onSelect={handleCategorySelect}
        allImage={allCategoryThumb}
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

      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/${OWNER_PHONE}`}
        className="whatsapp-float" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span>Chat with us</span>
      </a>
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
