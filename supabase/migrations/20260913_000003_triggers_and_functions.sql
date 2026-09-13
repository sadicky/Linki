-- ==============================================================================
-- Migration: 20260913_000003_triggers_and_functions.sql
-- Description: Fonctions & Triggers automatisés (updated_at, auth.users sync, reviews, realtime)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Fonction générique pour mettre à jour updated_at
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Application du trigger updated_at
DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_restaurants_updated_at ON public.restaurants;
CREATE TRIGGER tr_restaurants_updated_at
    BEFORE UPDATE ON public.restaurants
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_menu_items_updated_at ON public.menu_items;
CREATE TRIGGER tr_menu_items_updated_at
    BEFORE UPDATE ON public.menu_items
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_orders_updated_at ON public.orders;
CREATE TRIGGER tr_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_deliveries_updated_at ON public.deliveries;
CREATE TRIGGER tr_deliveries_updated_at
    BEFORE UPDATE ON public.deliveries
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 2. Trigger automatique à la création d'un utilisateur Supabase Auth
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role TEXT;
    user_status TEXT;
    user_name TEXT;
    user_phone TEXT;
BEGIN
    -- Récupération du rôle dans les métadonnées (défaut 'client')
    user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'client');
    IF user_role NOT IN ('client', 'restaurant', 'livreur', 'admin') THEN
        user_role := 'client';
    END IF;

    -- Restaurant et Livreur nécessitent validation manuelle de l'admin
    IF user_role IN ('restaurant', 'livreur') THEN
        user_status := 'en_attente_validation';
    ELSE
        user_status := 'actif';
    END IF;

    user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
    user_phone := NEW.raw_user_meta_data->>'phone';

    INSERT INTO public.profiles (id, role, status, full_name, phone, avatar_url)
    VALUES (
        NEW.id,
        user_role,
        user_status,
        user_name,
        user_phone,
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone = COALESCE(EXCLUDED.phone, public.profiles.phone);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 3. Mise à jour de la note moyenne d'un restaurant lors d'un nouvel avis
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_restaurant_rating()
RETURNS TRIGGER AS $$
DECLARE
    target_restaurant_id UUID;
    avg_rating NUMERIC(3, 2);
BEGIN
    target_restaurant_id := COALESCE(NEW.restaurant_id, OLD.restaurant_id);

    SELECT COALESCE(ROUND(AVG(note)::NUMERIC, 2), 5.00)
    INTO avg_rating
    FROM public.reviews
    WHERE restaurant_id = target_restaurant_id;

    UPDATE public.restaurants
    SET note_moyenne = avg_rating
    WHERE id = target_restaurant_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_update_restaurant_rating ON public.reviews;
CREATE TRIGGER tr_update_restaurant_rating
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.handle_restaurant_rating();

-- ------------------------------------------------------------------------------
-- 4. Activation de Supabase Realtime sur les tables critiques
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    -- Activation de la publication pour orders si pas déjà fait
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    END IF;

    -- Activation de la publication pour deliveries
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND tablename = 'deliveries'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.deliveries;
    END IF;
EXCEPTION
    WHEN undefined_object THEN
        NULL; -- Cas où la publication supabase_realtime n'est pas instanciée en local
END $$;
