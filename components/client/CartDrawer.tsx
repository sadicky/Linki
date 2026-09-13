"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "./CartContext";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    items,
    restaurantName,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    total,
    totalCount,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer panel */}
      <div className="relative w-full max-w-md bg-white border-l border-slate-200 h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Mon Panier</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
              {totalCount}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Restaurant indicator */}
        {restaurantName && (
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Commande chez : <strong className="text-slate-900">{restaurantName}</strong></span>
            <button
              onClick={clearCart}
              className="text-rose-600 hover:text-rose-700 flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              Vider
            </button>
          </div>
        )}

        {/* Items list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <ShoppingBag className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-900">Votre panier est vide</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Explorez nos délicieux restaurants partenaires pour composer votre festin !
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.dish.id} className="pt-3 first:pt-0 flex gap-3">
                {item.dish.image_url && (
                  <img
                    src={item.dish.image_url}
                    alt={item.dish.nom}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-100 border border-slate-100"
                  />
                )}

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {item.dish.nom}
                    </h4>
                    <span className="text-xs font-bold text-slate-900">
                      {formatPrice(item.dish.prix * item.quantity)}
                    </span>
                  </div>

                  {item.notes && (
                    <p className="text-[11px] text-slate-500 italic line-clamp-1 mt-0.5">
                      Note : {item.notes}
                    </p>
                  )}

                  {/* Quantity controls */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1 border border-slate-200/80">
                      <button
                        onClick={() => updateQuantity(item.dish.id, item.quantity - 1)}
                        className="w-5 h-5 rounded flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-slate-900 px-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.dish.id, item.quantity + 1)}
                        className="w-5 h-5 rounded flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.dish.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                      title="Retirer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with totals and checkout */}
        {items.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/80 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Sous-total</span>
                <span className="text-slate-900 font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Frais de livraison</span>
                <span className="text-slate-900 font-medium">{formatPrice(deliveryFee)}</span>
              </div>
              <div className="h-px bg-slate-200 my-1" />
              <div className="flex justify-between text-sm font-bold text-slate-900">
                <span>Total</span>
                <span className="text-emerald-700 font-black">{formatPrice(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={onClose}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all active:scale-[0.98]"
            >
              <span>Passer la commande</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
