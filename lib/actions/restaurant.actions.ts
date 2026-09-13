"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth.actions";
import { categorySchema, menuItemSchema, type CategoryInput, type MenuItemInput } from "@/lib/validations/menu";
import { updateOrderStatusSchema, type UpdateOrderStatusInput } from "@/lib/validations/order";
import { demoStore, type MenuItem, type Category, type Order } from "@/lib/mock-data";
import type { ActionResponse } from "@/lib/utils";
import type { OrderStatus } from "@/lib/supabase/types";

/**
 * Récupère le restaurant appartenant à l'utilisateur connecté
 */
export async function getCurrentRestaurant() {
  const user = await getCurrentUser();
  if (!user) return null;

  const restaurant = demoStore.restaurants.find((r) => r.owner_id === user.id) || demoStore.restaurants[0];
  return restaurant;
}

/**
 * Récupère les catégories et les plats pour le restaurant
 */
export async function getRestaurantMenu() {
  const resto = await getCurrentRestaurant();
  if (!resto) return { categories: [], menuItems: [], restaurant: null };

  const categories = demoStore.categories.filter((c) => c.restaurant_id === resto.id);
  const menuItems = demoStore.menuItems.filter((m) => m.restaurant_id === resto.id);

  return { categories, menuItems, restaurant: resto };
}

/**
 * Enregistrer (créer ou modifier) une catégorie
 */
export async function saveCategory(data: CategoryInput): Promise<ActionResponse<Category>> {
  const validation = categorySchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0]?.message };
  }

  const { nom, ordre, restaurant_id } = validation.data;
  const newCat: Category = {
    id: "cat-" + Date.now(),
    restaurant_id,
    nom,
    ordre,
    created_at: new Date().toISOString(),
  };

  demoStore.categories.push(newCat);
  revalidatePath("/dashboard/restaurant/menu");
  return { success: true, data: newCat };
}

/**
 * Supprimer une catégorie
 */
export async function deleteCategory(categoryId: string): Promise<ActionResponse> {
  demoStore.categories = demoStore.categories.filter((c) => c.id !== categoryId);
  revalidatePath("/dashboard/restaurant/menu");
  return { success: true };
}

/**
 * Enregistrer (créer ou modifier) un plat du menu
 */
export async function saveMenuItem(data: MenuItemInput): Promise<ActionResponse<MenuItem>> {
  const validation = menuItemSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0]?.message };
  }

  const { id, restaurant_id, category_id, nom, description, prix, image_url, disponible } =
    validation.data;

  if (id) {
    // Modification
    const index = demoStore.menuItems.findIndex((m) => m.id === id);
    if (index !== -1) {
      demoStore.menuItems[index] = {
        ...demoStore.menuItems[index],
        nom,
        description: description || null,
        prix,
        image_url: image_url || null,
        disponible,
        category_id: category_id || null,
        updated_at: new Date().toISOString(),
      };
      revalidatePath("/dashboard/restaurant/menu");
      return { success: true, data: demoStore.menuItems[index] };
    }
  }

  // Création
  const newItem: MenuItem = {
    id: "item-" + Date.now(),
    restaurant_id,
    category_id: category_id || null,
    nom,
    description: description || null,
    prix,
    image_url: image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
    disponible: disponible ?? true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  demoStore.menuItems.push(newItem);
  revalidatePath("/dashboard/restaurant/menu");
  return { success: true, data: newItem };
}

/**
 * Basculer la disponibilité immédiate d'un plat (En stock / Rupture)
 */
export async function toggleMenuItemAvailability(
  itemId: string,
  disponible: boolean
): Promise<ActionResponse> {
  const item = demoStore.menuItems.find((m) => m.id === itemId);
  if (item) {
    item.disponible = disponible;
    revalidatePath("/dashboard/restaurant/menu");
    return { success: true };
  }
  return { success: false, error: "Plat introuvable" };
}

/**
 * Supprimer un plat
 */
export async function deleteMenuItem(itemId: string): Promise<ActionResponse> {
  demoStore.menuItems = demoStore.menuItems.filter((m) => m.id !== itemId);
  revalidatePath("/dashboard/restaurant/menu");
  return { success: true };
}

/**
 * Récupère les commandes du restaurant (en direct et passées)
 */
export async function getRestaurantOrders() {
  const resto = await getCurrentRestaurant();
  if (!resto) return [];

  const orders = demoStore.orders.filter((o) => o.restaurant_id === resto.id);
  return orders;
}

/**
 * Changement de statut d'une commande par le restaurant
 */
export async function updateRestaurantOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Promise<ActionResponse> {
  const order = demoStore.orders.find((o) => o.id === orderId);
  if (!order) {
    return { success: false, error: "Commande introuvable" };
  }

  // Machine à états autorisée pour le restaurant
  const allowedTransitions: Record<string, OrderStatus[]> = {
    en_attente: ["acceptee", "annulee"],
    acceptee: ["en_preparation", "annulee"],
    en_preparation: ["prete", "annulee"],
    prete: ["annulee"], // après c'est le livreur qui prend la main
  };

  if (allowedTransitions[order.statut] && !allowedTransitions[order.statut].includes(newStatus)) {
    return {
      success: false,
      error: `Transition de statut invalide : impossible de passer de "${order.statut}" à "${newStatus}"`,
    };
  }

  order.statut = newStatus;
  order.updated_at = new Date().toISOString();

  revalidatePath("/dashboard/restaurant/orders");
  revalidatePath(`/orders/${orderId}`);

  return { success: true };
}

/**
 * Statistiques de revenus et ventes du restaurant
 */
export async function getRestaurantStats() {
  const resto = await getCurrentRestaurant();
  if (!resto) {
    return {
      revenueToday: 0,
      revenueWeek: 0,
      totalOrders: 0,
      netPayout: 0,
      topDishes: [],
    };
  }

  const restoOrders = demoStore.orders.filter(
    (o) => o.restaurant_id === resto.id && o.statut !== "annulee"
  );

  let revenueTotal = 0;
  let commissionTotal = 0;
  const dishSalesMap: Record<string, { nom: string; count: number; revenue: number }> = {};

  restoOrders.forEach((o) => {
    // Calcul hors frais de livraison pour le restaurant
    const foodAmount = o.montant_total - o.frais_livraison;
    revenueTotal += foodAmount;
    commissionTotal += o.commission;

    o.items?.forEach((item) => {
      if (!dishSalesMap[item.menu_item_id || ""]) {
        const menuItem = demoStore.menuItems.find((m) => m.id === item.menu_item_id);
        dishSalesMap[item.menu_item_id || ""] = {
          nom: menuItem?.nom || "Plat",
          count: 0,
          revenue: 0,
        };
      }
      dishSalesMap[item.menu_item_id || ""].count += item.quantite;
      dishSalesMap[item.menu_item_id || ""].revenue += item.prix_unitaire * item.quantite;
    });
  });

  const netPayout = Math.max(0, revenueTotal - commissionTotal);
  const topDishes = Object.values(dishSalesMap).sort((a, b) => b.count - a.count).slice(0, 5);

  return {
    revenueToday: Math.round(revenueTotal * 0.4 * 100) / 100, // Démo simulée
    revenueWeek: Math.round(revenueTotal * 100) / 100,
    totalOrders: restoOrders.length,
    netPayout: Math.round(netPayout * 100) / 100,
    topDishes,
    commissionPct: resto.commission_pct,
  };
}
