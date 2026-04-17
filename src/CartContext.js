// src/CartContext.js
import React, { createContext, useContext, useReducer } from "react";

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const existing = state.find(i => i.productId === action.item.productId);
      if (existing) {
        return state.map(i =>
          i.productId === action.item.productId
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      }
      return [...state, { ...action.item, qty: 1 }];
    }
    case "REMOVE":
      return state.filter(i => i.productId !== action.productId);
    case "CHANGE_QTY":
      return state
        .map(i =>
          i.productId === action.productId ? { ...i, qty: action.qty } : i
        )
        .filter(i => i.qty > 0);
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  const addItem   = (item)              => dispatch({ type: "ADD",        item });
  const removeItem= (productId)         => dispatch({ type: "REMOVE",     productId });
  const changeQty = (productId, qty)    => dispatch({ type: "CHANGE_QTY", productId, qty });
  const clearCart = ()                  => dispatch({ type: "CLEAR" });

  const total     = items.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, changeQty, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
