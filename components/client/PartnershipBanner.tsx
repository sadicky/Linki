"use client";

import React from "react";
import Link from "next/link";
import { Store, Bike, ArrowRight, TrendingUp, Wallet } from "lucide-react";

export function PartnershipBanner() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Carte Restaurateurs */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 sm:p-8 border border-slate-700/80 shadow-md flex flex-col justify-between space-y-6 group">
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-3 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Store className="w-6 h-6" />
          </div>
          <span className="inline-block text-[11px] font-black uppercase tracking-wider text-emerald-400">
            Pour les Restaurateurs de Lubumbashi
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
            Multipliez vos ventes avec la livraison à domicile
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Rejoignez le réseau Linki. Touchez de nouveaux clients au Quartier Golf, au Centre-ville et à Kamalondo sans investir dans une flotte de livraison.
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-300 pt-1">
            <div className="flex items-center gap-1 text-emerald-300">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>+40% de chiffre d&apos;affaires</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-300">
              <span>Intégration en 24h</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-2">
          <Link
            href="/register?role=restaurant"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span>Inscrire mon restaurant</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Carte Livreurs */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 text-white p-6 sm:p-8 border border-emerald-800/40 shadow-md flex flex-col justify-between space-y-6 group">
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-3 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Bike className="w-6 h-6" />
          </div>
          <span className="inline-block text-[11px] font-black uppercase tracking-wider text-amber-400">
            Pour les Motards & Coursiers
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
            Roulez avec Linki et gagnez selon votre rythme
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Devenez coursier indépendant à Lubumbashi. Vous disposez d&apos;une moto ? Bénéficiez d&apos;une rémunération attractive et de pourboires 100% conservés.
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-300 pt-1">
            <div className="flex items-center gap-1 text-amber-300">
              <Wallet className="w-4 h-4 text-amber-400" />
              <span>Paiements Mobile Money directs</span>
            </div>
            <div className="flex items-center gap-1 text-amber-300">
              <span>Horaires flexibles</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-2">
          <Link
            href="/register?role=livreur"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span>Devenir livreur Linki</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
