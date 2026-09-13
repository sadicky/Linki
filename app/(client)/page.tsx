import { getRestaurants, getFeaturedDishes } from "@/lib/actions/client.actions";
import { HomeHeroSection } from "@/components/client/HomeHeroSection";
import { HomePromoBanner } from "@/components/client/HomePromoBanner";
import { FeaturedDishesSection } from "@/components/client/FeaturedDishesSection";
import { RestaurantFilterableList } from "@/components/client/RestaurantFilterableList";
import { HowItWorksSection } from "@/components/client/HowItWorksSection";
import { CommunesCoverageSection } from "@/components/client/CommunesCoverageSection";
import { TestimonialsSection } from "@/components/client/TestimonialsSection";
import { PartnershipBanner } from "@/components/client/PartnershipBanner";
import { FooterSection } from "@/components/client/FooterSection";

export default async function ClientHomePage() {
  const [restaurants, featuredDishes] = await Promise.all([
    getRestaurants(),
    getFeaturedDishes(),
  ]);

  return (
    <div className="space-y-14 pb-8">
      {/* 1. Hero Section Ultra-HD avec image gastronomique congolaise et sélecteur de commune */}
      <HomeHeroSection />

      {/* 2. Bannière Code Promo Découverte Lubumbashi (-20% avec LUBUM20) */}
      <HomePromoBanner />

      {/* 3. Section Plats Populaires Lushois avec Ajout Direct au Panier (CDF) */}
      <FeaturedDishesSection dishes={featuredDishes} />

      {/* 4. Grille des restaurants avec Recherche temps réel et Filtres par Catégorie */}
      <RestaurantFilterableList initialRestaurants={restaurants} />

      {/* 5. Comment ça marche à Lubumbashi (3 étapes simples & Sécurité Code PIN) */}
      <HowItWorksSection />

      {/* 6. Communes et Quartiers desservis à Lubumbashi (Golf, Centre-ville, Kamalondo, etc.) */}
      <CommunesCoverageSection />

      {/* 7. Témoignages des Lushois (Notes, avis et plats commandés) */}
      <TestimonialsSection />

      {/* 8. Devenir Partenaire (Restaurateurs & Livreurs à moto) */}
      <PartnershipBanner />

      {/* 9. Footer Complet avec Coordonnées à Lubumbashi et Badges Mobile Money RDC */}
      <FooterSection />
    </div>
  );
}
