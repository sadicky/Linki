import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate un montant en Franc Congolais (CDF / FC)
 * Exemple: 25000 -> "25 000 FC"
 */
export function formatPrice(price: number): string {
  const formatted = new Intl.NumberFormat("fr-CD", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(price));

  return `${formatted} FC`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-CD", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Calcul de la distance à vol d'oiseau entre deux coordonnées GPS (formule de Haversine)
 * @returns distance en kilomètres
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

/**
 * Estimation du temps de livraison en minutes adapté au trafic de Lubumbashi (Haut-Katanga)
 */
export function estimateDeliveryMinutes(distanceKm: number): number {
  const prepTime = 18; // 18 min de cuisson & emballage en cuisine
  const travelTime = Math.round(distanceKm * 4); // Déplacement moto sur Boulevard Msiri / Chaussée Kabila
  return Math.max(20, prepTime + travelTime);
}

export type MobileMoneyProvider = "mpesa" | "airtel" | "orange" | "afrimoney";

/**
 * Détection automatique de l'opérateur Mobile Money selon le préfixe congolais
 */
export function detectMobileMoneyProvider(phone: string): MobileMoneyProvider | null {
  // Nettoyer le numéro pour ne garder que les chiffres
  const cleaned = phone.replace(/\D/g, "");

  // Si commence par l'indicatif RDC 243, l'extraire
  let localPart = cleaned;
  if (cleaned.startsWith("243") && cleaned.length >= 5) {
    localPart = cleaned.slice(3);
  } else if (cleaned.startsWith("0") && cleaned.length >= 3) {
    localPart = cleaned.slice(1);
  }

  const prefix2 = localPart.slice(0, 2); // Ex: "81", "82", "97", "84"

  // Vodacom M-Pesa : 81, 82, 83
  if (["81", "82", "83"].includes(prefix2)) return "mpesa";

  // Airtel Money : 97, 98, 99
  if (["97", "98", "99"].includes(prefix2)) return "airtel";

  // Orange Money : 84, 85, 89, 80
  if (["84", "85", "89", "80"].includes(prefix2)) return "orange";

  // Afrimoney : 90, 91
  if (["90", "91"].includes(prefix2)) return "afrimoney";

  return null;
}

/**
 * Génère un code PIN sécurisé à 4 chiffres pour la remise de commande (style UberEats)
 */
export function generateDeliveryPin(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * Communes officielles et quartiers clés de Lubumbashi (Haut-Katanga)
 */
export const LUBUMBASHI_COMMUNES = [
  "Commune de Lubumbashi (Centre-ville)",
  "Commune de Lubumbashi (Quartier Golf)",
  "Commune de Kampemba (Bel-Air)",
  "Commune de Kamalondo",
  "Commune de la Kenya",
  "Commune de Katuba",
  "Commune de Ruashi",
  "Commune Annexe (Kalebuka)",
  "Commune Annexe (Kisanga)",
] as const;

export type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

