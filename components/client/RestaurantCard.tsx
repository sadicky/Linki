"use client";

import Link from "next/link";
import { Star, Clock, Bike } from "lucide-react";
import type { Restaurant } from "@/lib/mock-data";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link
      href={`/restaurants/${restaurant.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg shadow-xs flex flex-col"
    >
      {/* Image avec zoom au survol */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        {restaurant.image_url ? (
          <img
            src={restaurant.image_url}
            alt={restaurant.nom}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
            Aucune image
          </div>
        )}

        {/* Badge note moyenne */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-amber-600 flex items-center gap-1 border border-slate-200/80 shadow-xs">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>{restaurant.note_moyenne.toFixed(1)}</span>
        </div>

        {/* Badge statut */}
        <div className="absolute bottom-3 left-3 bg-emerald-600/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[11px] font-bold text-white shadow-xs">
          {restaurant.statut === "ouvert" ? "Ouvert maintenant" : "Fermé"}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
            {restaurant.nom}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {restaurant.description}
          </p>
        </div>

        {/* Métriques bas de carte */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>20 - 30 min</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
            <Bike className="w-3.5 h-3.5" />
            <span>Livraison 3 500 FC</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
