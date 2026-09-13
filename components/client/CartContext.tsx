"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { MenuItem } from "@/lib/mock-data";

export interface CartItem {
  dish: MenuItem;
  quantity: number;
  notes?: string;
}

interface CartContextType {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  addToCart: (dish: MenuItem, restaurantName: string, notes?: string) => void;
  removeFromCart: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
  totalCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = "linki_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const isLoadedRef = React.useRef(false);

  // Charger depuis le localStorage au montage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        queueMicrotask(() => {
          setItems(parsed.items || []);
          setRestaurantId(parsed.restaurantId || null);
          setRestaurantName(parsed.restaurantName || null);
          isLoadedRef.current = true;
        });
      } else {
        isLoadedRef.current = true;
      }
    } catch {
      isLoadedRef.current = true;
    }
  }, []);

  // Sauvegarder dans localStorage
  useEffect(() => {
    if (!isLoadedRef.current) return;
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify({ items, restaurantId, restaurantName })
      );
    } catch {
      // Ignorer
    }
  }, [items, restaurantId, restaurantName]);

  const addToCart = (dish: MenuItem, rName: string, notes?: string) => {
    // Si un panier contient déjà les plats d'un autre restaurant, confirmation de réinitialisation
    if (restaurantId && restaurantId !== dish.restaurant_id) {
      if (!confirm("Votre panier contient des articles d'un autre restaurant. Souhaitez-vous le vider pour commander ici ?")) {
        return;
      }
      setItems([{ dish, quantity: 1, notes }]);
      setRestaurantId(dish.restaurant_id);
      setRestaurantName(rName);
      return;
    }

    setRestaurantId(dish.restaurant_id);
    setRestaurantName(rName);

    setItems((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id
            ? { ...item, quantity: item.quantity + 1, notes: notes || item.notes }
            : item
        );
      }
      return [...prev, { dish, quantity: 1, notes }];
    });
  };

  const removeFromCart = (dishId: string) => {
    setItems((prev) => {
      const filtered = prev.filter((item) => item.dish.id !== dishId);
      if (filtered.length === 0) {
        setRestaurantId(null);
        setRestaurantName(null);
      }
      return filtered;
    });
  };

  const updateQuantity = (dishId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(dishId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.dish.id === dishId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantId(null);
    setRestaurantName(null);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const subtotal = items.reduce(
    (acc, curr) => acc + curr.dish.prix * curr.quantity,
    0
  );
  const deliveryFee = items.length > 0 ? 3500 : 0;
  const total = subtotal + deliveryFee;
  const totalCount = items.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        restaurantId,
        restaurantName,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        deliveryFee,
        total,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
