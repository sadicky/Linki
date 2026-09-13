"use server";

import { revalidatePath } from "next/cache";
import { demoStore, type Profile, type Restaurant, type Order } from "@/lib/mock-data";
import type { ActionResponse } from "@/lib/utils";
import type { AccountStatus } from "@/lib/supabase/types";

/**
 * Récupère les profils partenaires en attente de validation
 */
export async function getPendingPartners(): Promise<Profile[]> {
  return demoStore.profiles.filter(
    (p) => p.status === "en_attente_validation" && (p.role === "restaurant" || p.role === "livreur")
  );
}

/**
 * Mettre à jour le statut d'un compte partenaire (Approuver ou Suspendre)
 */
export async function updatePartnerStatus(
  userId: string,
  newStatus: AccountStatus
): Promise<ActionResponse> {
  const profile = demoStore.profiles.find((p) => p.id === userId);
  if (!profile) return { success: false, error: "Utilisateur introuvable" };

  profile.status = newStatus;
  profile.updated_at = new Date().toISOString();

  revalidatePath("/admin/validations");
  revalidatePath("/pending-approval");

  return { success: true };
}

/**
 * Récupère la liste des restaurants pour ajuster les commissions
 */
export async function getAllRestaurantsForAdmin(): Promise<Restaurant[]> {
  return demoStore.restaurants;
}

/**
 * Met à jour le taux de commission d'un restaurant spécifique
 */
export async function updateRestaurantCommission(
  restaurantId: string,
  newCommissionPct: number
): Promise<ActionResponse> {
  if (newCommissionPct < 0 || newCommissionPct > 50) {
    return { success: false, error: "Le taux de commission doit être compris entre 0% et 50%" };
  }

  const resto = demoStore.restaurants.find((r) => r.id === restaurantId);
  if (!resto) return { success: false, error: "Restaurant introuvable" };

  resto.commission_pct = Math.round(newCommissionPct * 100) / 100;
  resto.updated_at = new Date().toISOString();

  revalidatePath("/admin/restaurants");
  return { success: true };
}

/**
 * Récupère toutes les commandes pour la supervision globale et les litiges
 */
export async function getAllOrdersForAdmin(): Promise<
  (Order & { restaurantName?: string; clientName?: string })[]
> {
  return demoStore.orders.map((o) => {
    const resto = demoStore.restaurants.find((r) => r.id === o.restaurant_id);
    const client = demoStore.profiles.find((p) => p.id === o.client_id);
    return {
      ...o,
      restaurantName: resto?.nom || "Restaurant",
      clientName: client?.full_name || "Client",
    };
  });
}

/**
 * Annuler ou résoudre un litige sur une commande (Action administrative)
 */
export async function resolveOrderDispute(
  orderId: string,
  decision: "annulee" | "remboursee"
): Promise<ActionResponse> {
  const order = demoStore.orders.find((o) => o.id === orderId);
  if (!order) return { success: false, error: "Commande introuvable" };

  order.statut = "annulee";
  order.updated_at = new Date().toISOString();

  revalidatePath("/admin/orders");
  revalidatePath(`/orders/${orderId}`);

  return { success: true };
}

/**
 * Statistiques et métriques globales de la plateforme SaaS Linki
 */
export async function getGlobalPlatformStats() {
  const totalOrders = demoStore.orders.length;
  let totalGMV = 0;
  let totalCommissions = 0;

  demoStore.orders.forEach((o) => {
    if (o.statut !== "annulee") {
      totalGMV += o.montant_total;
      totalCommissions += o.commission;
    }
  });

  const activeRestaurants = demoStore.restaurants.filter((r) => r.statut === "ouvert").length;
  const activeCouriers = demoStore.profiles.filter(
    (p) => p.role === "livreur" && p.status === "actif"
  ).length;
  const pendingValidations = demoStore.profiles.filter(
    (p) => p.status === "en_attente_validation"
  ).length;

  return {
    totalGMV: Math.round(totalGMV * 100) / 100,
    totalCommissions: Math.round(totalCommissions * 100) / 100,
    totalOrders,
    activeRestaurants,
    activeCouriers,
    pendingValidations,
  };
}
