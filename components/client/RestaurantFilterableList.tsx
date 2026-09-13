"use client";

import React, { useState, useMemo } from "react";
import { Search, Flame, Award, Clock, Star, Sparkles } from "lucide-react";
import { RestaurantCard } from "./RestaurantCard";
import type { Restaurant } from "@/lib/mock-data";

interface RestaurantFilterableListProps {
  initialRestaurants: Restaurant[];
}

export function RestaurantFilterableList({ initialRestaurants }: RestaurantFilterableListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous les restaurants");

  const categories = [
    { label: "Tous les restaurants", icon: Award },
    { label: "⭐ Les mieux notés", filter: "top_rated" },
    { label: "⚡ Moins de 30 min", filter: "fast" },
    { label: "🥩 T-Bone & Grillades", filter: "grill" },
    { label: "🍲 Bukari & Terroir", filter: "bukari" },
    { label: "🍗 Poulet Bicyclette", filter: "poulet" },
    { label: "🐟 Poissons du Lac Moero", filter: "poisson" },
  ];

  const filteredRestaurants = useMemo(() => {
    let result = [...initialRestaurants];

    // Recherche textuelle
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.nom.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.adresse.toLowerCase().includes(q)
      );
    }

    // Filtres catégories
    if (selectedCategory === "⭐ Les mieux notés") {
      result.sort((a, b) => b.note_moyenne - a.note_moyenne);
    } else if (selectedCategory === "🥩 T-Bone & Grillades") {
      result = result.filter(
        (r) =>
          r.nom.toLowerCase().includes("golf") ||
          r.nom.toLowerCase().includes("grill") ||
          r.description?.toLowerCase().includes("t-bone") ||
          r.description?.toLowerCase().includes("grillade")
      );
    } else if (selectedCategory === "🍲 Bukari & Terroir") {
      result = result.filter(
        (r) =>
          r.nom.toLowerCase().includes("katanga") ||
          r.nom.toLowerCase().includes("saveur") ||
          r.description?.toLowerCase().includes("bukari") ||
          r.description?.toLowerCase().includes("terroir")
      );
    } else if (selectedCategory === "🐟 Poissons du Lac Moero") {
      result = result.filter(
        (r) =>
          r.description?.toLowerCase().includes("poisson") ||
          r.description?.toLowerCase().includes("moero") ||
          r.nom.toLowerCase().includes("chalet")
      );
    } else if (selectedCategory === "🍗 Poulet Bicyclette") {
      result = result.filter(
        (r) =>
          r.description?.toLowerCase().includes("poulet") ||
          r.nom.toLowerCase().includes("golf")
      );
    }

    return result;
  }, [initialRestaurants, searchQuery, selectedCategory]);

  return (
    <div id="restaurants-section" className="space-y-6 scroll-mt-6">
      {/* En-tête et Recherche */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
            Restaurants Disponibles à Lubumbashi
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {filteredRestaurants.length} établissement{filteredRestaurants.length > 1 ? "s" : ""} ouvert{filteredRestaurants.length > 1 ? "s" : ""} et prêt{filteredRestaurants.length > 1 ? "s" : ""} à livrer
          </p>
        </div>

        {/* Champ de recherche */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher T-Bone, Bukari, Golf..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 shadow-2xs transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filtres de catégories rapides */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.label;
          return (
            <button
              key={cat.label}
              type="button"
              onClick={() => setSelectedCategory(cat.label)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              {cat.icon && <cat.icon className={`w-3.5 h-3.5 ${isSelected ? "text-amber-200" : "text-amber-500"}`} />}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grille des restaurants */}
      {filteredRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Aucun restaurant trouvé</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Aucun établissement ne correspond à votre recherche &ldquo;{searchQuery}&rdquo;. Essayez un autre mot clé ou réinitialisez les filtres.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("Tous les restaurants");
            }}
            className="text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl hover:bg-emerald-100 transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
}
