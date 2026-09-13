"use client";

import React, { useState, useTransition } from "react";
import { updateRestaurantCommission } from "@/lib/actions/admin.actions";
import { formatPrice } from "@/lib/utils";
import { Percent, Save, CheckCircle2, Loader2, Store } from "lucide-react";
import type { Restaurant } from "@/lib/mock-data";

interface CommissionManagerProps {
  restaurants: Restaurant[];
}

export function CommissionManager({ restaurants }: CommissionManagerProps) {
  const [rates, setRates] = useState<Record<string, number>>(
    restaurants.reduce((acc, r) => ({ ...acc, [r.id]: r.commission_pct || 15.0 }), {})
  );
  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();

  const handleRateChange = (restaurantId: string, val: number) => {
    setRates((prev) => ({ ...prev, [restaurantId]: val }));
  };

  const handleSave = (restaurantId: string) => {
    const rate = rates[restaurantId];
    if (rate === undefined) return;

    startTransition(async () => {
      const res = await updateRestaurantCommission(restaurantId, rate);
      if (res.success) {
        setSavedStatus((prev) => ({ ...prev, [restaurantId]: true }));
        setTimeout(() => {
          setSavedStatus((prev) => ({ ...prev, [restaurantId]: false }));
        }, 2000);
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
          <Percent className="w-7 h-7 text-emerald-600" />
          Gestion des Taux de Commission
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Fixez le pourcentage prélevé sur chaque commande pour chaque restaurant partenaire individuellement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {restaurants.map((resto) => {
          const currentRate = rates[resto.id] ?? resto.commission_pct ?? 15.0;
          const isSaved = !!savedStatus[resto.id];

          return (
            <div
              key={resto.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-2xs hover:border-slate-300 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                    <Store className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{resto.nom}</h3>
                    <p className="text-[11px] text-slate-500 truncate">{resto.adresse}</p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                  <label className="block text-slate-700 font-semibold">
                    Taux de commission plateforme (%)
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="50"
                      value={currentRate}
                      onChange={(e) =>
                        handleRateChange(resto.id, parseFloat(e.target.value) || 0)
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    />
                    <span className="absolute right-3 text-slate-400 font-bold">%</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    Ex: Pour 50 000 FC de commande, Linki prélève{" "}
                    {formatPrice((50000 * currentRate) / 100)}.
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleSave(resto.id)}
                disabled={isPending}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer ${
                  isSaved
                    ? "bg-emerald-600 text-white"
                    : "bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                }`}
              >
                {isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : isSaved ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Taux enregistré !</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Mettre à jour la commission</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
