-- ==============================================================================
-- LINKI FOOD DELIVERY SAAS - LUBUMBASHI (HAUT-KATANGA, RDC)
-- Script de migration complet pour Supabase en ligne
-- Inclut : Extensions, Types, Tables, RLS, Fonctions, Triggers et Seed Data
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS & TYPES
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('client', 'restaurant', 'livreur', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.account_status AS ENUM ('en_attente_validation', 'actif', 'suspendu');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.restaurant_status AS ENUM ('ouvert', 'ferme');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.order_status AS ENUM (
        'en_attente',
        'acceptee',
        'en_preparation',
        'prete',
        'en_livraison',
        'livree',
        'annulee'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.delivery_status AS ENUM (
        'assignee',
        'en_route_restaurant',
        'recuperee',
        'en_route_client',
        'livree'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.payment_method AS ENUM ('mpesa', 'airtel_money', 'orange_money', 'afrimoney');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.payment_status AS ENUM ('en_attente', 'reussi', 'echoue', 'rembourse');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. TABLES

-- Table Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.user_role NOT NULL DEFAULT 'client',
    status public.account_status NOT NULL DEFAULT 'actif',
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table Restaurants
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    nom TEXT NOT NULL,
    description TEXT,
    adresse TEXT NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    image_url TEXT,
    statut public.restaurant_status NOT NULL DEFAULT 'ouvert',
    note_moyenne NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    commission_pct NUMERIC(4, 2) NOT NULL DEFAULT 15.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table Categories
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    nom TEXT NOT NULL,
    ordre INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table Menu Items
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    nom TEXT NOT NULL,
    description TEXT,
    prix INTEGER NOT NULL CHECK (prix >= 0), -- Montants stockés en Francs Congolais (CDF)
    image_url TEXT,
    disponible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table Orders
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE RESTRICT,
    livreur_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    statut public.order_status NOT NULL DEFAULT 'en_attente',
    adresse_livraison TEXT NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    montant_total INTEGER NOT NULL CHECK (montant_total >= 0), -- Total en CDF
    commission INTEGER NOT NULL DEFAULT 0,                     -- Commission Linki en CDF
    frais_livraison INTEGER NOT NULL DEFAULT 3500,             -- Frais de livraison en CDF
    pourboire_livreur INTEGER NOT NULL DEFAULT 0,              -- Pourboire en CDF
    code_pin VARCHAR(4) NOT NULL DEFAULT '1234',              -- Code PIN sécurisé à 4 chiffres (handshake)
    instructions_livraison TEXT,                               -- Repères locaux (barrière, repère)
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table Order Items
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,
    quantite INTEGER NOT NULL CHECK (quantite > 0),
    prix_unitaire INTEGER NOT NULL CHECK (prix_unitaire >= 0),
    notes TEXT
);

-- Table Deliveries
CREATE TABLE IF NOT EXISTS public.deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
    livreur_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    position_actuelle_lat DOUBLE PRECISION,
    position_actuelle_lng DOUBLE PRECISION,
    statut public.delivery_status NOT NULL DEFAULT 'assignee',
    heure_recuperation TIMESTAMPTZ,
    heure_livraison TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    note INTEGER NOT NULL CHECK (note BETWEEN 1 AND 5),
    commentaire TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table Payments (Mobile Money RDC)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    methode public.payment_method NOT NULL DEFAULT 'mpesa',
    reference_transaction TEXT NOT NULL UNIQUE,
    telephone_client TEXT NOT NULL,
    statut public.payment_status NOT NULL DEFAULT 'en_attente',
    montant INTEGER NOT NULL CHECK (montant >= 0), -- en CDF
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. INDEX DE PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_restaurants_owner ON public.restaurants(owner_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant ON public.menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_client ON public.orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant ON public.orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_livreur ON public.orders(livreur_id);
CREATE INDEX IF NOT EXISTS idx_orders_statut ON public.orders(statut);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);

-- 5. FONCTIONS HELPER & RPC
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text AS $$
    SELECT role::text FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_restaurant_owner(restaurant_uuid UUID)
RETURNS boolean AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.restaurants WHERE id = restaurant_uuid AND owner_id = auth.uid()
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Déclencheur updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_restaurants_updated_at ON public.restaurants;
CREATE TRIGGER set_restaurants_updated_at BEFORE UPDATE ON public.restaurants FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_menu_items_updated_at ON public.menu_items;
CREATE TRIGGER set_menu_items_updated_at BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_orders_updated_at ON public.orders;
CREATE TRIGGER set_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 6. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Politiques Profiles
DROP POLICY IF EXISTS "Lecture profils publics" ON public.profiles;
CREATE POLICY "Lecture profils publics" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Modification propre profil" ON public.profiles;
CREATE POLICY "Modification propre profil" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Politiques Restaurants
DROP POLICY IF EXISTS "Restaurants visibles par tous" ON public.restaurants;
CREATE POLICY "Restaurants visibles par tous" ON public.restaurants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Restaurateur modifie son restaurant" ON public.restaurants;
CREATE POLICY "Restaurateur modifie son restaurant" ON public.restaurants FOR UPDATE USING (owner_id = auth.uid() OR public.is_admin());

-- Politiques Menu & Catégories
DROP POLICY IF EXISTS "Menus visibles par tous" ON public.menu_items;
CREATE POLICY "Menus visibles par tous" ON public.menu_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Catégories visibles par tous" ON public.categories;
CREATE POLICY "Catégories visibles par tous" ON public.categories FOR SELECT USING (true);

-- Politiques Commandes
DROP POLICY IF EXISTS "Client voit ses commandes" ON public.orders;
CREATE POLICY "Client voit ses commandes" ON public.orders FOR SELECT USING (
    client_id = auth.uid() 
    OR public.is_restaurant_owner(restaurant_id)
    OR livreur_id = auth.uid()
    OR (livreur_id IS NULL AND statut = 'prete' AND public.current_user_role() = 'livreur')
    OR public.is_admin()
);

DROP POLICY IF EXISTS "Client crée sa commande" ON public.orders;
CREATE POLICY "Client crée sa commande" ON public.orders FOR INSERT WITH CHECK (client_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Mise à jour commande par acteurs autorisés" ON public.orders;
CREATE POLICY "Mise à jour commande par acteurs autorisés" ON public.orders FOR UPDATE USING (
    client_id = auth.uid()
    OR public.is_restaurant_owner(restaurant_id)
    OR livreur_id = auth.uid()
    OR (livreur_id IS NULL AND statut = 'prete' AND public.current_user_role() = 'livreur')
    OR public.is_admin()
);

-- 7. SEED DATA LUBUMBASHI (HAUT-KATANGA, RDC)
DO $$
DECLARE
    client_uuid UUID := 'c1111111-1111-4111-8111-111111111111';
    resto_owner_uuid UUID := 'r2222222-2222-4222-8222-222222222222';
    resto_owner2_uuid UUID := 'r3333333-3333-4333-8333-333333333333';
    livreur_uuid UUID := 'l4444444-4444-4444-8444-444444444444';
    admin_uuid UUID := 'a5555555-5555-4555-8555-555555555555';

    resto1_id UUID := 'b0000001-0000-4000-8000-000000000001';
    resto2_id UUID := 'b0000002-0000-4000-8000-000000000002';
    resto3_id UUID := 'b0000003-0000-4000-8000-000000000003';

    cat1 UUID := 'c0000001-0000-4000-8000-000000000001';
    cat2 UUID := 'c0000002-0000-4000-8000-000000000002';
    cat3 UUID := 'c0000003-0000-4000-8000-000000000003';
    cat4 UUID := 'c0000004-0000-4000-8000-000000000004';
BEGIN
    -- Profils
    INSERT INTO public.profiles (id, role, status, full_name, phone, avatar_url)
    VALUES
        (client_uuid, 'client', 'actif', 'Grace Mavinga', '+243821234567', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
        (resto_owner_uuid, 'restaurant', 'actif', 'Chef Dieudonné Kalala', '+243812345678', 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150'),
        (resto_owner2_uuid, 'restaurant', 'actif', 'Maman Antoinette Lukusa', '+243893456789', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'),
        (livreur_uuid, 'livreur', 'actif', 'Junior Mutombo (Livreur Lubum)', '+243854567890', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
        (admin_uuid, 'admin', 'actif', 'Sadicky Dave (Super Admin)', '+243800000000', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150')
    ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, phone = EXCLUDED.phone;

    -- Restaurants de Lubumbashi
    INSERT INTO public.restaurants (id, owner_id, nom, description, adresse, lat, lng, image_url, statut, note_moyenne, commission_pct)
    VALUES
        (
            resto1_id,
            resto_owner_uuid,
            'Le Cercle du Golf & Grillades de Lubumbashi',
            'Le temple du T-Bone katangais grillé au feu de bois, Poulet Bicyclette mariné et brochettes tendres.',
            'Boulevard Msiri, Quartier Golf, Lubumbashi',
            -11.6542,
            27.4695,
            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
            'ouvert',
            4.95,
            15.00
        ),
        (
            resto2_id,
            resto_owner_uuid,
            'Katanga Saveurs & Bukari Terroir',
            'Authentique cuisine lushoise : Bukari ya Semoule blanc, Poisson frais du Lac Moero braisé et légumes du terroir.',
            'Avenue Kasa-Vubu, Commune de Kamalondo, Lubumbashi',
            -11.6725,
            27.4812,
            'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
            'ouvert',
            4.85,
            12.50
        ),
        (
            resto3_id,
            resto_owner2_uuid,
            'Le Chalet Kipopo & Délices Cuivrés',
            'Gastronomie raffinée au bord de l''eau, Capitaine braisé au piment vert, Makayabu et jus de bissap glacés.',
            'Chaussée Laurent Désiré Kabila, Centre-ville, Lubumbashi',
            -11.6610,
            27.4780,
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
            'ouvert',
            4.90,
            15.00
        )
    ON CONFLICT (id) DO UPDATE SET 
        nom = EXCLUDED.nom, 
        description = EXCLUDED.description, 
        adresse = EXCLUDED.adresse,
        lat = EXCLUDED.lat,
        lng = EXCLUDED.lng;

    -- Catégories
    INSERT INTO public.categories (id, restaurant_id, nom, ordre)
    VALUES
        (cat1, resto1_id, 'Grillades au Feu de Bois', 1),
        (cat2, resto1_id, 'Spécialités de Lubumbashi', 2),
        (cat3, resto1_id, 'Accompagnements du Katanga', 3),
        (cat4, resto2_id, 'Bukari & Poissons du Terroir', 1)
    ON CONFLICT (id) DO NOTHING;

    -- Plats en Francs Congolais (CDF)
    INSERT INTO public.menu_items (restaurant_id, category_id, nom, description, prix, image_url, disponible)
    VALUES
        (resto1_id, cat1, 'T-Bone Katangais Signature (500g)', 'Bœuf sélectionné du Haut-Katanga braisé à la perfection, assaisonné aux épices locales et servi avec sauce barbecue maison.', 42000, 'https://images.unsplash.com/photo-1558030006-450675393462?w=600', true),
        (resto1_id, cat1, 'Poulet Bicyclette Mariné & Fumé', 'Poulet fermier local tendre, grillé au charbon de bois, mariné au gingembre, ail et piment doux.', 38000, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600', true),
        (resto1_id, cat2, 'Brochettes de Bœuf Tendres (5 pcs)', 'Brochettes marinées aux herbes du Katanga, oignons doux et poivrons frais.', 20000, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600', true),
        (resto1_id, cat3, 'Bananes Plantains Alloco Dorées', 'Bananes plantains mûres frites à point, croustillantes et fondantes.', 8000, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600', true),
        (resto1_id, cat3, 'Frites Fraîches Croustillantes', 'Pommes de terre fraîches coupées maison, dorées à l''huile végétale.', 7000, 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600', true),
        (resto2_id, cat4, 'Poisson Frais du Lac Moero Braisé', 'Poisson entier pêché frais, mariné à l''étouffée et grillé minute, accompagné de Bukari fumant.', 45000, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600', true),
        (resto2_id, cat4, 'Portion de Bukari Chaud de Semoule Blanche', 'Bukari traditionnel préparé avec de la farine de maïs blanc de première qualité.', 5000, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600', true)
    ON CONFLICT DO NOTHING;
END $$;
