import { z } from "zod";

export const orderItemInputSchema = z.object({
  menu_item_id: z.string().uuid("ID de plat invalide"),
  nom: z.string(),
  quantite: z.number().int().positive("La quantité doit être supérieure à 0"),
  prix_unitaire: z.number().nonnegative(),
  notes: z.string().optional().nullable(),
});

export const createOrderSchema = z.object({
  restaurant_id: z.string().uuid("ID de restaurant invalide"),
  adresse_livraison: z.string().min(5, "L'adresse de livraison est requise"),
  lat: z.number(),
  lng: z.number(),
  items: z.array(orderItemInputSchema).min(1, "Le panier doit contenir au moins un plat"),
  notes: z.string().optional().nullable(),
  pourboire_livreur: z.number().int().nonnegative().optional().default(0),
  code_pin: z.string().length(4).optional(),
  instructions_livraison: z.string().optional().nullable(),
});

export const updateOrderStatusSchema = z.object({
  order_id: z.string().uuid(),
  statut: z.enum([
    "en_attente",
    "acceptee",
    "en_preparation",
    "prete",
    "en_livraison",
    "livree",
    "annulee",
  ]),
});

export const reviewSchema = z.object({
  order_id: z.string().uuid(),
  restaurant_id: z.string().uuid(),
  note: z.number().int().min(1).max(5),
  commentaire: z.string().optional().nullable(),
});

export type OrderItemInput = z.infer<typeof orderItemInputSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
