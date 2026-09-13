import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  fullName: z.string().min(2, "Le nom complet doit contenir au moins 2 caractères"),
  phone: z.string().min(8, "Numéro de téléphone invalide").optional().or(z.literal("")),
  role: z.enum(["client", "restaurant", "livreur"], {
    errorMap: () => ({ message: "Rôle invalide" }),
  }),
  restaurantName: z.string().optional(),
  restaurantAddress: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Veuillez saisir votre mot de passe"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
