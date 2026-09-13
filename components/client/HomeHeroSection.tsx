"use client";

import React, { useState } from "react";
import { Sparkles, Clock, ShieldCheck, Zap, MapPin, ArrowRight, Star, Flame, ChevronDown } from "lucide-react";

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
    <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50/70 via-white to-slate-50 border border-slate-200/90 shadow-xs p-6 sm:p-10 lg:p-12">
      {/* Halos doux en arrière-plan */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Colonne Gauche : Titre, Localisation & CTA */}
        <div className="lg:col-span-7 space-y-6">
          {/* Badge en-tête UberEats style */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Livraison gourmande n°1 à Lubumbashi • Haut-Katanga</span>
          </div>

          {/* Titre Principal */}
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.12] text-slate-900">
            Savourez l&apos;authenticité des meilleures tables de{" "}
            <span className="text-emerald-600">
              Lubumbashi.
            </span>
          </h1>

          {/* Paragraphe descriptif */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
            Du tendre <strong>T-Bone katangais</strong> grillé au feu de bois au savoureux <strong>Bukari ya semoule</strong> et <strong>Poisson frais du Lac Moero</strong>, commandez vos repas préférés livrés en direct par nos motards en Francs Congolais (CDF).
          </p>

          {/* Sélecteur de livraison express par Commune (Card Blanche Lumineuse) */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-md max-w-xl space-y-2">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1 flex items-center">
                <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 pointer-events-none" />
                <select
                  value={selectedCommune}
                  onChange={(e) => setSelectedCommune(e.target.value)}
                  className="w-full bg-slate-50 text-xs font-semibold text-slate-900 rounded-xl pl-10 pr-9 py-3 border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all appearance-none cursor-pointer"
                >
                  {LUBUMBASHI_COMMUNES.map((commune) => (
                    <option key={commune.name} value={commune.name} className="bg-white text-slate-900">
                      📍 {commune.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
              </div>

              <a
                href="#restaurants-section"
                className="inline-flex items-center justify-center gap-2 bg-slate-950 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <span>Trouver un resto</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Estimation temps et tarif de la commune sélectionnée */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 px-1">
              <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                Délai estimé : <strong className="text-slate-900">{currentCommuneInfo.time}</strong>
              </span>
              <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Frais de livraison : <strong className="text-emerald-700 font-bold">{currentCommuneInfo.fee}</strong>
              </span>
            </div>
          </div>

          {/* Badges de confiance (Cards Blanches Claires) */}
          <div className="pt-1 flex flex-wrap gap-2.5 text-xs text-slate-700 font-medium">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Moins de 30 min chrono</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Mobile Money RDC</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Code PIN sécurisé à 4 chiffres</span>
            </div>
          </div>

          {/* Statistiques clés */}
          <div className="pt-4 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-left">
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">+15 000</div>
              <div className="text-[11px] text-slate-500 font-medium">Repas livrés à Lubum</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>4.95 / 5</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">Note de nos gourmets</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-600">100% CDF</div>
              <div className="text-[11px] text-slate-500 font-medium">Francs Congolais directs</div>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Superbe Photographie HD avec Badges Clairs */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            {/* Cadre de l'image blanc lumineux UberEats */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-white shadow-xl bg-white p-2 group">
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="/images/hero-congolese-feast.jpg"
                  alt="Festin authentique de Lubumbashi : T-Bone Katangais braisé, Poulet Bicyclette doré, Alloco et Bukari fumant"
                  className="w-full h-auto object-cover group-hover:scale-104 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                {/* Titre superposé en bas de l'image */}
                <div className="absolute bottom-3 left-4 right-4 text-white pointer-events-none">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider mb-1">
                    <Flame className="w-3 h-3 fill-slate-950" />
                    Spécialité Lubumbashi
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-white drop-shadow-md">
                    Le Grand Festin Katangais Braisé
                  </h3>
                  <p className="text-[11px] text-slate-200 drop-shadow-sm">
                    T-Bone savoureux, Poulet fermier & Alloco croustillant
                  </p>
                </div>
              </div>
            </div>

            {/* Badge Flottant 1 : Note et Avis Lushois (Carte Blanche) */}
            <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 bg-white text-slate-900 px-3.5 py-2 rounded-2xl border border-slate-200/90 shadow-lg flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 font-bold shrink-0">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 flex items-center gap-1">
                  <span>4.95 / 5</span>
                  <span className="text-[10px] text-slate-400 font-normal">(1 240+ avis)</span>
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold">
                  &ldquo;Le meilleur T-Bone de Lubum !&rdquo;
                </div>
              </div>
            </div>

            {/* Badge Flottant 2 : Suivi en direct du motard (Carte Blanche) */}
            <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 bg-white text-slate-900 px-4 py-2.5 rounded-2xl border border-emerald-200 shadow-lg flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Motard en route</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-semibold">
                    En direct
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">
                  Arrivée prévue dans <strong className="text-slate-900">18 min</strong> (Golf)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
