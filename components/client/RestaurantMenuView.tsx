"use client";

import React, { useState } from "react";
import { useCart } from "./CartContext";
import { Plus, Star, MapPin, Clock, Bike, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Restaurant, Category, MenuItem } from "@/lib/mock-data";

interface RestaurantMenuViewProps {
  restaurant: Restaurant;
  categories: Category[];
  menuItems: MenuItem[];
}

export function RestaurantMenuView({
  restaurant,
  categories,
  menuItems,
}: RestaurantMenuViewProps) {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category_id === activeCategory);

  const handleAdd = (dish: MenuItem) => {
    addToCart(dish, restaurant.nom);
    setAddedItemIds((prev) => ({ ...prev, [dish.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [dish.id]: false }));
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Restaurant Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm">
        <div className="h-64 sm:h-80 w-full relative bg-slate-100">
          {restaurant.image_url && (
            <img
              src={restaurant.image_url}
              alt={restaurant.nom}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent" />
        </div>

        <div className="relative p-6 sm:p-8 -mt-28 z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs">
              {restaurant.statut === "ouvert" ? "Ouvert" : "Fermé"}
            </span>

            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-amber-600 border border-slate-200 shadow-xs">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{restaurant.note_moyenne.toFixed(2)} / 5</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-700 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full border border-slate-200 shadow-xs font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>20 - 30 min</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-semibold">
              <Bike className="w-3.5 h-3.5 text-emerald-600" />
              <span>Livraison 4 500 FC</span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900">{restaurant.nom}</h1>
            <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
              {restaurant.description}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{restaurant.adresse}</span>
          </div>
        </div>
      </div>

      {/* Barre de navigation des catégories */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md py-3 border-y border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-none shadow-2xs">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeCategory === "all"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200/80"
          }`}
        >
          Tous les plats ({menuItems.length})
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat.id
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200/80"
            }`}
          >
            {cat.nom}
          </button>
        ))}
      </div>

      {/* Grille des plats du menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((dish) => {
          const isAdded = !!addedItemIds[dish.id];

          return (
            <div
              key={dish.id}
              className="bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md rounded-2xl p-4 flex gap-4 transition-all duration-200 group shadow-2xs"
            >
              {/* Informations du plat */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {dish.nom}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-900">
                    {formatPrice(dish.prix)}
                  </span>

                  <button
                    onClick={() => handleAdd(dish)}
                    disabled={!dish.disponible}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                      !dish.disponible
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : isAdded
                        ? "bg-emerald-600 text-white scale-105"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Ajouté !</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Ajouter</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Photo du plat */}
              {dish.image_url && (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative border border-slate-100">
                  <img
                    src={dish.image_url}
                    alt={dish.nom}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {!dish.disponible && (
                    <div className="absolute inset-0 bg-white/90 flex items-center justify-center text-[10px] font-bold text-rose-600 text-center p-1">
                      Épuisé
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
