"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  Mail,
  Shield,
  Store,
  Bike,
  CheckCircle2,
  AlertCircle,
  Camera,
  Calendar,
  Save,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { updateUserProfile, type UserProfileDetails } from "@/lib/actions/auth.actions";
import type { UserRole } from "@/lib/supabase/types";

interface UserProfileManagerProps {
  initialData: UserProfileDetails;
}

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
  "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
];

const ROLE_META: Record<
  UserRole,
  { label: string; icon: typeof User; color: string; bg: string; border: string; desc: string }
> = {
  client: {
    label: "Client Gourmand",
    icon: User,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    desc: "Vous pouvez commander des plats, suivre vos livraisons et enregistrer vos adresses préférées.",
  },
  restaurant: {
    label: "Restaurateur Partenaire",
    icon: Store,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    desc: "Gérez votre carte, vos commandes en cuisine et suivez vos revenus en direct.",
  },
  livreur: {
    label: "Livreur / Coursier",
    icon: Bike,
    color: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
    desc: "Prenez en charge les courses, validez les codes PIN et maximisez vos gains de livraison.",
  },
  admin: {
    label: "Super Administrateur",
    icon: Shield,
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    desc: "Supervision globale, gestion de tous les utilisateurs, validation et taux de commission.",
  },
};

export function UserProfileManager({ initialData }: UserProfileManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [profile, setProfile] = useState(initialData.profile);

  // Form states
  const [fullName, setFullName] = useState(initialData.profile.full_name);
  const [phone, setPhone] = useState(initialData.profile.phone || "");
  const [avatarUrl, setAvatarUrl] = useState(initialData.profile.avatar_url || AVATAR_PRESETS[0]);

  // Restaurant fields
  const [restoNom, setRestoNom] = useState(initialData.restaurant?.nom || "");
  const [restoDesc, setRestoDesc] = useState(initialData.restaurant?.description || "");
  const [restoAdresse, setRestoAdresse] = useState(initialData.restaurant?.adresse || "");

  // Status feedback
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const roleInfo = ROLE_META[profile.role] || ROLE_META.client;
  const RoleIcon = roleInfo.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const res = await updateUserProfile({
        full_name: fullName,
        phone,
        avatar_url: avatarUrl,
        restaurant_nom: profile.role === "restaurant" ? restoNom : undefined,
        restaurant_description: profile.role === "restaurant" ? restoDesc : undefined,
        restaurant_adresse: profile.role === "restaurant" ? restoAdresse : undefined,
      });

      if (res.success && res.data) {
        setProfile(res.data);
        setFeedback({
          type: "success",
          message: "Vos informations de profil ont été mises à jour avec succès !",
        });
        router.refresh();
      } else {
        setFeedback({
          type: "error",
          message: res.error || "Une erreur est survenue lors de la mise à jour.",
        });
      }
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header carte de profil */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img
                src={avatarUrl}
                alt={profile.full_name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-slate-100 bg-slate-100 shadow-xs"
              />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {profile.full_name}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${roleInfo.bg} ${roleInfo.color} ${roleInfo.border}`}
                >
                  <RoleIcon className="w-3 h-3" />
                  <span>{roleInfo.label}</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {profile.status}
                </span>
              </div>

              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{initialData.email}</span>
                <span className="text-slate-300">•</span>
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{profile.phone || "Non renseigné"}</span>
              </p>

              <p className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>Membre depuis le {new Date(profile.created_at).toLocaleDateString("fr-FR")}</span>
              </p>
            </div>
          </div>

          {/* Raccourci vers l'espace métier selon le rôle */}
          {profile.role === "restaurant" && (
            <button
              onClick={() => router.push("/dashboard/restaurant")}
              className="w-full sm:w-auto px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>Ouvrir ma Cuisine & Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {profile.role === "admin" && (
            <button
              onClick={() => router.push("/admin")}
              className="w-full sm:w-auto px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>Console Super Admin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {profile.role === "client" && (
            <button
              onClick={() => router.push("/orders")}
              className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Mes Commandes ({initialData.stats.ordersCount || 0})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Message de notification */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-semibold ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-700 border-rose-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Formulaire de modification */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Données Personnelles & Coordonnées</h2>
            <p className="text-xs text-slate-500">
              Ces informations sont utilisées pour vos commandes, livraisons et communications Linki.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            {/* Nom complet */}
            <div className="space-y-1.5">
              <label className="block text-slate-700 font-semibold">Nom complet</label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Ex: Grace Mavinga"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>
            </div>

            {/* Téléphone */}
            <div className="space-y-1.5">
              <label className="block text-slate-700 font-semibold">
                Téléphone (Paiements Mobile Money Lubumbashi)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+243 82 123 4567"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>
            </div>

            {/* Email (fixé pour sécurité) */}
            <div className="space-y-1.5">
              <label className="block text-slate-700 font-semibold">Adresse Email</label>
              <input
                type="email"
                value={initialData.email}
                disabled
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-500 cursor-not-allowed font-medium"
              />
              <span className="text-[10px] text-slate-400">Géré par l'authentification sécurisée</span>
            </div>

            {/* Rôle actuel (fixé par l'admin) */}
            <div className="space-y-1.5">
              <label className="block text-slate-700 font-semibold">Rôle dans Linki</label>
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <RoleIcon className={`w-4 h-4 ${roleInfo.color}`} />
                <span className="font-bold text-slate-800 capitalize">{roleInfo.label}</span>
              </div>
              <span className="text-[10px] text-slate-400">Les rôles sont administrés dans la table profiles</span>
            </div>
          </div>

          {/* Choix de l'avatar */}
          <div className="space-y-3 pt-2">
            <label className="block text-slate-700 font-semibold text-xs">
              Photo de profil (choisissez une suggestion ou entrez une URL)
            </label>
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setAvatarUrl(preset)}
                  className={`relative shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    avatarUrl === preset ? "border-emerald-600 scale-105 shadow-xs" : "border-slate-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={preset} alt="Preset avatar" className="w-12 h-12 object-cover" />
                  {avatarUrl === preset && (
                    <div className="absolute inset-0 bg-emerald-600/20 flex items-center justify-center text-white">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-700 text-xs focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        {/* Si c'est un restaurateur : Section Restaurant */}
        {profile.role === "restaurant" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-2xs space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Store className="w-4 h-4 text-amber-600" />
                  <span>Informations de l'Établissement Restaurant</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Modifiez les données visibles par les clients de Lubumbashi sur votre fiche restaurant.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-slate-700 font-semibold">Nom de l'enseigne</label>
                <input
                  type="text"
                  value={restoNom}
                  onChange={(e) => setRestoNom(e.target.value)}
                  placeholder="Ex: Le Cercle du Golf & Grillades de Lubumbashi"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-slate-700 font-semibold">Description & Spécialités lushoises</label>
                <textarea
                  rows={2}
                  value={restoDesc}
                  onChange={(e) => setRestoDesc(e.target.value)}
                  placeholder="Ex: Le temple du T-Bone katangais grillé au feu de bois..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-slate-700 font-semibold">Adresse physique à Lubumbashi</label>
                <input
                  type="text"
                  value={restoAdresse}
                  onChange={(e) => setRestoAdresse(e.target.value)}
                  placeholder="Ex: Boulevard Msiri, Quartier Golf, Lubumbashi"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bouton d'enregistrement */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enregistrement en cours...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Enregistrer mes modifications</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
