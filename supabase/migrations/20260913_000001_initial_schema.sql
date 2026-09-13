-- ==============================================================================
-- Migration: 20260913_000001_initial_schema.sql
-- Description: Schéma initial pour Linki SaaS (Food Delivery Multi-Rôles)
-- ==============================================================================

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('client', 'restaurant', 'livreur', 'admin')) DEFAULT 'client',
    status TEXT NOT NULL CHECK (status IN ('en_attente_validation', 'actif', 'suspendu')) DEFAULT 'actif',
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table: restaurants
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    nom TEXT NOT NULL,
    description TEXT,
    adresse TEXT NOT NULL,
    lat NUMERIC(10, 7) NOT NULL,
    lng NUMERIC(10, 7) NOT NULL,
    image_url TEXT,
    statut TEXT NOT NULL CHECK (statut IN ('ouvert', 'ferme')) DEFAULT 'ouvert',
    note_moyenne NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    commission_pct NUMERIC(5, 2) NOT NULL DEFAULT 15.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table: categories
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    nom TEXT NOT NULL,
    ordre INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table: menu_items
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    nom TEXT NOT NULL,
    description TEXT,
    prix NUMERIC(10, 2) NOT NULL CHECK (prix >= 0),
    image_url TEXT,
    disponible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table: orders
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    livreur_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    statut TEXT NOT NULL CHECK (
        statut IN (
            'en_attente',
            'acceptee',
            'en_preparation',
            'prete',
            'en_livraison',
            'livree',
            'annulee'
        )
    ) DEFAULT 'en_attente',
    adresse_livraison TEXT NOT NULL,
    lat NUMERIC(10, 7) NOT NULL,
    lng NUMERIC(10, 7) NOT NULL,
    montant_total NUMERIC(10, 2) NOT NULL CHECK (montant_total >= 0),
    commission NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (commission >= 0),
    frais_livraison NUMERIC(10, 2) NOT NULL DEFAULT 2.99 CHECK (frais_livraison >= 0),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table: order_items
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,
    quantite INTEGER NOT NULL CHECK (quantite > 0) DEFAULT 1,
    prix_unitaire NUMERIC(10, 2) NOT NULL CHECK (prix_unitaire >= 0),
    notes TEXT
);

-- Table: deliveries
CREATE TABLE IF NOT EXISTS public.deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
    livreur_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    position_actuelle_lat NUMERIC(10, 7),
    position_actuelle_lng NUMERIC(10, 7),
    statut TEXT NOT NULL CHECK (
        statut IN (
            'assignee',
            'en_route_restaurant',
            'recuperee',
            'en_route_client',
            'livree'
        )
    ) DEFAULT 'assignee',
    heure_recuperation TIMESTAMPTZ,
    heure_livraison TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table: reviews
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    note INTEGER NOT NULL CHECK (note BETWEEN 1 AND 5),
    commentaire TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table: payments
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT NOT NULL,
    statut TEXT NOT NULL CHECK (
        statut IN ('en_attente', 'reussi', 'echoue', 'rembourse')
    ) DEFAULT 'en_attente',
    montant NUMERIC(10, 2) NOT NULL CHECK (montant >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_restaurants_owner ON public.restaurants(owner_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant ON public.menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_client ON public.orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant ON public.orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_livreur ON public.orders(livreur_id);
CREATE INDEX IF NOT EXISTS idx_orders_statut ON public.orders(statut);
CREATE INDEX IF NOT EXISTS idx_deliveries_livreur ON public.deliveries(livreur_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_order ON public.deliveries(order_id);
