import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});

  // Load cart from localStorage or backend on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        axios
          .get("http://localhost:8082/order/cart", {
            headers: { Authorization: "Bearer " + token },
          })
          .then((res) => {
            setCartItems(res.data || {});
            localStorage.setItem("cartItems", JSON.stringify(res.data || {}));
          })
          .catch((err) => console.error("Error loading saved cart", err));
      }
    }
  }, []);

  // Sync cart to localStorage and backend on changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    const token = localStorage.getItem("token");
    if (token) {
      const cartArray = Object.values(cartItems).map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
      }));

      axios
        .post("http://localhost:8082/order/cart", cartArray, {
          headers: { Authorization: "Bearer " + token },
        })
        .catch((err) => console.error("Failed to sync cart with backend", err));
    }
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev[product.id];
      return {
        ...prev,
        [product.id]: {
          product,
          quantity: existing ? existing.quantity + 1 : 1,
        },
      };
    });
  };

  const decreaseFromCart = (productId) => {
    setCartItems((prev) => {
      const existing = prev[productId];
      if (!existing) return prev;

      if (existing.quantity <= 1) {
        const newItems = { ...prev };
        delete newItems[productId];
        return newItems;
      }

      return {
        ...prev,
        [productId]: {
          ...existing,
          quantity: existing.quantity - 1,
        },
      };
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems({});
    localStorage.removeItem("cartItems");
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .post(
          "http://localhost:8082/order/cart",
          [],
          { headers: { Authorization: "Bearer " + token } }
        )
        .catch((err) => console.error("Failed to clear backend cart", err));
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        decreaseFromCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
