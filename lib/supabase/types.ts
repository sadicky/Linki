export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "client" | "restaurant" | "livreur" | "admin";
export type AccountStatus = "en_attente_validation" | "actif" | "suspendu";
export type RestaurantStatus = "ouvert" | "ferme";
export type OrderStatus =
  | "en_attente"
  | "acceptee"
  | "en_preparation"
  | "prete"
  | "en_livraison"
  | "livree"
  | "annulee";
export type DeliveryStatus =
  | "assignee"
  | "en_route_restaurant"
  | "recuperee"
  | "en_route_client"
  | "livree";
export type PaymentMethod = "mpesa" | "airtel_money" | "orange_money" | "afrimoney";
export type PaymentStatus = "en_attente" | "reussi" | "echoue" | "rembourse";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          status: AccountStatus;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          status?: AccountStatus;
          full_name: string;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          status?: AccountStatus;
          full_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      restaurants: {
        Row: {
          id: string;
          owner_id: string;
          nom: string;
          description: string | null;
          adresse: string;
          lat: number;
          lng: number;
          image_url: string | null;
          statut: RestaurantStatus;
          note_moyenne: number;
          commission_pct: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          nom: string;
          description?: string | null;
          adresse: string;
          lat: number;
          lng: number;
          image_url?: string | null;
          statut?: RestaurantStatus;
          note_moyenne?: number;
          commission_pct?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          nom?: string;
          description?: string | null;
          adresse?: string;
          lat?: number;
          lng?: number;
          image_url?: string | null;
          statut?: RestaurantStatus;
          note_moyenne?: number;
          commission_pct?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          restaurant_id: string;
          nom: string;
          ordre: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          nom: string;
          ordre?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          nom?: string;
          ordre?: number;
          created_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          restaurant_id: string;
          category_id: string | null;
          nom: string;
          description: string | null;
          prix: number;
          image_url: string | null;
          disponible: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          category_id?: string | null;
          nom: string;
          description?: string | null;
          prix: number;
          image_url?: string | null;
          disponible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          category_id?: string | null;
          nom?: string;
          description?: string | null;
          prix?: number;
          image_url?: string | null;
          disponible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          client_id: string;
          restaurant_id: string;
          livreur_id: string | null;
          statut: OrderStatus;
          adresse_livraison: string;
          lat: number;
          lng: number;
          montant_total: number;
          commission: number;
          frais_livraison: number;
          pourboire_livreur: number;
          code_pin: string;
          instructions_livraison: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          restaurant_id: string;
          livreur_id?: string | null;
          statut?: OrderStatus;
          adresse_livraison: string;
          lat: number;
          lng: number;
          montant_total: number;
          commission?: number;
          frais_livraison?: number;
          pourboire_livreur?: number;
          code_pin?: string;
          instructions_livraison?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          restaurant_id?: string;
          livreur_id?: string | null;
          statut?: OrderStatus;
          adresse_livraison?: string;
          lat?: number;
          lng?: number;
          montant_total?: number;
          commission?: number;
          frais_livraison?: number;
          pourboire_livreur?: number;
          code_pin?: string;
          instructions_livraison?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          menu_item_id: string | null;
          quantite: number;
          prix_unitaire: number;
          notes: string | null;
        };
        Insert: {
          id?: string;
          order_id: string;
          menu_item_id?: string | null;
          quantite?: number;
          prix_unitaire: number;
          notes?: string | null;
        };
        Update: {
          id?: string;
          order_id?: string;
          menu_item_id?: string | null;
          quantite?: number;
          prix_unitaire?: number;
          notes?: string | null;
        };
      };
      deliveries: {
        Row: {
          id: string;
          order_id: string;
          livreur_id: string;
          position_actuelle_lat: number | null;
          position_actuelle_lng: number | null;
          statut: DeliveryStatus;
          heure_recuperation: string | null;
          heure_livraison: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          livreur_id: string;
          position_actuelle_lat?: number | null;
          position_actuelle_lng?: number | null;
          statut?: DeliveryStatus;
          heure_recuperation?: string | null;
          heure_livraison?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          livreur_id?: string;
          position_actuelle_lat?: number | null;
          position_actuelle_lng?: number | null;
          statut?: DeliveryStatus;
          heure_recuperation?: string | null;
          heure_livraison?: string | null;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          order_id: string;
          client_id: string;
          restaurant_id: string;
          note: number;
          commentaire: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          client_id: string;
          restaurant_id: string;
          note: number;
          commentaire?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          client_id?: string;
          restaurant_id?: string;
          note?: number;
          commentaire?: string | null;
          created_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          order_id: string;
          methode: PaymentMethod;
          reference_transaction: string;
          telephone_client: string;
          stripe_payment_intent_id: string | null;
          statut: PaymentStatus;
          montant: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          methode?: PaymentMethod;
          reference_transaction: string;
          telephone_client: string;
          stripe_payment_intent_id?: string | null;
          statut?: PaymentStatus;
          montant: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          methode?: PaymentMethod;
          reference_transaction?: string;
          telephone_client?: string;
          stripe_payment_intent_id?: string | null;
          statut?: PaymentStatus;
          montant?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      current_user_role: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_restaurant_owner: {
        Args: { restaurant_uuid: string };
        Returns: boolean;
      };
    };
  };
}
