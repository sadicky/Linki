"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { registerSchema, loginSchema, type RegisterInput, type LoginInput } from "@/lib/validations/auth";
import { demoStore, type Profile, type Restaurant } from "@/lib/mock-data";
import type { ActionResponse } from "@/lib/utils";
import type { UserRole } from "@/lib/supabase/types";

/**
 * Récupère l'utilisateur connecté et son profil avec rôle strict
 */
export async function getCurrentUser(): Promise<Profile | null> {
  const cookieStore = await cookies();
  const demoUserId = cookieStore.get("linki_user_id")?.value;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (profile) return profile;
    }
  } catch {
    // Si Supabase offline ou mock, fallback sur le magasin démo
  }

  if (demoUserId) {
    const profile = demoStore.profiles.find((p) => p.id === demoUserId);
    if (profile) return profile;
  }

  return null;
}

/**
 * Inscription multi-rôles respectant la logique métier :
 * - Client : activé immédiatement (statut 'actif')
 * - Restaurant : requiert validation administrative + création de l'établissement
 * - Livreur : requiert validation administrative
 */
export async function signUp(data: RegisterInput): Promise<ActionResponse<{ profile: Profile; redirectUrl: string }>> {
  const validation = registerSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || "Données d'inscription invalides",
    };
  }

  const { email, password, fullName, phone, role, restaurantName, restaurantAddress } = validation.data;
  const cookieStore = await cookies();

  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone || null,
          role,
          restaurant_name: restaurantName || null,
        },
      },
    });

    if (!authError && authData.user) {
      const status = role === "client" ? "actif" : "en_attente_validation";
      const redirectUrl =
        status === "en_attente_validation"
          ? "/pending-approval"
          : role === "restaurant"
          ? "/dashboard/restaurant"
          : role === "livreur"
          ? "/dashboard/livreur"
          : "/";

      return {
        success: true,
        data: {
          profile: {
            id: authData.user.id,
            role,
            status,
            full_name: fullName,
            phone: phone || null,
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          redirectUrl,
        },
      };
    }
  } catch {
    // Fallback mode démo
  }

  // Création dans le magasin démo local
  const newId = `user-${role}-${Date.now()}`;
  const status = role === "client" ? "actif" : "en_attente_validation";

  const newProfile: Profile = {
    id: newId,
    role,
    status,
    full_name: fullName,
    phone: phone || "+243810000000",
    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  demoStore.profiles.push(newProfile);
  demoStore.activeUserId = newId;

  // Si c'est un restaurateur, on crée son établissement à Lubumbashi
  if (role === "restaurant") {
    const newRestoId = `resto-${Date.now()}`;
    const newResto: Restaurant = {
      id: newRestoId,
      owner_id: newId,
      nom: restaurantName || `Saveurs de ${fullName}`,
      description: "Cuisine lushoise authentique, grillades au feu de bois et spécialités du Katanga.",
      adresse: restaurantAddress || "Boulevard Msiri, Quartier Golf, Lubumbashi",
      lat: -11.6542,
      lng: 27.4695,
      image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
      statut: "ouvert",
      note_moyenne: 5.0,
      commission_pct: 15.0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    demoStore.restaurants.push(newResto);
  }

  cookieStore.set("linki_user_id", newId, { path: "/" });
  cookieStore.set("linki_user_role", role, { path: "/" });

  const redirectUrl =
    status === "en_attente_validation"
      ? "/pending-approval"
      : role === "restaurant"
      ? "/dashboard/restaurant"
      : role === "livreur"
      ? "/dashboard/livreur"
      : "/";

  revalidatePath("/", "layout");
  return {
    success: true,
    data: { profile: newProfile, redirectUrl },
  };
}

/**
 * Connexion professionnelle respectant le rôle de l'utilisateur
 */
export async function signIn(data: LoginInput): Promise<ActionResponse<{ role: UserRole; redirectUrl: string }>> {
  const validation = loginSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || "Identifiants invalides",
    };
  }

  const { email } = validation.data;
  const cookieStore = await cookies();

  // Recherche du profil correspondant (par rôle ou email)
  const normalizedEmail = email.toLowerCase();
  let foundProfile = demoStore.profiles.find((p) => {
    if (normalizedEmail.includes("resto") || normalizedEmail.includes("kalala") || normalizedEmail.includes("chef")) {
      return p.role === "restaurant" && p.status === "actif";
    }
    if (normalizedEmail.includes("livreur") || normalizedEmail.includes("mutombo") || normalizedEmail.includes("coursier")) {
      return p.role === "livreur" && p.status === "actif";
    }
    if (normalizedEmail.includes("admin") || normalizedEmail.includes("sadicky")) {
      return p.role === "admin";
    }
    return p.role === "client";
  });

  if (!foundProfile) {
    foundProfile = demoStore.profiles[0]; // Grace Mavinga par défaut
  }

  demoStore.activeUserId = foundProfile.id;
  cookieStore.set("linki_user_id", foundProfile.id, { path: "/" });
  cookieStore.set("linki_user_role", foundProfile.role, { path: "/" });

  let redirectUrl = "/";
  if (foundProfile.status === "en_attente_validation") {
    redirectUrl = "/pending-approval";
  } else if (foundProfile.role === "restaurant") {
    redirectUrl = "/dashboard/restaurant";
  } else if (foundProfile.role === "livreur") {
    redirectUrl = "/dashboard/livreur";
  } else if (foundProfile.role === "admin") {
    redirectUrl = "/admin";
  }

  revalidatePath("/", "layout");
  return {
    success: true,
    data: { role: foundProfile.role, redirectUrl },
  };
}

/**
 * Déconnexion sécurisée
 */
export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("linki_user_id");
  cookieStore.delete("linki_user_role");

  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Mode démo
  }

  redirect("/login");
}

/**
 * Basculement instantané de rôle pour tester et prévisualiser chaque interface
 */
export async function switchDemoRole(role: UserRole) {
  const cookieStore = await cookies();
  const profile =
    demoStore.profiles.find((p) => p.role === role && p.status === "actif") ||
    demoStore.profiles.find((p) => p.role === role) ||
    demoStore.profiles[0];

  demoStore.activeUserId = profile.id;
  cookieStore.set("linki_user_id", profile.id, { path: "/" });
  cookieStore.set("linki_user_role", profile.role, { path: "/" });

  let targetPath = "/";
  if (profile.role === "restaurant") targetPath = "/dashboard/restaurant";
  if (profile.role === "livreur") targetPath = "/dashboard/livreur";
  if (profile.role === "admin") targetPath = "/admin";

  revalidatePath("/", "layout");
  redirect(targetPath);
}

export interface UserProfileDetails {
  profile: Profile;
  restaurant?: Restaurant | null;
  stats: {
    ordersCount?: number;
    menuItemsCount?: number;
    deliveriesCount?: number;
    totalUsersCount?: number;
  };
  email: string;
}

/**
 * Récupère les données complètes du profil de l'utilisateur connecté
 */
export async function getMyProfileDetails(): Promise<UserProfileDetails | null> {
  let user = await getCurrentUser();

  if (!user) {
    // Si aucun cookie n'est présent, fallback sur le client par défaut pour démo
    user = demoStore.profiles[0];
  }

  if (!user) return null;

  let restaurant: Restaurant | null = null;
  const stats: UserProfileDetails["stats"] = {};

  if (user.role === "restaurant") {
    // Chercher son restaurant
    restaurant = demoStore.restaurants.find((r) => r.owner_id === user.id) || null;
    if (!restaurant) {
      try {
        const supabase = await createClient();
        const { data } = await supabase.from("restaurants").select("*").eq("owner_id", user.id).single();
        if (data) restaurant = data as Restaurant;
      } catch {}
    }
    stats.menuItemsCount = demoStore.menuItems.filter((m) => m.restaurant_id === restaurant?.id).length;
    stats.ordersCount = demoStore.orders.filter((o) => o.restaurant_id === restaurant?.id).length;
  } else if (user.role === "client") {
    stats.ordersCount = demoStore.orders.filter((o) => o.client_id === user.id).length;
  } else if (user.role === "livreur") {
    stats.deliveriesCount = demoStore.orders.filter((o) => o.livreur_id === user.id && o.statut === "livree").length;
  } else if (user.role === "admin") {
    stats.totalUsersCount = demoStore.profiles.length;
  }

  const roleEmails: Record<UserRole, string> = {
    client: "client@linki.cd",
    restaurant: "restaurant@linki.cd",
    livreur: "livreur@linki.cd",
    admin: "admin@linki.cd",
  };

  return {
    profile: user,
    restaurant,
    stats,
    email: roleEmails[user.role] || `${user.role}@linki.cd`,
  };
}

/**
 * Modification des données du profil par l'utilisateur connecté
 */
export async function updateUserProfile(data: {
  full_name: string;
  phone: string;
  avatar_url?: string;
  restaurant_nom?: string;
  restaurant_description?: string;
  restaurant_adresse?: string;
}): Promise<ActionResponse<Profile>> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Vous devez être connecté pour modifier votre profil" };
  }

  if (!data.full_name || data.full_name.trim().length < 2) {
    return { success: false, error: "Le nom complet doit comporter au moins 2 caractères" };
  }

  if (!data.phone || data.phone.trim().length < 6) {
    return { success: false, error: "Numéro de téléphone invalide" };
  }

  const updatedProfile: Profile = {
    ...user,
    full_name: data.full_name.trim(),
    phone: data.phone.trim(),
    avatar_url: data.avatar_url?.trim() || user.avatar_url,
    updated_at: new Date().toISOString(),
  };

  // Mettre à jour dans Supabase si configuré
  try {
    const supabase = await createClient();
    await supabase.from("profiles").update({
      full_name: updatedProfile.full_name,
      phone: updatedProfile.phone,
      avatar_url: updatedProfile.avatar_url,
      updated_at: updatedProfile.updated_at,
    }).eq("id", user.id);
  } catch {}

  // Mettre à jour dans le magasin local démo
  const pIndex = demoStore.profiles.findIndex((p) => p.id === user.id);
  if (pIndex !== -1) {
    demoStore.profiles[pIndex] = updatedProfile;
  }

  // Si c'est un restaurateur et qu'il modifie les données de son restaurant
  if (user.role === "restaurant" && (data.restaurant_nom || data.restaurant_description || data.restaurant_adresse)) {
    const resto = demoStore.restaurants.find((r) => r.owner_id === user.id);
    if (resto) {
      if (data.restaurant_nom) resto.nom = data.restaurant_nom.trim();
      if (data.restaurant_description) resto.description = data.restaurant_description.trim();
      if (data.restaurant_adresse) resto.adresse = data.restaurant_adresse.trim();
      resto.updated_at = new Date().toISOString();

      try {
        const supabase = await createClient();
        await supabase.from("restaurants").update({
          nom: resto.nom,
          description: resto.description,
          adresse: resto.adresse,
          updated_at: resto.updated_at,
        }).eq("id", resto.id);
      } catch {}
    }
  }

  revalidatePath("/", "layout");
  revalidatePath("/profile");

  return {
    success: true,
    data: updatedProfile,
  };
}

