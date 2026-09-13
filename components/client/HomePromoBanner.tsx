"use client";

import React, { useState } from "react";
import { Tag, Check, Copy, Flame } from "lucide-react";

export function HomePromoBanner() {
  const [copied, setCopied] = useState(false);
  const promoCode = "LUBUM20";

  const handleCopy = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white p-4 sm:p-5 shadow-sm border border-emerald-500/20">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
            <Flame className="w-5 h-5 text-amber-300 fill-amber-300" />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider bg-white text-emerald-800 px-2.5 py-0.5 rounded-full shadow-2xs">
                Offre Spéciale Lubum
              </span>
              <span className="text-xs text-emerald-100">Valable sur votre 1ère commande</span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-white mt-0.5">
              -20% de réduction immédiate + Livraison offerte vers le Golf et le Centre-ville !
            </h3>
          </div>
        </div>

        {/* Bouton copier le code */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-2 bg-white hover:bg-emerald-50 text-slate-900 px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all active:scale-95 shadow-md border border-white cursor-pointer"
          >
            <Tag className="w-3.5 h-3.5 text-emerald-600" />
            <span>Code : <strong className="text-emerald-700">{promoCode}</strong></span>
            {copied ? (
              <span className="flex items-center gap-1 text-emerald-700 text-[11px] font-sans font-bold">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Copié !
              </span>
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
