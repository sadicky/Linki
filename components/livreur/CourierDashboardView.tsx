"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  acceptDeliveryRun,
  updateDeliveryStep,
  updateCourierGps,
} from "@/lib/actions/livreur.actions";
import { InteractiveDeliveryMap } from "@/components/maps/InteractiveDeliveryMap";
import { formatPrice } from "@/lib/utils";
import {
  Bike,
  Store,
  Home,
  Navigation,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Loader2,
  Radio,
  MapPin,
} from "lucide-react";
import type { Delivery, Order, Restaurant, Profile } from "@/lib/mock-data";
import type { DeliveryStatus } from "@/lib/supabase/types";

interface CourierDashboardViewProps {
  availableRuns: (Order & { restaurant?: Restaurant; earnings: number })[];
  activeDeliveryData: {
    delivery: Delivery;
    order?: Order;
    restaurant?: Restaurant | null;
    client?: Profile | null;
  } | null;
}

export function CourierDashboardView({
  availableRuns: initialRuns,
  activeDeliveryData: initialActive,
}: CourierDashboardViewProps) {
  const [runs] = useState(initialRuns);
  const [activeData, setActiveData] = useState(initialActive);
  const [isPending, startTransition] = useTransition();

  // Position GPS courante simulée
  const [currentLat, setCurrentLat] = useState(-4.315);
  const [currentLng, setCurrentLng] = useState(15.295);

  // Simulation de déplacement GPS périodique lorsque la course est active
  useEffect(() => {
    if (!activeData) return;

    const interval = setInterval(() => {
      // Déplacement léger progressif vers le point de livraison
      setCurrentLat((prev) => prev + (Math.random() - 0.48) * 0.001);
      setCurrentLng((prev) => prev + (Math.random() - 0.48) * 0.001);

      // Envoi de la mise à jour GPS au serveur
      if (activeData?.delivery?.id) {
        updateCourierGps(activeData.delivery.id, currentLat, currentLng);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [activeData, currentLat, currentLng]);

  // Accepter une course disponible
  const handleAcceptRun = (orderId: string) => {
    startTransition(async () => {
      const res = await acceptDeliveryRun(orderId);
      if (res.success && res.data) {
        window.location.reload();
      }
    });
  };

  // Mettre à jour l'étape de livraison
  const handleNextStep = (nextStep: DeliveryStatus) => {
    if (!activeData?.delivery?.id) return;

    startTransition(async () => {
      const res = await updateDeliveryStep(activeData.delivery.id, nextStep);
      if (res.success) {
        if (nextStep === "livree") {
          setActiveData(null);
        } else {
          setActiveData((prev) =>
            prev
              ? {
                  ...prev,
                  delivery: { ...prev.delivery, statut: nextStep },
                }
              : null
          );
        }
      }
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. CAS D'UNE COURSE ACTIVE */}
      {activeData ? (
        <div className="space-y-6">
          {/* Header Course Active */}
          <div className="bg-white border border-sky-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Course active en cours de livraison</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900">
                {activeData.delivery.statut === "en_route_restaurant"
                  ? "Dirigez-vous vers le restaurant"
                  : activeData.delivery.statut === "recuperee"
                  ? "Commande récupérée, démarrez le trajet"
                  : "Acheminez la commande au client"}
              </h1>
              <p className="text-xs text-slate-500">
                Commande N° <span className="font-mono text-slate-700 font-semibold">{activeData.order?.id}</span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500">Rémunération course</span>
              <div className="text-2xl font-black text-emerald-700">
                {formatPrice(4500 + (activeData.order?.frais_livraison || 2500))}
              </div>
            </div>
          </div>

          {/* Carte & GPS Live */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-sky-600" />
                  Navigation GPS interactive
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Position GPS diffusée au client</span>
                </div>
              </div>

              <InteractiveDeliveryMap
                restaurantCoords={{
                  lat: activeData.restaurant?.lat || -4.3032,
                  lng: activeData.restaurant?.lng || 15.3082,
                  name: activeData.restaurant?.nom || "Restaurant",
                }}
                clientCoords={{
                  lat: activeData.order?.lat || -4.3214,
                  lng: activeData.order?.lng || 15.2756,
                  address: activeData.order?.adresse_livraison,
                }}
                courierCoords={{
                  lat: currentLat,
                  lng: currentLng,
                  name: "Vous (Coursier)",
                }}
                status={activeData.delivery.statut}
              />
            </div>

            {/* Actions & Coordonnées (4 colonnes) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Étape 1 : Restaurant */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-2xs">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                  Étape 1 : Retrait Commande
                </span>
                <div className="flex items-start gap-2.5">
                  <Store className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {activeData.restaurant?.nom}
                    </h4>
                    <p className="text-xs text-slate-500">{activeData.restaurant?.adresse}</p>
                  </div>
                </div>
              </div>

              {/* Étape 2 : Client */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-2xs">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                  Étape 2 : Livraison Client
                </span>
                <div className="flex items-start gap-2.5">
                  <Home className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {activeData.client?.full_name || "Client Linki"}
                    </h4>
                    <p className="text-xs text-slate-500">{activeData.order?.adresse_livraison}</p>
                    {activeData.order?.notes && (
                      <p className="text-[11px] text-amber-800 italic mt-1">
                        Instructions : {activeData.order.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bouton de validation d'étape */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-2xs">
                <h4 className="text-xs font-bold text-slate-900">Action suivante :</h4>

                {activeData.delivery.statut === "en_route_restaurant" && (
                  <button
                    onClick={() => handleNextStep("recuperee")}
                    disabled={isPending}
                    className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    {isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                        <span>J&apos;ai récupéré la commande</span>
                      </>
                    )}
                  </button>
                )}

                {activeData.delivery.statut === "recuperee" && (
                  <button
                    onClick={() => handleNextStep("en_route_client")}
                    disabled={isPending}
                    className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    {isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Navigation className="w-4 h-4" />
                        <span>En route vers le client</span>
                      </>
                    )}
                  </button>
                )}

                {activeData.delivery.statut === "en_route_client" && (
                  <button
                    onClick={() => handleNextStep("livree")}
                    disabled={isPending}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    {isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                        <span>Valider la livraison effectuée</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 2. CAS OÙ AUCUNE COURSE N'EST ACTIVE (RADAR COURSES DISPONIBLES) */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
                <Bike className="w-7 h-7 text-sky-600" />
                Courses Disponibles
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Commandes prêtes en cuisine dans vos environs. Acceptez une course pour lancer la navigation.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{runs.length} course(s) disponible(s)</span>
            </div>
          </div>

          {runs.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 space-y-3 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Bike className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Radar en recherche...</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Aucune commande n&apos;est prête pour le moment. Dès qu&apos;un restaurant clique sur &ldquo;Marquer prêt&rdquo;, la course apparaîtra ici instantanément.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {runs.map((run) => (
                <div
                  key={run.id}
                  className="bg-white border border-slate-200 hover:border-sky-300 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-2xs hover:shadow-md transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="text-[10px] font-mono text-slate-500 font-semibold">
                        #{run.id.substring(0, 10)}
                      </span>
                      <div className="flex items-center gap-1 text-emerald-700 font-extrabold text-sm">
                        <DollarSign className="w-4 h-4" />
                        <span>+{formatPrice(run.earnings)}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      {/* Enlèvement */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
                          <Store className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            Retrait
                          </span>
                          <h4 className="font-bold text-slate-900">{run.restaurant?.nom}</h4>
                          <p className="text-slate-500 text-[11px] line-clamp-1">
                            {run.restaurant?.adresse}
                          </p>
                        </div>
                      </div>

                      {/* Livraison */}
                      <div className="flex items-start gap-2.5 pt-2 border-t border-slate-100">
                        <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            Livraison
                          </span>
                          <h4 className="font-bold text-slate-900 line-clamp-1">
                            {run.adresse_livraison}
                          </h4>
                          <span className="text-slate-500 text-[11px]">Lubumbashi</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAcceptRun(run.id)}
                    disabled={isPending}
                    className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                  >
                    {isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <span>Accepter la course</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
