"use client";

import React, { useState, useTransition } from "react";
import { updateRestaurantOrderStatus } from "@/lib/actions/restaurant.actions";
import { playOrderNotificationSound } from "@/lib/sound";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  BellRing,
  Clock,
  ChefHat,
  PackageCheck,
  XCircle,
  CheckCircle2,
  Volume2,
  VolumeX,
  Bike,
} from "lucide-react";
import type { Order, OrderItem } from "@/lib/mock-data";
import type { OrderStatus } from "@/lib/supabase/types";

interface LiveKitchenQueueProps {
  initialOrders: (Order & { items?: OrderItem[] })[];
}

export function LiveKitchenQueue({ initialOrders }: LiveKitchenQueueProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    startTransition(async () => {
      const res = await updateRestaurantOrderStatus(orderId, newStatus);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, statut: newStatus } : o))
        );
      }
    });
  };

  const triggerSoundTest = () => {
    playOrderNotificationSound();
  };

  const activeOrders = orders.filter((o) => o.statut !== "livree" && o.statut !== "annulee");
  const pastOrders = orders.filter((o) => o.statut === "livree" || o.statut === "annulee");

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <BellRing className="w-7 h-7 text-emerald-600 animate-pulse" />
            File de Commandes Cuisine (KDS)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gérez la préparation en cuisine et avertissez les livreurs dès que les commandes sont prêtes.
          </p>
        </div>

        {/* Contrôle du carillon audio */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              soundEnabled
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-slate-100 text-slate-500 border-slate-100"
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? "Alertes sonores actives" : "Muet"}</span>
          </button>

          <button
            onClick={triggerSoundTest}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold border border-slate-100 shadow-2xs transition-colors cursor-pointer"
            title="Tester le carillon"
          >
            Test sonnerie
          </button>
        </div>
      </div>

      {/* Colonnes de la file de commandes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Commandes en cours ({activeOrders.length})</span>
            {activeOrders.some((o) => o.statut === "en_attente") && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-black text-[10px] animate-bounce">
                Nouvelle commande !
              </span>
            )}
          </h2>
        </div>

        {activeOrders.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-500 space-y-2 shadow-2xs">
            <ChefHat className="w-10 h-10 mx-auto text-slate-400 mb-2" />
            <h3 className="text-sm font-bold text-slate-900">Aucune commande active en ce moment</h3>
            <p className="text-xs text-slate-500">
              Les nouvelles commandes passées par les clients apparaîtront ici avec une sonnerie automatique.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeOrders.map((order) => {
              const isNew = order.statut === "en_attente";

              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-2xl p-5 border flex flex-col justify-between gap-4 transition-all shadow-2xs ${
                    isNew
                      ? "border-amber-400 ring-2 ring-amber-100 bg-amber-50/20"
                      : "border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header carte */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-500">
                          #{order.id.substring(0, 10)}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDate(order.created_at)}</span>
                        </div>
                      </div>

                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase ${
                          order.statut === "en_attente"
                            ? "bg-amber-100 text-amber-800 border border-amber-200 animate-pulse"
                            : order.statut === "acceptee"
                            ? "bg-sky-50 text-sky-700 border border-sky-200"
                            : order.statut === "en_preparation"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {order.statut.replace("_", " ")}
                      </span>
                    </div>

                    {/* Contenu plats */}
                    <div className="space-y-1.5 py-1">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="text-slate-700">
                            <strong className="text-amber-700 font-extrabold mr-1">
                              {item.quantite}x
                            </strong>
                            Plat sélectionné
                          </span>
                          <span className="font-semibold text-slate-900">
                            {formatPrice(item.prix_unitaire * item.quantite)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {order.notes && (
                      <div className="p-2.5 bg-amber-50/60 rounded-xl text-[11px] text-amber-800 italic border border-amber-200">
                        Instructions client : &ldquo;{order.notes}&rdquo;
                      </div>
                    )}
                  </div>

                  {/* Boutons d'action machine à états */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                      <span>Total commande :</span>
                      <strong className="text-slate-900 text-sm font-bold">
                        {formatPrice(order.montant_total)}
                      </strong>
                    </div>

                    {order.statut === "en_attente" && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleStatusChange(order.id, "acceptee")}
                          disabled={isPending}
                          className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Accepter</span>
                        </button>

                        <button
                          onClick={() => handleStatusChange(order.id, "annulee")}
                          disabled={isPending}
                          className="py-2.5 px-3 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-slate-100 transition-all cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Refuser</span>
                        </button>
                      </div>
                    )}

                    {order.statut === "acceptee" && (
                      <button
                        onClick={() => handleStatusChange(order.id, "en_preparation")}
                        disabled={isPending}
                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      >
                        <ChefHat className="w-4 h-4" />
                        <span>Lancer la préparation</span>
                      </button>
                    )}

                    {order.statut === "en_preparation" && (
                      <button
                        onClick={() => handleStatusChange(order.id, "prete")}
                        disabled={isPending}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      >
                        <PackageCheck className="w-4 h-4 stroke-[2.5]" />
                        <span>Marquer prêt pour le livreur</span>
                      </button>
                    )}

                    {order.statut === "prete" && (
                      <div className="p-2.5 bg-sky-50 rounded-xl text-xs text-sky-700 flex items-center justify-center gap-2 border border-sky-200 font-medium">
                        <Bike className="w-4 h-4 animate-bounce" />
                        <span>En attente d&apos;attribution au coursier...</span>
                      </div>
                    )}

                    {order.statut === "en_livraison" && (
                      <div className="p-2.5 bg-emerald-50 rounded-xl text-xs text-emerald-800 flex items-center justify-center gap-2 border border-emerald-200 font-medium">
                        <Bike className="w-4 h-4" />
                        <span>Course prise en charge par le coursier</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Historique des commandes du jour */}
      {pastOrders.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-100">
          <h2 className="text-base font-bold text-slate-700">
            Commandes clôturées aujourd&apos;hui ({pastOrders.length})
          </h2>

          <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs">
            {pastOrders.map((order) => (
              <div
                key={order.id}
                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-mono text-slate-600 font-semibold">#{order.id.substring(0, 10)}</span>
                  <span className="text-slate-400 ml-2">• {formatDate(order.created_at)}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900">{formatPrice(order.montant_total)}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      order.statut === "livree"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {order.statut.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
