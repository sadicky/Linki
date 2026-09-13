"use client";

import React from "react";
import { MapPin, Clock, Bike, CheckCircle2 } from "lucide-react";
import { LUBUMBASHI_COMMUNES } from "./HomeHeroSection";

export function CommunesCoverageSection() {
  return (
    <section className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-xs space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            Couverture Territoriale
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">
            Où livrons-nous à Lubumbashi ?
          </h2>
          <p className="text-xs text-slate-500">
            Nos motards couvrent les 7 communes et principaux quartiers résidentiels du Katanga.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50/80 px-3 py-1.5 rounded-xl border border-emerald-100 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Flotte de motards active en temps réel</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {LUBUMBASHI_COMMUNES.map((commune) => (
          <div
            key={commune.name}
            className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all duration-200 space-y-2.5 group shadow-2xs hover:shadow-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-emerald-700 shrink-0 shadow-2xs group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                Desservi
              </span>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                {commune.name}
              </h3>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{commune.time}</span>
              </div>
              <div className="flex items-center gap-1 font-semibold text-slate-700">
                <Bike className="w-3 h-3 text-emerald-600" />
                <span>{commune.fee}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Carte info livraison personnalisée (Clean White Card) */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-slate-900 flex flex-col justify-between space-y-3 shadow-2xs">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
              Autre secteur ?
            </span>
            <h3 className="text-xs font-bold text-slate-900 leading-snug">
              Entreprises, mines & sites périphériques
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Nous livrons aussi vos plateaux déjeuners et cocktails sur commande groupée.
            </p>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-white border border-emerald-200 px-2.5 py-1 rounded-lg w-fit shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Service Entreprise Linki</span>
          </div>
        </div>
      </div>
    </section>
  );
}
