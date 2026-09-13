import React from "react";
import Link from "next/link";
import { getCurrentUser, signOut } from "@/lib/actions/auth.actions";
import { getCurrentRestaurant } from "@/lib/actions/restaurant.actions";
import { Utensils, LayoutDashboard, UtensilsCrossed, BellRing, LogOut } from "lucide-react";

export default async function RestaurantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const resto = await getCurrentRestaurant();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Header Restaurant */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-md shadow-amber-500/20">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-slate-900">
                  {resto?.nom || "Mon Restaurant"}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Ouvert
                </span>
              </div>
              <span className="text-xs text-slate-500">Espace Restaurateur Linki</span>
            </div>
          </div>

          {/* Onglets de navigation */}
          <div className="flex items-center gap-2">
            <nav className="flex items-center gap-1">
              <Link
                href="/dashboard/restaurant"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-500" />
                <span className="hidden sm:inline">Statistiques</span>
              </Link>

              <Link
                href="/dashboard/restaurant/orders"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
              >
                <BellRing className="w-4 h-4 text-emerald-600" />
                <span>Commandes Live</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </Link>

              <Link
                href="/dashboard/restaurant/menu"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <UtensilsCrossed className="w-4 h-4 text-amber-500" />
                <span className="hidden sm:inline">Gestion Menu</span>
              </Link>
            </nav>

            {/* Déconnexion & Profil */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-100">
              <Link
                href="/profile"
                className="text-xs font-semibold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 transition-colors"
              >
                Mon Profil
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  title="Se déconnecter"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
