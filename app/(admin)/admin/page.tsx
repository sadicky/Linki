import Link from "next/link";
import { getGlobalPlatformStats } from "@/lib/actions/admin.actions";
import { formatPrice } from "@/lib/utils";
import {
  TrendingUp,
  DollarSign,
  Store,
  Bike,
  UserCheck,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

export default async function AdminOverviewPage() {
  const stats = await getGlobalPlatformStats();

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Supervision Globale Linki</h1>
          <p className="text-xs text-slate-500 mt-1">
            Métriques consolidées, volume d&apos;affaires (GMV), commissions perçues et réseau partenaires à Lubumbashi.
          </p>
        </div>

        {stats.pendingValidations > 0 && (
          <Link
            href="/admin/validations"
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
          >
            <UserCheck className="w-4 h-4" />
            <span>{stats.pendingValidations} dossier(s) en attente</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GMV Total */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Volume d&apos;affaires (GMV)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {formatPrice(stats.totalGMV)}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">Flux brut traité</span>
        </div>

        {/* Commissions Linki */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Revenus Commissions Linki</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-700">
            {formatPrice(stats.totalCommissions)}
          </div>
          <span className="text-[11px] text-slate-500">Marge nette prélevée</span>
        </div>

        {/* Restaurants Partenaires */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Restaurants Actifs</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.activeRestaurants}</div>
          <span className="text-[11px] text-slate-500">Ouverts actuellement</span>
        </div>

        {/* Livreurs Actifs */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Livreurs Partenaires</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
              <Bike className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.activeCouriers}</div>
          <span className="text-[11px] text-slate-500">Comptes validés actifs</span>
        </div>
      </div>

      {/* Raccourcis d'administration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          href="/admin/validations"
          className="bg-white border border-slate-100 hover:border-amber-400 hover:shadow-md rounded-2xl p-6 space-y-3 transition-all group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <UserCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
            File de Validation Partenaires
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Examinez et validez manuellement les nouveaux restaurateurs et coursiers avant de leur donner accès à la plateforme.
          </p>
        </Link>

        <Link
          href="/admin/restaurants"
          className="bg-white border border-slate-100 hover:border-purple-400 hover:shadow-md rounded-2xl p-6 space-y-3 transition-all group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
            <Store className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
            Gestion des Taux de Commission
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Ajustez sur mesure les pourcentages de commission prélevés sur chaque restaurant partenaire.
          </p>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-white border border-slate-100 hover:border-sky-400 hover:shadow-md rounded-2xl p-6 space-y-3 transition-all group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
            Litiges & Commandes Globales
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Supervisez en direct l&apos;ensemble des commandes Linki, gérez les annulations et résolvez les litiges.
          </p>
        </Link>
      </div>
    </div>
  );
}
