import Link from "next/link";
import { getRestaurantStats } from "@/lib/actions/restaurant.actions";
import { formatPrice } from "@/lib/utils";
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Percent,
  Flame,
  ArrowRight,
  BellRing,
} from "lucide-react";

export default async function RestaurantDashboardPage() {
  const stats = await getRestaurantStats();

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Tableau de Bord</h1>
          <p className="text-xs text-slate-500 mt-1">
            Suivez en direct votre chiffre d&apos;affaires, vos marges et la popularité de vos plats.
          </p>
        </div>

        <Link
          href="/dashboard/restaurant/orders"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95"
        >
          <BellRing className="w-4 h-4" />
          <span>Ouvrir la file des commandes</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CA Jour */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">CA Aujourd&apos;hui</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {formatPrice(stats.revenueToday)}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">+14% vs hier</span>
        </div>

        {/* CA Semaine */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">CA Hebdomadaire</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {formatPrice(stats.revenueWeek)}
          </div>
          <span className="text-[11px] text-slate-500">7 derniers jours</span>
        </div>

        {/* Commandes traitées */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Commandes totales</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-200">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalOrders}</div>
          <span className="text-[11px] text-slate-500">Volume global</span>
        </div>

        {/* Revenu Net / Commission */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Reversé Net</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700">
            {formatPrice(stats.netPayout)}
          </div>
          <span className="text-[11px] text-slate-500">
            Commission Linki : {stats.commissionPct || 15}%
          </span>
        </div>
      </div>

      {/* Top Plats les plus vendus */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">Plats les plus vendus (Best-sellers)</h2>
          </div>
          <Link
            href="/dashboard/restaurant/menu"
            className="text-xs text-amber-600 hover:text-amber-700 font-semibold transition-colors"
          >
            Gérer le menu &rarr;
          </Link>
        </div>

        {stats.topDishes.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">Aucune vente enregistrée pour le moment.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {stats.topDishes.map((dish, idx) => (
              <div
                key={dish.nom}
                className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 font-bold text-slate-700 flex items-center justify-center text-[11px]">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{dish.nom}</h4>
                    <span className="text-slate-500">{dish.count} portions vendues</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-700">
                    {formatPrice(dish.revenue)}
                  </span>
                  <span className="block text-[10px] text-slate-400">Généré</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
