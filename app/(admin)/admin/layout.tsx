import React from "react";
import Link from "next/link";
import { getCurrentUser, signOut } from "@/lib/actions/auth.actions";
import { Shield, BarChart3, Users, UserCheck, Store, ReceiptText, LogOut } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Header Espace Admin */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-purple-600/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-slate-900">
                  Linki Admin Space
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  Super Admin
                </span>
              </div>
              <span className="text-xs text-slate-500">Supervision & Commissions</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <nav className="flex items-center gap-1">
              <Link
                href="/admin"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <BarChart3 className="w-4 h-4 text-purple-600" />
                <span className="hidden sm:inline">KPIs Globaux</span>
              </Link>

              <Link
                href="/admin/users"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <Users className="w-4 h-4 text-purple-600" />
                <span className="hidden sm:inline">Utilisateurs</span>
              </Link>

              <Link
                href="/admin/validations"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <UserCheck className="w-4 h-4 text-amber-500" />
                <span className="hidden sm:inline">Validations</span>
              </Link>

              <Link
                href="/admin/restaurants"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <Store className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Commissions</span>
              </Link>

              <Link
                href="/admin/orders"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <ReceiptText className="w-4 h-4 text-sky-600" />
                <span className="hidden sm:inline">Commandes</span>
              </Link>
            </nav>

            {/* Profil & Déconnexion */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-100">
              <span className="hidden md:inline text-xs font-medium text-slate-600">
                {user?.full_name || "Admin"}
              </span>
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
