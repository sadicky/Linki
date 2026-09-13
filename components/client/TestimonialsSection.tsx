"use client";

import React from "react";
import { Star, Quote, CheckCircle } from "lucide-react";

export function TestimonialsSection() {
  const reviews = [
    {
      name: "Grace Mavinga",
      location: "Quartier Golf, Lubumbashi",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      rating: 5,
      comment:
        "Le T-Bone katangais est arrivé fumant comme si j'étais directement assise au restaurant du Golf. Le motard m'a demandé mon code PIN, c'est ultra sécurisé et rassurant !",
      dish: "T-Bone Katangais (500g)",
      date: "Hier soir",
    },
    {
      name: "Patrick Kalala",
      location: "Centre-ville, Lubumbashi",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      rating: 5,
      comment:
        "Payer directement avec mon compte M-Pesa en Francs Congolais sans tracasserie de monnaie, c'est ce qui manquait à Lubumbashi. Livraison en 22 minutes chrono.",
      dish: "Poulet Bicyclette Mariné",
      date: "Il y a 2 jours",
    },
    {
      name: "Chantal Ilunga",
      location: "Commune de Kamalondo",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      rating: 5,
      comment:
        "Le poisson du Lac Moero était parfaitement braisé avec un Bukari bien chaud. L'application est fluide, le suivi en direct sur la carte est très précis.",
      dish: "Poisson du Lac Moero Braisé",
      date: "Il y a 3 jours",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
          Témoignages Gourmands
        </span>
        <h2 className="text-2xl font-black text-slate-900">
          Ce que disent les Lushois de Linki
        </h2>
        <p className="text-xs text-slate-500">
          Des milliers de repas livrés chaque semaine aux quatre coins de Lubumbashi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <div
            key={r.name}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs flex flex-col justify-between space-y-4 hover:border-emerald-300 hover:shadow-xs transition-all"
          >
            <div className="space-y-3">
              {/* Étoiles et quote */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote className="w-5 h-5 text-slate-300" />
              </div>

              {/* Commentaire */}
              <p className="text-xs text-slate-600 leading-relaxed italic">
                &ldquo;{r.comment}&rdquo;
              </p>

              {/* Plat mentionné */}
              <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md w-fit">
                🍽️ A commandé : {r.dish}
              </div>
            </div>

            {/* Auteur */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-100"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <span>{r.name}</span>
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                  </div>
                  <div className="text-[10px] text-slate-400">{r.location}</div>
                </div>
              </div>

              <span className="text-[10px] text-slate-400">{r.date}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
