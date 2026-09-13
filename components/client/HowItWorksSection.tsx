"use client";

import React from "react";
import { UtensilsCrossed, Smartphone, MapPin, KeyRound, ShieldCheck } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Choisissez votre festin",
      desc: "Parcourez les menus des meilleurs restaurants de Lubumbashi (Golf, Kamalondo, Centre-ville). Sélectionnez vos grillades, Bukari ou poissons frais.",
      icon: UtensilsCrossed,
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    {
      step: "02",
      title: "Payez par Mobile Money RDC",
      desc: "Réglez directement en Francs Congolais (CDF) via M-Pesa, Airtel Money, Orange Money ou Afrimoney. Validation USSD instantanée sur votre téléphone.",
      icon: Smartphone,
      color: "bg-amber-100 text-amber-700 border-amber-200",
    },
    {
      step: "03",
      title: "Suivez & Déverrouillez par PIN",
      desc: "Visualisez la position de votre motard en direct sur la carte. À son arrivée, transmettez votre code PIN secret à 4 chiffres pour récupérer votre repas chaud.",
      icon: KeyRound,
      color: "bg-teal-100 text-teal-700 border-teal-200",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          Simplicité & Sécurité
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Comment fonctionne la livraison Linki à Lubumbashi ?
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Trois étapes simples pour recevoir vos plats préférés sans bouger de chez vous.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="relative bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700/80 hover:border-emerald-500/50 transition-all duration-300 space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-3xl font-black text-slate-700 group-hover:text-emerald-400/50 transition-colors">
                  {item.step}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bannière de réassurance PIN */}
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">
              Garantie Zéro Erreur grâce au Code PIN à 4 Chiffres
            </h4>
            <p className="text-[11px] text-slate-400">
              Votre commande ne peut être remise qu&apos;en échange de votre code secret généré dans votre espace de suivi.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700 shrink-0">
          <span className="text-[11px] text-slate-400 font-mono">Exemple :</span>
          <span className="text-xs font-mono font-black text-emerald-400 tracking-widest bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
            • • • •
          </span>
        </div>
      </div>
    </section>
  );
}
