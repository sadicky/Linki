"use client";

import React from "react";
import { UtensilsCrossed, Smartphone, KeyRound, ShieldCheck } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Choisissez votre festin",
      desc: "Explorez les menus des restaurants les plus réputés de Lubumbashi (Golf, Kamalondo, Centre-ville). Sélectionnez vos grillades, Bukari ou poissons frais en quelques clics.",
      icon: UtensilsCrossed,
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    {
      step: "02",
      title: "Payez par Mobile Money RDC",
      desc: "Réglez directement en Francs Congolais (CDF) via M-Pesa, Airtel Money, Orange Money ou Afrimoney. Validation USSD instantanée et sécurisée sur votre téléphone.",
      icon: Smartphone,
      color: "bg-amber-100 text-amber-700 border-amber-200",
    },
    {
      step: "03",
      title: "Suivez & Déverrouillez par PIN",
      desc: "Suivez le trajet de votre motard en direct sur la carte interactive. À la livraison, fournissez votre code secret à 4 chiffres pour récupérer votre repas fumant.",
      icon: KeyRound,
      color: "bg-teal-100 text-teal-700 border-teal-200",
    },
  ];

  return (
    <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-xs space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-100">
          Simplicité & Sécurité
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          Comment fonctionne la livraison Linki à Lubumbashi ?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Une expérience pensée pour les Lushois, rapide, claire et sans friction.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="relative bg-slate-50/80 hover:bg-white rounded-2xl p-6 border border-slate-100 hover:border-emerald-300 hover:shadow-md transition-all duration-300 space-y-4 group shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-2xs ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-3xl font-black text-slate-300 group-hover:text-emerald-600 transition-colors">
                  {item.step}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bannière de réassurance PIN (Light & Clean) */}
      <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              Garantie Zéro Erreur grâce au Code PIN à 4 Chiffres
            </h4>
            <p className="text-[11px] text-slate-600">
              Votre commande ne peut être remise qu&apos;en échange du code secret généré dans votre espace de suivi en direct.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-emerald-200 shrink-0 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium">Exemple :</span>
          <span className="text-xs font-mono font-black text-emerald-700 tracking-widest bg-emerald-100/70 px-2.5 py-0.5 rounded border border-emerald-300">
            • • • •
          </span>
        </div>
      </div>
    </section>
  );
}
