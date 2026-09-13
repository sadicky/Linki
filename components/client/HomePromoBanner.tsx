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
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white p-4 sm:p-5 shadow-md">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
            <Flame className="w-5 h-5 text-amber-200 fill-amber-200" />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider bg-white text-orange-700 px-2 py-0.5 rounded-full">
                Offre Spéciale Lubum
              </span>
              <span className="text-xs text-amber-100">Valable sur votre 1ère commande</span>
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
            className="flex items-center gap-2 bg-slate-950/90 hover:bg-slate-950 text-white px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all active:scale-95 shadow-lg border border-white/20 cursor-pointer"
          >
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <span>Code : <strong>{promoCode}</strong></span>
            {copied ? (
              <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-sans">
                <Check className="w-3.5 h-3.5" />
                Copié !
              </span>
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
