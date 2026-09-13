"use client";

import React, { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { InteractiveDeliveryMap } from "@/components/maps/InteractiveDeliveryMap";
import { submitOrderReview } from "@/lib/actions/client.actions";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  Clock,
  CheckCircle2,
  Bike,
  Store,
  ChefHat,
  PackageCheck,
  Star,
  Send,
  Loader2,
  Sparkles,
} from "lucide-react";
import type { Order, Restaurant, Delivery, Profile } from "@/lib/mock-data";
import type { OrderStatus } from "@/lib/supabase/types";

interface RealtimeOrderTrackerProps {
  initialOrder: Order & { items?: unknown[] };
  restaurant: Restaurant | null;
  initialDelivery: Delivery | null;
  livreur: Profile | null;
}

const STATUS_STEPS: { key: OrderStatus; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "en_attente", label: "Commande envoyée", icon: Clock },
  { key: "acceptee", label: "Acceptée", icon: Store },
  { key: "en_preparation", label: "En cuisine", icon: ChefHat },
  { key: "prete", label: "Prête", icon: PackageCheck },
  { key: "en_livraison", label: "En livraison", icon: Bike },
  { key: "livree", label: "Livrée ! Bon appétit", icon: CheckCircle2 },
];

export function RealtimeOrderTracker({
  initialOrder,
  restaurant,
  initialDelivery,
  livreur,
}: RealtimeOrderTrackerProps) {
  const [order, setOrder] = useState(initialOrder);
  const [delivery, setDelivery] = useState(initialDelivery);
  const [isSubmittingReview, startReviewTransition] = useTransition();

  // État formulaire avis
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Écoute Supabase Realtime pour les mises à jour en direct
  useEffect(() => {
    try {
      const supabase = createClient();
      const channel = supabase
        .channel(`order-tracker-${order.id}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "orders",
            filter: `id=eq.${order.id}`,
          },
          (payload) => {
            setOrder((prev) => ({ ...prev, ...(payload.new as Partial<Order>) }));
          }
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "deliveries",
            filter: `order_id=eq.${order.id}`,
          },
          (payload) => {
            setDelivery(payload.new as Delivery);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      // Pas de serveur Supabase temps réel distant disponible
    }
  }, [order.id]);

  // Index du statut courant
  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.statut);

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant) return;

    startReviewTransition(async () => {
      const res = await submitOrderReview({
        order_id: order.id,
        restaurant_id: restaurant.id,
        note: rating,
        commentaire: reviewComment || undefined,
      });

      if (res.success) {
        setReviewSubmitted(true);
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Statut Hero Header */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Suivi de commande en direct</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {order.statut === "livree"
              ? "Commande Livrée !"
              : "Votre commande est en cours de préparation"}
          </h1>
          <p className="text-xs text-slate-500">
            N° de commande : <span className="font-mono text-slate-700 font-semibold">{order.id}</span> • Passée le{" "}
            {formatDate(order.created_at)}
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500">Montant total</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">
            {formatPrice(order.montant_total)}
          </div>
        </div>
      </div>

      {/* Barre de progression des statuts */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {STATUS_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step.key}
                className={`flex flex-col items-center text-center p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-xs scale-102"
                    : isCompleted
                    ? "bg-slate-50 border-slate-100 text-slate-700"
                    : "bg-white border-slate-100 text-slate-400 opacity-50"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                    isCurrent
                      ? "bg-emerald-600 text-white shadow-xs"
                      : isCompleted
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] leading-tight font-medium">{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Carte interactive et informations livreur */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Carte (8 colonnes) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bike className="w-5 h-5 text-emerald-600" />
              Trajet de livraison en direct
            </h3>
            <span className="text-xs text-slate-500">Position rafraîchie en continu</span>
          </div>

          <InteractiveDeliveryMap
            restaurantCoords={{
              lat: restaurant?.lat || -11.6542,
              lng: restaurant?.lng || 27.4695,
              name: restaurant?.nom || "Restaurant",
            }}
            clientCoords={{
              lat: order.lat || -11.656,
              lng: order.lng || 27.472,
              address: order.adresse_livraison,
            }}
            courierCoords={
              delivery?.position_actuelle_lat && delivery?.position_actuelle_lng
                ? {
                    lat: Number(delivery.position_actuelle_lat),
                    lng: Number(delivery.position_actuelle_lng),
                    name: livreur?.full_name || "Livreur Linki",
                  }
                : null
            }
            status={order.statut}
          />
        </div>

        {/* Détails Restaurant & Livreur (4 colonnes) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Restaurant */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{restaurant?.nom || "Restaurant"}</h4>
                <p className="text-xs text-slate-500">{restaurant?.adresse}</p>
              </div>
            </div>
          </div>

          {/* Livreur assigné */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-sky-700 font-semibold uppercase tracking-wider">
                  Votre Livreur Linki
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  {livreur?.full_name || "Attribution en cours..."}
                </h4>
                {livreur?.phone && (
                  <p className="text-xs text-slate-500 mt-0.5">{livreur.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Code PIN Sécurisé style UberEats */}
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-5 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">
                Code PIN de remise sécurisé
              </span>
              <span className="text-[9px] bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                Anti-Erreur
              </span>
            </div>
            <div className="text-3xl font-black font-mono tracking-widest text-emerald-800">
              {order.code_pin || "4821"}
            </div>
            <p className="text-[11px] text-emerald-700 leading-snug">
              Donnez ce code au livreur à la porte pour confirmer la remise de votre repas.
            </p>
          </div>

          {/* Adresse de livraison & Instructions */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-2 text-xs shadow-2xs">
            <div>
              <span className="text-slate-500 font-medium">Adresse de livraison</span>
              <p className="text-slate-900 font-semibold mt-0.5">{order.adresse_livraison}</p>
            </div>
            {order.instructions_livraison && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-500 font-medium">Repères d&apos;accès :</span>
                <p className="text-slate-700 italic">{order.instructions_livraison}</p>
              </div>
            )}
            {order.pourboire_livreur > 0 && (
              <div className="pt-2 border-t border-slate-100 flex justify-between text-emerald-700 font-medium">
                <span>Pourboire inclus :</span>
                <span>+{formatPrice(order.pourboire_livreur)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Formulaire de notation (actif quand statut === 'livree') */}
      {order.statut === "livree" && (
        <div className="bg-white border border-emerald-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Comment s&apos;est passée votre dégustation ?</h3>
              <p className="text-xs text-slate-500">
                Laissez une note et un avis pour soutenir le restaurant {restaurant?.nom} !
              </p>
            </div>
          </div>

          {reviewSubmitted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Merci beaucoup pour votre avis ! Il a été publié sur la page du restaurant.</span>
            </div>
          ) : (
            <form onSubmit={handleReview} className="space-y-4 max-w-xl">
              {/* Étoiles interactives */}
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? "fill-amber-400 text-amber-500"
                          : "text-slate-200"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-slate-600 ml-2 font-medium">
                  {rating === 5
                    ? "Exceptionnel !"
                    : rating === 4
                    ? "Très bon"
                    : rating === 3
                    ? "Correct"
                    : "Moyen"}
                </span>
              </div>

              <div>
                <textarea
                  rows={3}
                  placeholder="Partagez vos impressions sur la cuisson, le goût et la livraison..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-white border border-slate-100 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all shadow-2xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                {isSubmittingReview ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Envoi de l&apos;avis...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Publier mon avis</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
