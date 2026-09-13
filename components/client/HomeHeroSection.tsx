"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Clock, ShieldCheck, Zap, MapPin, ArrowRight, Star, Flame } from "lucide-react";

export const LUBUMBASHI_COMMUNES = [
  { name: "Quartier Golf (Météo, Plateau, Carrefour)", time: "15 - 25 min", fee: "3 500 FC" },
  { name: "Commune de Lubumbashi (Centre-ville)", time: "15 - 20 min", fee: "3 000 FC" },
  { name: "Commune de Kamalondo", time: "20 - 25 min", fee: "3 500 FC" },
  { name: "Quartier Bel-Air & Gambela", time: "25 - 35 min", fee: "4 000 FC" },
  { name: "Commune de la Kenya", time: "25 - 30 min", fee: "4 000 FC" },
  { name: "Commune de la Ruashi", time: "30 - 40 min", fee: "5 000 FC" },
  { name: "Commune de Kampemba", time: "25 - 35 min", fee: "4 500 FC" },
];

export function HomeHeroSection() {
  const [selectedCommune, setSelectedCommune] = useState(LUBUMBASHI_COMMUNES[0].name);
  const currentCommuneInfo = LUBUMBASHI_COMMUNES.find((c) => c.name === selectedCommune) || LUBUMBASHI_COMMUNES[0];

  return (
    <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white border border-slate-800 shadow-xl">
      {/* Halos lumineux en arrière-plan */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-10 lg:p-12 items-center">
        {/* Colonne Gauche : Titre, Localisation & CTA */}
        <div className="lg:col-span-7 space-y-6">
          {/* Badge en-tête */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Livraison gourmande à Lubumbashi • Haut-Katanga</span>
          </div>

          {/* Titre Principal */}
          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-[1.15] text-white">
            Savourez l&apos;authenticité des meilleures tables de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
              Lubumbashi.
            </span>
          </h1>

          {/* Paragraphe descriptif */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Du tendre <strong>T-Bone katangais</strong> grillé à la braise au savoureux <strong>Bukari ya semoule</strong> et <strong>Poisson frais du Lac Moero</strong>, commandez vos spécialités préférées livrées fumantes par nos motards en Francs Congolais (CDF).
          </p>

          {/* Sélecteur de livraison express par Commune */}
          <div className="bg-white/10 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl border border-white/15 shadow-lg max-w-xl">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 flex items-center">
                <MapPin className="w-4 h-4 text-emerald-400 absolute left-3 pointer-events-none" />
                <select
                  value={selectedCommune}
                  onChange={(e) => setSelectedCommune(e.target.value)}
                  className="w-full bg-slate-900/80 text-xs text-white rounded-xl pl-9 pr-8 py-3 border border-slate-700/80 focus:outline-none focus:border-emerald-400 transition-all appearance-none cursor-pointer"
                >
                  {LUBUMBASHI_COMMUNES.map((commune) => (
                    <option key={commune.name} value={commune.name} className="bg-slate-900 text-white">
                      📍 {commune.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 pointer-events-none text-[10px] text-slate-400">
                  ▼
                </div>
              </div>

              <a
                href="#restaurants-section"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-emerald-500/25 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <span>Trouver un resto</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Estimation temps et tarif de la commune sélectionnée */}
            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300 px-1">
              <span className="flex items-center gap-1 text-emerald-300 font-medium">
                <Clock className="w-3 h-3 text-emerald-400" />
                Délai estimé : <strong>{currentCommuneInfo.time}</strong>
              </span>
              <span className="flex items-center gap-1 text-amber-300 font-medium">
                <Zap className="w-3 h-3 text-amber-400" />
                Frais : <strong>{currentCommuneInfo.fee}</strong>
              </span>
            </div>
          </div>

          {/* Badges de confiance */}
          <div className="pt-2 flex flex-wrap gap-3 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-1.5 bg-slate-800/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-700">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Moins de 30 min chrono</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Mobile Money RDC</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-700">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Code PIN sécurisé à 4 chiffres</span>
            </div>
          </div>

          {/* Statistiques clés */}
          <div className="pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center sm:text-left">
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">+15 000</div>
              <div className="text-[11px] text-slate-400">Repas livrés à Lubum</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-amber-400 flex items-center justify-center sm:justify-start gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>4.95 / 5</span>
              </div>
              <div className="text-[11px] text-slate-400">Note de nos gourmets</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400">100% CDF</div>
              <div className="text-[11px] text-slate-400">Francs Congolais directs</div>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Superbe Image HD avec Badges Flottants */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            {/* Cadre de l'image avec glow doux */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/30 shadow-2xl bg-slate-800 group">
              <img
                src="/images/hero-congolese-feast.jpg"
                alt="Festin authentique de Lubumbashi : T-Bone Katangais braisé, Poulet Bicyclette doré, Alloco et Bukari fumant"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Titre superposé en bas de l'image */}
              <div className="absolute bottom-3 left-4 right-4 text-white pointer-events-none">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 text-[10px] font-black uppercase tracking-wider mb-1">
                  <Flame className="w-3 h-3 fill-slate-950" />
                  Spécialité Katanga
                </div>
                <h3 className="text-sm sm:text-base font-black text-white drop-shadow-md">
                  Le Grand Festin Katangais Braisé
                </h3>
                <p className="text-[11px] text-slate-200 drop-shadow-sm">
                  T-Bone savoureux, Poulet fermier & Alloco croustillant
                </p>
              </div>
            </div>

            {/* Badge Flottant 1 : Note et Avis Lushois */}
            <div className="absolute -top-4 -left-4 sm:-top-5 sm:-left-5 bg-white/95 backdrop-blur-md text-slate-900 px-3.5 py-2 rounded-2xl border border-slate-200/80 shadow-xl flex items-center gap-2.5 animate-bounce-subtle">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 flex items-center gap-1">
                  <span>4.95 / 5</span>
                  <span className="text-[10px] text-slate-500 font-normal">(1 240+ avis)</span>
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold">
                  &ldquo;Le meilleur T-Bone de Lubum !&rdquo;
                </div>
              </div>
            </div>

            {/* Badge Flottant 2 : Suivi en direct du motard */}
            <div className="absolute -bottom-4 -right-3 sm:-bottom-5 sm:-right-4 bg-slate-900/95 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl border border-emerald-500/40 shadow-xl flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Motard en route</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/30 text-emerald-300 rounded font-semibold">
                    En direct
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Arrivée prévue dans <strong>18 min</strong> (Golf)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
