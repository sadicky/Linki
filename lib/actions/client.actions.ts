"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth.actions";
import { createOrderSchema, reviewSchema, type CreateOrderInput, type ReviewInput } from "@/lib/validations/order";
import { demoStore, type Order, type Restaurant } from "@/lib/mock-data";
import { generateDeliveryPin, type ActionResponse } from "@/lib/utils";
import { createClient, createAdminClient } from "@/lib/supabase/server";

/**
 * Récupération des restaurants avec filtres de recherche à Lubumbashi
 */
export async function getRestaurants(filters?: {
  search?: string;
  sortBy?: "note" | "distance" | "commission";
}): Promise<Restaurant[]> {
  // Essayer Supabase si disponible
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("restaurants").select("*");
    if (data && data.length > 0) {
      let list = data as Restaurant[];
      if (filters?.search) {
        const query = filters.search.toLowerCase();
        list = list.filter(
          (r) =>
            r.nom.toLowerCase().includes(query) ||
            r.description?.toLowerCase().includes(query) ||
            r.adresse.toLowerCase().includes(query)
        );
      }
      if (filters?.sortBy === "note") {
        list.sort((a, b) => b.note_moyenne - a.note_moyenne);
      }
      return list;
    }
  } catch {
    // Fallback local
  }

  let list = [...demoStore.restaurants];

  if (filters?.search) {
    const query = filters.search.toLowerCase();
    list = list.filter(
      (r) =>
        r.nom.toLowerCase().includes(query) ||
        r.description?.toLowerCase().includes(query) ||
        r.adresse.toLowerCase().includes(query)
    );
  }

  if (filters?.sortBy === "note") {
    list.sort((a, b) => b.note_moyenne - a.note_moyenne);
  }

  return list;
}

/**
 * Récupération d'un restaurant avec ses catégories et ses plats
 */
export async function getRestaurantById(id: string) {
  // Essayer Supabase si disponible
  try {
    const supabase = await createClient();
    const { data: resto } = await supabase.from("restaurants").select("*").eq("id", id).single();
    if (resto) {
      const { data: categories } = await supabase
        .from("categories")
        .select("*")
        .eq("restaurant_id", id)
        .order("ordre");
      const { data: menuItems } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", id);
      return {
        ...(resto as Restaurant),
        categories: categories || [],
        menuItems: menuItems || [],
      };
    }
  } catch {
    // Fallback local
  }

  const restaurant = demoStore.restaurants.find((r) => r.id === id);
  if (!restaurant) return null;

  const categories = demoStore.categories.filter((c) => c.restaurant_id === id);
  const menuItems = demoStore.menuItems.filter((m) => m.restaurant_id === id);

  return {
    ...restaurant,
    categories,
    menuItems,
  };
}

/**
 * Création d'une commande (Logique métier STRICTEMENT côté serveur)
 */
export async function createOrder(
  data: CreateOrderInput
): Promise<ActionResponse<{ orderId: string; total: number; codePin: string }>> {
  const validation = createOrderSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || "Données de commande invalides",
    };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Vous devez être connecté pour commander" };
  }

  const {
    restaurant_id,
    adresse_livraison,
    lat,
    lng,
    items,
    notes,
    pourboire_livreur = 0,
    instructions_livraison,
  } = validation.data;

  // Vérifier le restaurant
  const restaurant = demoStore.restaurants.find((r) => r.id === restaurant_id);
  if (!restaurant) {
    return { success: false, error: "Restaurant introuvable" };
  }

  if (restaurant.statut !== "ouvert") {
    return { success: false, error: "Ce restaurant est actuellement fermé" };
  }

  // Calcul du sous-total basé sur les prix vérifiés côté serveur
  let subtotal = 0;
  const verifiedItems = items.map((item) => {
    const originalItem = demoStore.menuItems.find((m) => m.id === item.menu_item_id);
    const unitPrice = originalItem ? originalItem.prix : item.prix_unitaire;
    subtotal += unitPrice * item.quantite;

    return {
      id: "item-" + Math.random().toString(36).substring(2, 9),
      order_id: "",
      menu_item_id: item.menu_item_id,
      quantite: item.quantite,
      prix_unitaire: unitPrice,
      notes: item.notes || null,
    };
  });

  const fraisLivraison = 3500; // Frais de livraison standard à Lubumbashi
  const montantTotal = subtotal + fraisLivraison + pourboire_livreur;

  // Calcul de la commission Linki (ex: 15% du sous-total)
  const commissionPct = restaurant.commission_pct || 15.0;
  const commission = Math.round((subtotal * commissionPct) / 100);

  const orderId = "ord-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
  const pinCode = generateDeliveryPin();

  // Mettre à jour l'order_id dans les items
  verifiedItems.forEach((it) => (it.order_id = orderId));

  const newOrder: Order & { items: typeof verifiedItems } = {
    id: orderId,
    client_id: user.id,
    restaurant_id,
    livreur_id: null,
    statut: "en_attente",
    adresse_livraison,
    lat,
    lng,
    montant_total: montantTotal,
    commission,
    frais_livraison: fraisLivraison,
    pourboire_livreur,
    code_pin: pinCode,
    instructions_livraison: instructions_livraison || null,
    notes: notes || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    items: verifiedItems,
  };

  // Tenter l'insertion Supabase si configuré
  try {
    const supabase = createAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;
    await db.from("orders").insert({
      id: orderId,
      client_id: user.id,
      restaurant_id,
      statut: "en_attente",
      adresse_livraison,
      lat,
      lng,
      montant_total: montantTotal,
      commission,
      frais_livraison: fraisLivraison,
      pourboire_livreur,
      code_pin: pinCode,
      instructions_livraison: instructions_livraison || null,
      notes: notes || null,
    });
  } catch {
    // Fallback silencieux
  }

  demoStore.orders.unshift(newOrder);

  revalidatePath("/");
  revalidatePath("/orders");
  revalidatePath("/dashboard/restaurant/orders");

  return {
    success: true,
    data: { orderId, total: montantTotal, codePin: pinCode },
  };
}

/**
 * Récupère les commandes du client connecté
 */
export async function getClientOrders() {
  const user = await getCurrentUser();
  if (!user) return [];

  const orders = demoStore.orders.filter((o) => o.client_id === user.id);
  return orders.map((o) => {
    const restaurant = demoStore.restaurants.find((r) => r.id === o.restaurant_id);
    return {
      ...o,
      restaurant,
    };
  });
}

/**
 * Récupère le détail d'une commande pour le suivi en direct
 */
export async function getOrderTrackingDetails(orderId: string) {
  const order = demoStore.orders.find((o) => o.id === orderId);
  if (!order) return null;

  const restaurant = demoStore.restaurants.find((r) => r.id === order.restaurant_id);
  const delivery = demoStore.deliveries.find((d) => d.order_id === orderId);
  const livreur = delivery
    ? demoStore.profiles.find((p) => p.id === delivery.livreur_id)
    : null;

  return {
    order,
    restaurant,
    delivery,
    livreur,
  };
}

/**
 * Laisser un avis après livraison
 */
export async function submitOrderReview(data: ReviewInput): Promise<ActionResponse> {
  const validation = reviewSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0]?.message };
  }

  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Non connecté" };

  const { order_id, restaurant_id, note, commentaire } = validation.data;

  // Vérifier que la commande est bien livrée
  const order = demoStore.orders.find((o) => o.id === order_id);
  if (!order || order.statut !== "livree") {
    return { success: false, error: "Vous ne pouvez noter qu'une commande livrée" };
  }

  demoStore.reviews.push({
    id: "rev-" + Date.now(),
    order_id,
    client_id: user.id,
    restaurant_id,
    note,
    commentaire: commentaire || null,
    created_at: new Date().toISOString(),
  });

  // Calculer la nouvelle note moyenne du restaurant
  const restoReviews = demoStore.reviews.filter((r) => r.restaurant_id === restaurant_id);
  const sum = restoReviews.reduce((acc, curr) => acc + curr.note, 0);
  const avg = Math.round((sum / restoReviews.length) * 100) / 100;

  const resto = demoStore.restaurants.find((r) => r.id === restaurant_id);
  if (resto) resto.note_moyenne = avg;

  revalidatePath(`/restaurants/${restaurant_id}`);
  revalidatePath(`/orders/${order_id}`);

  return { success: true };
}
