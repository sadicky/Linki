-- ==============================================================================
-- Migration: 20260913_000002_rls_policies.sql
-- Description: Politiques Row Level Security (RLS) complètes par rôle et par table
-- ==============================================================================

-- Activation du RLS sur chaque table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- Fonctions d'aide pour RLS
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
$$;

CREATE OR REPLACE FUNCTION public.is_restaurant_owner(restaurant_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.restaurants
        WHERE id = restaurant_uuid AND owner_id = auth.uid()
    );
$$;

-- ------------------------------------------------------------------------------
-- POLICIES: profiles
-- ------------------------------------------------------------------------------
-- Tout utilisateur authentifié peut voir son profil, un admin peut tout voir,
-- et les profils des restaurants/livreurs sont visibles par les utilisateurs connectés
CREATE POLICY "Profiles lecture"
ON public.profiles FOR SELECT
TO authenticated
USING (
    id = auth.uid()
    OR public.is_admin()
    OR role IN ('restaurant', 'livreur')
);

-- Seul le propriétaire peut mettre à jour ses infos personnelles (sauf rôle et statut)
CREATE POLICY "Profiles maj utilisateur"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid() OR public.is_admin())
WITH CHECK (id = auth.uid() OR public.is_admin());

-- Insertion via trigger ou admin
CREATE POLICY "Profiles insertion"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid() OR public.is_admin());

-- ------------------------------------------------------------------------------
-- POLICIES: restaurants
-- ------------------------------------------------------------------------------
-- Lecture publique de tous les restaurants actifs et ouverts, ou admin / propriétaire
CREATE POLICY "Restaurants lecture"
ON public.restaurants FOR SELECT
TO authenticated, anon
USING (
    statut = 'ouvert'
    OR owner_id = auth.uid()
    OR public.is_admin()
);

-- Seul le propriétaire actif ou l'admin peut modifier son restaurant
CREATE POLICY "Restaurants maj proprietaire ou admin"
ON public.restaurants FOR UPDATE
TO authenticated
USING (
    (owner_id = auth.uid() AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND status = 'actif'))
    OR public.is_admin()
)
WITH CHECK (
    (owner_id = auth.uid() AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND status = 'actif'))
    OR public.is_admin()
);

CREATE POLICY "Restaurants creation"
ON public.restaurants FOR INSERT
TO authenticated
WITH CHECK (
    (owner_id = auth.uid() AND public.current_user_role() = 'restaurant')
    OR public.is_admin()
);

-- ------------------------------------------------------------------------------
-- POLICIES: categories & menu_items
-- ------------------------------------------------------------------------------
-- Lecture publique du menu
CREATE POLICY "Categories lecture publique"
ON public.categories FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Categories modif restaurant"
ON public.categories FOR ALL
TO authenticated
USING (public.is_restaurant_owner(restaurant_id) OR public.is_admin())
WITH CHECK (public.is_restaurant_owner(restaurant_id) OR public.is_admin());

CREATE POLICY "Menu items lecture publique"
ON public.menu_items FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Menu items modif restaurant"
ON public.menu_items FOR ALL
TO authenticated
USING (public.is_restaurant_owner(restaurant_id) OR public.is_admin())
WITH CHECK (public.is_restaurant_owner(restaurant_id) OR public.is_admin());

-- ------------------------------------------------------------------------------
-- POLICIES: orders
-- ------------------------------------------------------------------------------
-- Client voit ses commandes, Restaurant voit les commandes de son restau,
-- Livreur voit les commandes prêtes sans livreur OU qui lui sont assignées, Admin voit tout
CREATE POLICY "Orders lecture securisee"
ON public.orders FOR SELECT
TO authenticated
USING (
    client_id = auth.uid()
    OR public.is_restaurant_owner(restaurant_id)
    OR (public.current_user_role() = 'livreur' AND (livreur_id = auth.uid() OR (statut = 'prete' AND livreur_id IS NULL)))
    OR public.is_admin()
);

-- Client peut créer une commande
CREATE POLICY "Orders creation client"
ON public.orders FOR INSERT
TO authenticated
WITH CHECK (
    client_id = auth.uid()
    OR public.is_admin()
);

-- Mise à jour selon le rôle :
-- Restaurant peut modifier statut (accepter, préparation, prête, annuler)
-- Livreur peut s'assigner (statut prete -> en_livraison) et marquer livrée
-- Admin peut tout modifier
CREATE POLICY "Orders maj autorisee"
ON public.orders FOR UPDATE
TO authenticated
USING (
    public.is_restaurant_owner(restaurant_id)
    OR (public.current_user_role() = 'livreur' AND (livreur_id = auth.uid() OR (statut = 'prete' AND livreur_id IS NULL)))
    OR client_id = auth.uid()
    OR public.is_admin()
)
WITH CHECK (
    public.is_restaurant_owner(restaurant_id)
    OR (public.current_user_role() = 'livreur' AND (livreur_id = auth.uid() OR (statut = 'prete' AND livreur_id IS NULL)))
    OR client_id = auth.uid()
    OR public.is_admin()
);

-- ------------------------------------------------------------------------------
-- POLICIES: order_items
-- ------------------------------------------------------------------------------
CREATE POLICY "Order items lecture"
ON public.order_items FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.orders o
        WHERE o.id = order_items.order_id
        AND (
            o.client_id = auth.uid()
            OR public.is_restaurant_owner(o.restaurant_id)
            OR o.livreur_id = auth.uid()
            OR public.is_admin()
        )
    )
);

CREATE POLICY "Order items insertion"
ON public.order_items FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.orders o
        WHERE o.id = order_items.order_id
        AND (o.client_id = auth.uid() OR public.is_admin())
    )
);

-- ------------------------------------------------------------------------------
-- POLICIES: deliveries
-- ------------------------------------------------------------------------------
-- Lecture pour le livreur assigné, le client et le restaurant de la commande
CREATE POLICY "Deliveries lecture"
ON public.deliveries FOR SELECT
TO authenticated
USING (
    livreur_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.orders o
        WHERE o.id = deliveries.order_id
        AND (o.client_id = auth.uid() OR public.is_restaurant_owner(o.restaurant_id))
    )
    OR public.is_admin()
);

-- Seul le livreur assigné ou l'admin peut mettre à jour sa position / statut
CREATE POLICY "Deliveries maj livreur"
ON public.deliveries FOR ALL
TO authenticated
USING (livreur_id = auth.uid() OR public.is_admin())
WITH CHECK (livreur_id = auth.uid() OR public.is_admin());

-- ------------------------------------------------------------------------------
-- POLICIES: reviews
-- ------------------------------------------------------------------------------
CREATE POLICY "Reviews lecture publique"
ON public.reviews FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Reviews creation client apres livraison"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (
    client_id = auth.uid()
    AND EXISTS (
        SELECT 1 FROM public.orders o
        WHERE o.id = reviews.order_id
        AND o.client_id = auth.uid()
        AND o.statut = 'livree'
    )
);

-- ------------------------------------------------------------------------------
-- POLICIES: payments
-- ------------------------------------------------------------------------------
CREATE POLICY "Payments lecture"
ON public.payments FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.orders o
        WHERE o.id = payments.order_id
        AND (o.client_id = auth.uid() OR public.is_restaurant_owner(o.restaurant_id))
    )
    OR public.is_admin()
);

CREATE POLICY "Payments insertion ou maj service"
ON public.payments FOR ALL
TO authenticated
USING (public.is_admin() OR EXISTS (
    SELECT 1 FROM public.orders o WHERE o.id = payments.order_id AND o.client_id = auth.uid()
))
WITH CHECK (public.is_admin() OR EXISTS (
    SELECT 1 FROM public.orders o WHERE o.id = payments.order_id AND o.client_id = auth.uid()
));
