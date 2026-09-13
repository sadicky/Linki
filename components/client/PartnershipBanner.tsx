"use client";

import React from "react";
import Link from "next/link";
import { Store, Bike, ArrowRight, TrendingUp, Wallet } from "lucide-react";

export function PartnershipBanner() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Carte Restaurateurs (Clean White Card) */}
      <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-100 hover:border-emerald-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-6 shadow-xs group">
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shadow-2xs">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <span className="inline-block text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              Pour les Restaurateurs de Lubumbashi
            </span>
            <h3 className="text-xl font-black text-slate-900 leading-snug mt-2 group-hover:text-emerald-700 transition-colors">
              Multipliez vos ventes avec la livraison à domicile
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Rejoignez le réseau Linki. Touchez des milliers de clients gourmets au Quartier Golf, au Centre-ville et à Kamalondo sans investir dans une flotte de motos.
          </p>

          <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-700 pt-1">
            <div className="flex items-center gap-1.5 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
              <span>+40% de chiffre d&apos;affaires estimé</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span>Intégration en moins de 24h</span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href="/register?role=restaurant"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span>Inscrire mon restaurant</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Carte Livreurs (Clean White Card) */}
      <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-100 hover:border-amber-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-6 shadow-xs group">
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 shadow-2xs">
            <Bike className="w-6 h-6" />
          </div>
          <div>
            <span className="inline-block text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
              Pour les Motards & Coursiers
            </span>
            <h3 className="text-xl font-black text-slate-900 leading-snug mt-2 group-hover:text-amber-700 transition-colors">
              Roulez avec Linki et gagnez selon votre rythme
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Devenez coursier indépendant à Lubumbashi. Vous disposez d&apos;une moto ? Bénéficiez d&apos;une rémunération attractive par course et de pourboires 100% conservés.
          </p>

          <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-700 pt-1">
            <div className="flex items-center gap-1.5 text-amber-700">
              <Wallet className="w-4 h-4" />
              <span>Paiements Mobile Money chaque semaine</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span>Horaires 100% flexibles</span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href="/register?role=livreur"
            className="inline-flex items-center gap-2 bg-slate-950 hover:bg-emerald-600 text-white px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span>Devenir livreur Linki</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
