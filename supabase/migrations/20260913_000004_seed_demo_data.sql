-- ==============================================================================
-- Migration: 20260913_000004_seed_demo_data.sql
-- Description: Données congolaises authentiques en Francs Congolais (CDF)
-- ==============================================================================

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

    cat_maboke UUID := 'c0000001-0000-4000-8000-000000000001';
    cat_grillades UUID := 'c0000002-0000-4000-8000-000000000002';
    cat_acc UUID := 'c0000003-0000-4000-8000-000000000003';
    cat_bandal UUID := 'c0000004-0000-4000-8000-000000000004';
BEGIN
    -- 1. Profils Démo Congolais
    INSERT INTO public.profiles (id, role, status, full_name, phone, avatar_url)
    VALUES
        (client_uuid, 'client', 'actif', 'Grace Mavinga', '+243821234567', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
        (resto_owner_uuid, 'restaurant', 'actif', 'Chef Dieudonné Kalala', '+243812345678', 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150'),
        (resto_owner2_uuid, 'restaurant', 'actif', 'Maman Antoinette Lukusa', '+243893456789', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'),
        (livreur_uuid, 'livreur', 'actif', 'Junior Mutombo', '+243854567890', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
        (admin_uuid, 'admin', 'actif', 'Sadicky Dave (Admin)', '+243800000000', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150')
    ON CONFLICT (id) DO NOTHING;

    -- 2. Restaurants de Lubumbashi
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
    ON CONFLICT (id) DO NOTHING;

    -- 3. Catégories
    INSERT INTO public.categories (id, restaurant_id, nom, ordre)
    VALUES
        (cat_maboke, resto1_id, 'Grillades au Feu de Bois', 1),
        (cat_grillades, resto1_id, 'Spécialités de Lubumbashi', 2),
        (cat_acc, resto1_id, 'Accompagnements du Katanga', 3),
        (cat_bandal, resto2_id, 'Bukari & Poissons du Terroir', 1)
    ON CONFLICT (id) DO NOTHING;

    -- 4. Plats en Francs Congolais (CDF)
    INSERT INTO public.menu_items (restaurant_id, category_id, nom, description, prix, image_url, disponible)
    VALUES
        (resto1_id, cat_maboke, 'Liboke de Capitaine Royal', 'Capitaine frais mariné enveloppé dans des feuilles de bananier, cuit à l''étouffée avec piment doux, ail et ciboulette.', 45000, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600', true),
        (resto1_id, cat_grillades, 'Poulet Mayo Braisé Signature', 'Poulet fermier tendre grillé à la braise, généreusement nappé de mayonnaise maison assaisonnée et oignons doux.', 38000, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600', true),
        (resto1_id, cat_grillades, 'Brochettes Kamundele Tendre (5 pcs)', 'Viande de bœuf sélectionnée, marinée aux épices locales et grillée à point.', 22000, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600', true),
        (resto1_id, cat_acc, 'Alloco Banane Plantain Dorée', 'Bananes plantains mûres frites à l''huile végétale, croustillantes et fondantes.', 8000, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600', true),
        (resto1_id, cat_acc, 'Pondu Chaud au Poisson Fumé', 'Feuilles de manioc pilées traditionnelles mijotées avec du poisson fumé et huile de palme pure.', 15000, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600', true),
        (resto2_id, cat_bandal, 'Portion de Mikate Chauds (10 pcs)', 'Beignets congolais dorés et moelleux, servis avec un coulis de chocolat ou sucre glace.', 6000, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600', true)
    ON CONFLICT DO NOTHING;
END $$;
