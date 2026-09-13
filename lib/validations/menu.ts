import { z } from "zod";

export const categorySchema = z.object({
  nom: z.string().min(2, "Le nom de la catégorie doit comporter au moins 2 caractères"),
  ordre: z.number().int().default(0),
  restaurant_id: z.string().uuid("Identifiant de restaurant invalide"),
});

export const menuItemSchema = z.object({
  id: z.string().uuid().optional(),
  restaurant_id: z.string().uuid("Identifiant de restaurant invalide"),
  category_id: z.string().uuid().nullable().optional(),
  nom: z.string().min(2, "Le nom du plat doit comporter au moins 2 caractères"),
  description: z.string().optional().nullable(),
  prix: z.number().positive("Le prix doit être supérieur à zéro"),
  image_url: z.string().url("URL d'image invalide").optional().nullable().or(z.literal("")),
  disponible: z.boolean().default(true),
});

export type CategoryInput = z.infer<typeof categorySchema>;
export type MenuItemInput = z.infer<typeof menuItemSchema>;
