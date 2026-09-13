import { Database, UserRole, AccountStatus, OrderStatus, DeliveryStatus, PaymentMethod, PaymentStatus } from "./supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Restaurant = Database["public"]["Tables"]["restaurants"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type Delivery = Database["public"]["Tables"]["deliveries"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type Payment = Database["public"]["Tables"]["payments"]["Row"];

export const INITIAL_PROFILES: Profile[] = [
  {
    id: "c1111111-1111-4111-8111-111111111111",
    role: "client",
    status: "actif",
    full_name: "Grace Mavinga",
    phone: "+243821234567",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "r2222222-2222-4222-8222-222222222222",
    role: "restaurant",
    status: "actif",
    full_name: "Chef Dieudonné Kalala",
    phone: "+243812345678",
    avatar_url: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "r3333333-3333-4333-8333-333333333333",
    role: "restaurant",
    status: "en_attente_validation",
    full_name: "Maman Antoinette Lukusa",
    phone: "+243893456789",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "l4444444-4444-4444-8444-444444444444",
    role: "livreur",
    status: "actif",
    full_name: "Junior Mutombo (Livreur Lubum)",
    phone: "+243854567890",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "a5555555-5555-4555-8555-555555555555",
    role: "admin",
    status: "actif",
    full_name: "Sadicky Dave (Super Admin)",
    phone: "+243800000000",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: "b0000001-0000-4000-8000-000000000001",
    owner_id: "r2222222-2222-4222-8222-222222222222",
    nom: "Le Cercle du Golf & Grillades de Lubumbashi",
    description: "Le temple du T-Bone katangais grillé au feu de bois, Poulet Bicyclette mariné et brochettes tendres.",
    adresse: "Boulevard Msiri, Quartier Golf, Lubumbashi",
    lat: -11.6542,
    lng: 27.4695,
    image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
    statut: "ouvert",
    note_moyenne: 4.95,
    commission_pct: 15.0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "b0000002-0000-4000-8000-000000000002",
    owner_id: "r2222222-2222-4222-8222-222222222222",
    nom: "Katanga Saveurs & Bukari Terroir",
    description: "Authentique cuisine lushoise : Bukari ya Semoule blanc, Poisson frais du Lac Moero braisé et légumes du terroir.",
    adresse: "Avenue Kasa-Vubu, Commune de Kamalondo, Lubumbashi",
    lat: -11.6725,
    lng: 27.4812,
    image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
    statut: "ouvert",
    note_moyenne: 4.85,
    commission_pct: 12.5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "b0000003-0000-4000-8000-000000000003",
    owner_id: "r3333333-3333-4333-8333-333333333333",
    nom: "Le Chalet Kipopo & Délices Cuivrés",
    description: "Gastronomie raffinée au bord de l'eau, Capitaine braisé au piment vert, Makayabu et jus de bissap glacés.",
    adresse: "Chaussée Laurent Désiré Kabila, Centre-ville, Lubumbashi",
    lat: -11.661,
    lng: 27.478,
    image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    statut: "ouvert",
    note_moyenne: 4.9,
    commission_pct: 15.0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: "c0000001-0000-4000-8000-000000000001",
    restaurant_id: "b0000001-0000-4000-8000-000000000001",
    nom: "Grillades au Feu de Bois",
    ordre: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "c0000002-0000-4000-8000-000000000001",
    restaurant_id: "b0000001-0000-4000-8000-000000000001",
    nom: "Spécialités de Lubumbashi",
    ordre: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "c0000003-0000-4000-8000-000000000001",
    restaurant_id: "b0000001-0000-4000-8000-000000000001",
    nom: "Accompagnements du Katanga",
    ordre: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "c0000004-0000-4000-8000-000000000002",
    restaurant_id: "b0000002-0000-4000-8000-000000000002",
    nom: "Bukari & Poissons du Terroir",
    ordre: 1,
    created_at: new Date().toISOString(),
  },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: "m0000001-0000-4000-8000-000000000001",
    restaurant_id: "b0000001-0000-4000-8000-000000000001",
    category_id: "c0000001-0000-4000-8000-000000000001",
    nom: "T-Bone Katangais Signature (500g)",
    description: "Bœuf sélectionné du Haut-Katanga braisé à la perfection, assaisonné aux épices locales et servi avec sauce barbecue maison.",
    prix: 42000,
    image_url: "https://images.unsplash.com/photo-1558030006-450675393462?w=600",
    disponible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "m0000002-0000-4000-8000-000000000002",
    restaurant_id: "b0000001-0000-4000-8000-000000000001",
    category_id: "c0000001-0000-4000-8000-000000000001",
    nom: "Poulet Bicyclette Mariné & Fumé",
    description: "Poulet fermier local tendre, grillé au charbon de bois, mariné au gingembre, ail et piment doux.",
    prix: 38000,
    image_url: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600",
    disponible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "m0000003-0000-4000-8000-000000000003",
    restaurant_id: "b0000001-0000-4000-8000-000000000001",
    category_id: "c0000002-0000-4000-8000-000000000001",
    nom: "Brochettes de Bœuf Tendres (5 pcs)",
    description: "Brochettes marinées aux herbes du Katanga, oignons doux et poivrons frais.",
    prix: 20000,
    image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600",
    disponible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "m0000004-0000-4000-8000-000000000004",
    restaurant_id: "b0000001-0000-4000-8000-000000000001",
    category_id: "c0000003-0000-4000-8000-000000000001",
    nom: "Bananes Plantains Alloco Dorées",
    description: "Bananes plantains mûres frites à point, croustillantes et fondantes.",
    prix: 8000,
    image_url: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600",
    disponible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "m0000005-0000-4000-8000-000000000005",
    restaurant_id: "b0000001-0000-4000-8000-000000000001",
    category_id: "c0000003-0000-4000-8000-000000000001",
    nom: "Frites Fraîches Croustillantes",
    description: "Pommes de terre fraîches coupées maison, dorées à l'huile végétale.",
    prix: 7000,
    image_url: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600",
    disponible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "m0000006-0000-4000-8000-000000000006",
    restaurant_id: "b0000002-0000-4000-8000-000000000002",
    category_id: "c0000004-0000-4000-8000-000000000002",
    nom: "Poisson Frais du Lac Moero Braisé",
    description: "Poisson entier pêché frais, mariné à l'étouffée et grillé minute, accompagné de Bukari fumant.",
    prix: 45000,
    image_url: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600",
    disponible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "m0000007-0000-4000-8000-000000000007",
    restaurant_id: "b0000002-0000-4000-8000-000000000002",
    category_id: "c0000004-0000-4000-8000-000000000002",
    nom: "Portion de Bukari Chaud de Semoule Blanche",
    description: "Bukari traditionnel préparé avec de la farine de maïs blanc de première qualité.",
    prix: 5000,
    image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
    disponible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const INITIAL_ORDERS: (Order & { items: OrderItem[]; restaurant?: Restaurant })[] = [
  {
    id: "ord-lsh-001",
    client_id: "c1111111-1111-4111-8111-111111111111",
    restaurant_id: "b0000001-0000-4000-8000-000000000001",
    livreur_id: "l4444444-4444-4444-8444-444444444444",
    statut: "en_livraison",
    adresse_livraison: "Boulevard Msiri, Quartier Golf, Lubumbashi",
    lat: -11.656,
    lng: 27.472,
    montant_total: 82500,
    commission: 12000,
    frais_livraison: 3500,
    pourboire_livreur: 2500,
    code_pin: "4821",
    instructions_livraison: "À la barrière du Golf Faustin, portail blanc",
    notes: "Sauce piment doux à part s'il vous plaît",
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
    updated_at: new Date().toISOString(),
    items: [
      {
        id: "oi-1",
        order_id: "ord-lsh-001",
        menu_item_id: "m0000001-0000-4000-8000-000000000001",
        quantite: 1,
        prix_unitaire: 42000,
        notes: "Cuisson à point",
      },
      {
        id: "oi-2",
        order_id: "ord-lsh-001",
        menu_item_id: "m0000002-0000-4000-8000-000000000002",
        quantite: 1,
        prix_unitaire: 38000,
        notes: null,
      },
    ],
  },
  {
    id: "ord-lsh-002",
    client_id: "c1111111-1111-4111-8111-111111111111",
    restaurant_id: "b0000001-0000-4000-8000-000000000001",
    livreur_id: null,
    statut: "prete",
    adresse_livraison: "Avenue Kasa-Vubu, Kamalondo, Lubumbashi",
    lat: -11.67,
    lng: 27.48,
    montant_total: 28500,
    commission: 3000,
    frais_livraison: 3500,
    pourboire_livreur: 1000,
    code_pin: "9134",
    instructions_livraison: "En face de la station Total",
    notes: null,
    created_at: new Date(Date.now() - 22 * 60000).toISOString(),
    updated_at: new Date().toISOString(),
    items: [
      {
        id: "oi-3",
        order_id: "ord-lsh-002",
        menu_item_id: "m0000003-0000-4000-8000-000000000003",
        quantite: 1,
        prix_unitaire: 20000,
        notes: null,
      },
      {
        id: "oi-4",
        order_id: "ord-lsh-002",
        menu_item_id: "m0000005-0000-4000-8000-000000000005",
        quantite: 1,
        prix_unitaire: 7000,
        notes: null,
      },
    ],
  },
];

export const INITIAL_DELIVERIES: Delivery[] = [
  {
    id: "del-001",
    order_id: "ord-lsh-001",
    livreur_id: "l4444444-4444-4444-8444-444444444444",
    position_actuelle_lat: -11.655,
    position_actuelle_lng: 27.471,
    statut: "en_route_client",
    heure_recuperation: new Date(Date.now() - 10 * 60000).toISOString(),
    heure_livraison: null,
    updated_at: new Date().toISOString(),
  },
];

export const INITIAL_REVIEWS: Review[] = [];

// Magasin réactif en mémoire partagé avec persistance
class DemoStore {
  profiles: Profile[] = [...INITIAL_PROFILES];
  restaurants: Restaurant[] = [...INITIAL_RESTAURANTS];
  categories: Category[] = [...INITIAL_CATEGORIES];
  menuItems: MenuItem[] = [...INITIAL_MENU_ITEMS];
  orders: (Order & { items: OrderItem[]; restaurant?: Restaurant })[] = [...INITIAL_ORDERS];
  deliveries: Delivery[] = [...INITIAL_DELIVERIES];
  reviews: Review[] = [...INITIAL_REVIEWS];
  activeUserId: string = INITIAL_PROFILES[0].id;
}

const globalForStore = globalThis as unknown as { demoStore?: DemoStore };
export const demoStore = globalForStore.demoStore ?? new DemoStore();
if (process.env.NODE_ENV !== "production") globalForStore.demoStore = demoStore;
