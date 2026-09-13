"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/actions/auth.actions";
import {
  UtensilsCrossed,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    startTransition(async () => {
      const res = await signIn({ email, password });
      if (!res.success || !res.data) {
        setErrorMsg(res.error || "Identifiants invalides. Veuillez réessayer.");
        return;
      }

      router.push(res.data.redirectUrl);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 antialiased selection:bg-emerald-500 selection:text-white">
      <div className="w-full max-w-md space-y-6">
        {/* Logo & En-tête */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 mx-auto flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-7 h-7" />
            </div>
          </Link>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Link<span className="text-emerald-600">i</span>
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              RDC • Lubumbashi
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Connectez-vous à votre compte pour accéder à votre espace de commande ou de gestion.
          </p>
        </div>

        {/* Card Formulaire */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Connexion sécurisée</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Accès unique pour Clients, Restaurateurs, Livreurs et Administrateurs.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="nom@exemple.cd"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Mot de passe
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Votre mot de passe"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-700 font-medium">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-[0.98] transition-all cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Accès Démo Rapide par Rôle */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 block">
              Connexion rapide par rôle (1 clic) :
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail("client@linki.cd");
                  setPassword("pass123");
                }}
                className="p-2 rounded-xl text-left bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-100 transition-colors cursor-pointer"
              >
                <span className="text-[11px] font-bold text-emerald-800 block">👤 Client</span>
                <span className="text-[10px] text-emerald-600">Partie Client</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail("resto@linki.cd");
                  setPassword("pass123");
                }}
                className="p-2 rounded-xl text-left bg-amber-50/70 hover:bg-amber-100/70 border border-amber-100 transition-colors cursor-pointer"
              >
                <span className="text-[11px] font-bold text-amber-800 block">🍽️ Restaurant</span>
                <span className="text-[10px] text-amber-600">Fenêtre Cuisine</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail("livreur@linki.cd");
                  setPassword("pass123");
                }}
                className="p-2 rounded-xl text-left bg-sky-50/70 hover:bg-sky-100/70 border border-sky-100 transition-colors cursor-pointer"
              >
                <span className="text-[11px] font-bold text-sky-800 block">🛵 Livreur</span>
                <span className="text-[10px] text-sky-600">Fenêtre Courses</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail("admin@linki.cd");
                  setPassword("pass123");
                }}
                className="p-2 rounded-xl text-left bg-purple-50/70 hover:bg-purple-100/70 border border-purple-100 transition-colors cursor-pointer"
              >
                <span className="text-[11px] font-bold text-purple-800 block">🛡️ Super Admin</span>
                <span className="text-[10px] text-purple-600">Fenêtre Admin</span>
              </button>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Connexion chiffrée SSL 256-bit</span>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-emerald-600 font-bold hover:underline">
            Créer un compte client ou partenaire
          </Link>
        </div>
      </div>
    </div>
  );
}
