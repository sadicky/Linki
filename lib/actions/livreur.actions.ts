"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth.actions";
import { demoStore, type Delivery, type Order } from "@/lib/mock-data";
import type { ActionResponse } from "@/lib/utils";
import type { DeliveryStatus } from "@/lib/supabase/types";

/**
 * Récupère les courses prêtes à être récupérées
 */
export async function getAvailableRuns() {
  const readyOrders = demoStore.orders.filter(
    (o) => o.statut === "prete" && !o.livreur_id
  );

  return readyOrders.map((o) => {
    const resto = demoStore.restaurants.find((r) => r.id === o.restaurant_id);
    return {
      ...o,
      restaurant: resto,
      earnings: 5000 + (o.frais_livraison || 4500), // Rémunération forfait moto + frais
    };
  });
}

/**
 * Récupère la course active du livreur connecté
 */
export async function getActiveDelivery() {
  const user = await getCurrentUser();
  if (!user) return null;

  const delivery = demoStore.deliveries.find(
    (d) => d.livreur_id === user.id && d.statut !== "livree"
  );

  if (!delivery) return null;

  const order = demoStore.orders.find((o) => o.id === delivery.order_id);
  const restaurant = order
    ? demoStore.restaurants.find((r) => r.id === order.restaurant_id)
    : null;
  const client = order
    ? demoStore.profiles.find((p) => p.id === order.client_id)
    : null;

  return {
    delivery,
    order,
    restaurant,
    client,
  };
}

/**
 * Accepter une course disponible
 */
export async function acceptDeliveryRun(orderId: string): Promise<ActionResponse<{ deliveryId: string }>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Non connecté" };

  const order = demoStore.orders.find((o) => o.id === orderId);
  if (!order) return { success: false, error: "Commande introuvable" };
  if (order.livreur_id) return { success: false, error: "Course déjà attribuée" };

  const deliveryId = "del-" + Date.now();
  order.livreur_id = user.id;
  order.statut = "en_livraison";
  order.updated_at = new Date().toISOString();

  const newDelivery: Delivery = {
    id: deliveryId,
    order_id: orderId,
    livreur_id: user.id,
    position_actuelle_lat: 48.858,
    position_actuelle_lng: 2.345,
    statut: "en_route_restaurant",
    heure_recuperation: null,
    heure_livraison: null,
    updated_at: new Date().toISOString(),
  };

  demoStore.deliveries.push(newDelivery);

  revalidatePath("/dashboard/livreur");
  revalidatePath(`/orders/${orderId}`);

  return { success: true, data: { deliveryId } };
}

/**
 * Mise à jour de l'étape de livraison
 */
export async function updateDeliveryStep(
  deliveryId: string,
  newStep: DeliveryStatus
): Promise<ActionResponse> {
  const delivery = demoStore.deliveries.find((d) => d.id === deliveryId);
  if (!delivery) return { success: false, error: "Livraison introuvable" };

  delivery.statut = newStep;
  delivery.updated_at = new Date().toISOString();

  if (newStep === "recuperee") {
    delivery.heure_recuperation = new Date().toISOString();
  } else if (newStep === "livree") {
    delivery.heure_livraison = new Date().toISOString();

    // Passer la commande à livrée
    const order = demoStore.orders.find((o) => o.id === delivery.order_id);
    if (order) {
      order.statut = "livree";
      order.updated_at = new Date().toISOString();
    }
  }

  revalidatePath("/dashboard/livreur");
  revalidatePath(`/orders/${delivery.order_id}`);

  return { success: true };
}

/**
 * Mise à jour de la position GPS en direct (simulée ou réelle du navigateur)
 */
export async function updateCourierGps(
  deliveryId: string,
  lat: number,
  lng: number
): Promise<ActionResponse> {
  const delivery = demoStore.deliveries.find((d) => d.id === deliveryId);
  if (delivery) {
    delivery.position_actuelle_lat = lat;
    delivery.position_actuelle_lng = lng;
    delivery.updated_at = new Date().toISOString();
    return { success: true };
  }
  return { success: false, error: "Livraison introuvable" };
}

/**
 * Historique des gains du livreur
 */
export async function getCourierEarnings() {
  const user = await getCurrentUser();
  if (!user) return { totalEarnings: 0, completedCount: 0, history: [] };

  const userDeliveries = demoStore.deliveries.filter(
    (d) => d.livreur_id === user.id && d.statut === "livree"
  );

  const history = userDeliveries.map((d) => {
    const order = demoStore.orders.find((o) => o.id === d.order_id);
    const payout = 5000 + (order?.frais_livraison || 4500);
    return {
      id: d.id,
      orderId: d.order_id,
      deliveredAt: d.heure_livraison || d.updated_at,
      payout,
      address: order?.adresse_livraison || "Adresse client",
    };
  });

  const totalEarnings = history.reduce((acc, curr) => acc + curr.payout, 0);

  return {
    totalEarnings: Math.round(totalEarnings * 100) / 100,
    completedCount: history.length,
    history,
  };
}
