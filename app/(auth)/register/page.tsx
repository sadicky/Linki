"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/actions/auth.actions";
import {
  User,
  Utensils,
  Bike,
  Lock,
  Mail,
  Phone,
  ArrowRight,
  Loader2,
  ShieldAlert,
  MapPin,
  UtensilsCrossed,
  ShieldCheck,
} from "lucide-react";
import { LUBUMBASHI_COMMUNES } from "@/lib/utils";
import type { UserRole } from "@/lib/supabase/types";

export default function RegisterPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>("client");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("+243 ");
  const [commune, setCommune] = useState<string>(LUBUMBASHI_COMMUNES[0]);
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantAddress, setRestaurantAddress] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    startTransition(async () => {
      const formattedAddress =
        selectedRole === "restaurant"
          ? `${restaurantAddress || "Boulevard Msiri"}, ${commune}, Lubumbashi`
          : undefined;

      const res = await signUp({
        email,
        password,
        fullName,
        phone,
        role: selectedRole as "client" | "restaurant" | "livreur",
        restaurantName: selectedRole === "restaurant" ? restaurantName : undefined,
        restaurantAddress: formattedAddress,
      });

      if (!res.success || !res.data) {
        setErrorMsg(res.error || "Erreur lors de la création du compte");
        return;
      }

      router.push(res.data.redirectUrl);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 antialiased selection:bg-emerald-500 selection:text-white">
      <div className="w-full max-w-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 mx-auto flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-7 h-7" />
            </div>
          </Link>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Inscription sur Linki RDC
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Rejoignez l&apos;écosystème de livraison n°1 à Lubumbashi en tant que client ou partenaire.
          </p>
        </div>

        {/* Card Formulaire */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Choix du rôle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Choisissez votre type de profil :
            </label>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedRole("client")}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  selectedRole === "client"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold ring-2 ring-emerald-500/20 shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                <User className="w-5 h-5 mx-auto mb-1.5 text-emerald-600" />
                <span className="text-xs block font-bold">Client</span>
                <span className="text-[10px] text-emerald-600 block font-normal">Accès direct</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("restaurant")}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  selectedRole === "restaurant"
                    ? "bg-amber-50 border-amber-500 text-amber-800 font-bold ring-2 ring-amber-500/20 shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                <Utensils className="w-5 h-5 mx-auto mb-1.5 text-amber-600" />
                <span className="text-xs block font-bold">Restaurateur</span>
                <span className="text-[10px] text-amber-600 block font-normal">Validation admin</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("livreur")}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  selectedRole === "livreur"
                    ? "bg-sky-50 border-sky-500 text-sky-800 font-bold ring-2 ring-sky-500/20 shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                <Bike className="w-5 h-5 mx-auto mb-1.5 text-sky-600" />
                <span className="text-xs block font-bold">Livreur Moto</span>
                <span className="text-[10px] text-sky-600 block font-normal">Validation admin</span>
              </button>
            </div>

            {selectedRole !== "client" && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
                <span>
                  Pour garantir l&apos;excellence du service à Lubumbashi, les comptes {selectedRole} sont vérifiés par l&apos;administration Linki avant activation.
                </span>
              </div>
            )}
          </div>

          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {selectedRole === "restaurant" ? "Nom du Gérant / Chef" : "Nom complet"}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder={
                    selectedRole === "restaurant"
                      ? "Ex: Chef Dieudonné Kalala"
                      : "Ex: Grace Mavinga"
                  }
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Téléphone (Vodacom, Airtel, Orange)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="+243 82 000 00 00"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Champs spécifiques Restaurateur */}
            {selectedRole === "restaurant" && (
              <div className="space-y-3 p-4 bg-amber-50/50 border border-amber-200 rounded-2xl">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                  Informations de l&apos;établissement
                </span>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nom du restaurant ou de l&apos;enseigne
                  </label>
                  <input
                    type="text"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    required
                    placeholder="Ex: Maboke & Grillades de la Gombe"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Adresse / Rue
                  </label>
                  <input
                    type="text"
                    value={restaurantAddress}
                    onChange={(e) => setRestaurantAddress(e.target.value)}
                    required
                    placeholder="Ex: 45 Boulevard du 30 Juin"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Commune de Lubumbashi */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Commune de référence (Lubumbashi)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={commune}
                  onChange={(e) => setCommune(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all cursor-pointer"
                >
                  {LUBUMBASHI_COMMUNES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Email & Mot de passe */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Adresse email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="nom@exemple.cd"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mot de passe</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="6 caractères min."
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                  />
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium">
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
                  <span>Enregistrement du dossier...</span>
                </>
              ) : (
                <>
                  <span>Finaliser mon inscription ({selectedRole})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Données protégées et confidentielles</span>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          Vous possédez déjà un compte ?{" "}
          <Link href="/login" className="text-emerald-600 font-bold hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
