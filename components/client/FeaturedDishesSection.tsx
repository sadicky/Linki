"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Check, Flame, Sparkles } from "lucide-react";
import { useCart } from "./CartContext";
import type { FeaturedDish } from "@/lib/actions/client.actions";

interface FeaturedDishesSectionProps {
  dishes: FeaturedDish[];
}

export function FeaturedDishesSection({ dishes }: FeaturedDishesSectionProps) {
  const { addToCart } = useCart();
  const [addedDishId, setAddedDishId] = useState<string | null>(null);

  const handleQuickAdd = (dish: FeaturedDish) => {
    // Adapter au format MenuItem attendu par CartContext
    const menuItem = {
      id: dish.id,
      restaurant_id: dish.restaurant_id,
      category_id: dish.category_id || null,
      nom: dish.nom,
      description: dish.description,
      prix: dish.prix,
      image_url: dish.image_url,
      disponible: dish.disponible,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    addToCart(menuItem, dish.restaurant_nom);
    setAddedDishId(dish.id);
    setTimeout(() => {
      setAddedDishId(null);
    }, 1800);
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full mb-1">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Spécialités Lushoises Phares</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Les Plats les Plus Commandés à Lubumbashi
          </h2>
          <p className="text-xs text-slate-500">
            Ajoutez directement vos délices préférés au panier en un seul clic
          </p>
        </div>

        <Link
          href="#restaurants-section"
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1"
        >
          <span>Voir tous les restaurants</span>
          <span>→</span>
        </Link>
      </div>

      {/* Grille des plats phares */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {dishes.map((dish) => {
          const isAdded = addedDishId === dish.id;

          return (
            <div
              key={dish.id}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image avec zoom */}
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                {dish.image_url ? (
                  <img
                    src={dish.image_url}
                    alt={dish.nom}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                    Plat congolais
                  </div>
                )}

                {/* Tag Spécialité (Light & Clean) */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-emerald-200/90 shadow-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>{dish.tag || "Spécialité Lushoise"}</span>
                </div>

                {/* Badge Restaurant */}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-xs border border-slate-200/60 max-w-[85%] truncate">
                  📍 {dish.restaurant_nom}
                </div>
              </div>

              {/* Détails du plat */}
              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {dish.nom}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>
                </div>

                {/* Prix et Bouton d'ajout rapide */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-base font-black text-slate-900">
                      {dish.prix.toLocaleString("fr-FR")}{" "}
                      <span className="text-xs font-bold text-emerald-600">CDF</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Prix direct restaurant</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleQuickAdd(dish)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-xs cursor-pointer ${
                      isAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Ajouté !</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Ajouter</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
