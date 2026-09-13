"use client";

import Link from "next/link";
import { useCart } from "./CartContext";
import { signOut } from "@/lib/actions/auth.actions";
import { ShoppingBag, MapPin, ReceiptText, UtensilsCrossed, LogOut, User, Store, Bike, Shield } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { UserRole } from "@/lib/supabase/types";

interface ClientNavbarProps {
  onOpenCart?: () => void;
  userName?: string;
  userRole?: UserRole;
}

export function ClientNavbar({ onOpenCart, userName, userRole }: ClientNavbarProps) {
  const { totalCount, total } = useCart();

  const getProSpaceLink = () => {
    if (userRole === "restaurant") return { href: "/dashboard/restaurant", label: "Espace Restaurant", icon: Store };
    if (userRole === "livreur") return { href: "/dashboard/livreur", label: "Espace Livreur", icon: Bike };
    if (userRole === "admin") return { href: "/admin", label: "Espace Admin", icon: Shield };
    return null;
  };

  const proSpace = getProSpaceLink();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 flex items-center">
                Link<span className="text-emerald-600">i</span>
              </span>
              <span className="block text-[10px] text-slate-500 -mt-1 font-medium">Lubumbashi Food Delivery</span>
            </div>
          </Link>

          {/* Sélecteur d'adresse */}
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-full border border-slate-200 cursor-pointer transition-colors">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-semibold text-slate-900">Livrer à :</span>
            <span className="text-slate-600 truncate max-w-[220px]">Boulevard Msiri, Golf, Lubumbashi</span>
          </div>
        </div>

        {/* Navigation droite */}
        <div className="flex items-center gap-2.5">
          {/* Espace Pro si profil partenaire */}
          {proSpace && (
            <Link
              href={proSpace.href}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl border border-emerald-200 transition-colors"
            >
              <proSpace.icon className="w-3.5 h-3.5 text-emerald-600" />
              <span>{proSpace.label}</span>
            </Link>
          )}

          <Link
            href="/orders"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <ReceiptText className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Mes Commandes</span>
          </Link>

          {/* Bouton Panier */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {totalCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-emerald-700 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-emerald-600 shadow-xs">
                  {totalCount}
                </span>
              )}
            </div>
            <span>{totalCount > 0 ? formatPrice(total) : "Panier"}</span>
          </button>

          {/* Utilisateur / Déconnexion */}
          {userName ? (
            <div className="flex items-center gap-1 pl-1 border-l border-slate-200 ml-1">
              <div className="hidden lg:flex flex-col text-right pr-2">
                <span className="text-xs font-bold text-slate-800 leading-tight">{userName}</span>
                <span className="text-[10px] text-slate-500 capitalize">{userRole}</span>
              </div>
              <button
                onClick={() => signOut()}
                title="Se déconnecter"
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Connexion</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
