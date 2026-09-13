import { getRestaurants } from "@/lib/actions/client.actions";
import { RestaurantCard } from "@/components/client/RestaurantCard";
import { Search, Sparkles, Flame, ShieldCheck, Clock, Award, Zap, Heart } from "lucide-react";

export default async function ClientHomePage() {
  const restaurants = await getRestaurants();

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Banner clair et vibrant aux couleurs de Lubumbashi */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border border-emerald-100/80 p-8 sm:p-12 shadow-xs">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Livraison gourmande à Lubumbashi (Haut-Katanga)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Savourez l&apos;authenticité des meilleures tables de Lubumbashi.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Du tendre T-Bone katangais braisé au feu de bois au savoureux Bukari ya semoule blanc et poisson frais du Lac Moero, faites-vous livrer en direct par nos motards en Francs Congolais (CDF).
          </p>

          {/* Points forts UberEats */}
          <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200/60 shadow-2xs">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Livraison express (Golf, Centre-ville, Bel-Air, Kamalondo)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200/60 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Mobile Money RDC (M-Pesa, Airtel, Orange, Afrimoney)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200/60 shadow-2xs">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Suivi GPS en direct & Code PIN sécurisé</span>
            </div>
          </div>
        </div>
      </section>

      {/* Barre de recherche et catégories UberEats */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <Flame className="w-6 h-6 text-amber-500" />
              Restaurants à proximité à Lubumbashi
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {restaurants.length} établissements ouverts et prêts à préparer vos commandes
            </p>
          </div>

          {/* Champ de recherche */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher T-Bone, Bukari, Poisson braisé..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 shadow-2xs transition-all"
            />
          </div>
        </div>

        {/* Filtres de catégories rapides UberEats */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { label: "Tous les restaurants", icon: Award },
            { label: "⭐ Les mieux notés", icon: null },
            { label: "⚡ Moins de 30 min", icon: null },
            { label: "🔥 Populaires à Lubum", icon: null },
            { label: "🍲 Bukari & Terroir", icon: null },
            { label: "🥩 T-Bone & Grillades", icon: null },
            { label: "🍗 Poulet Bicyclette", icon: null },
            { label: "🐟 Poissons du Lac Moero", icon: null },
            { label: "🍌 Alloco & Frites", icon: null },
          ].map((cat, idx) => (
            <button
              key={cat.label}
              type="button"
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                idx === 0
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              {cat.icon && <cat.icon className="w-3.5 h-3.5 text-amber-400" />}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Grille des restaurants */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      {/* Section UberEats Avantages */}
      <section className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xs">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Pourquoi choisir Linki ?</span>
          <h2 className="text-2xl font-black text-slate-900">L&apos;expérience de livraison n°1 à Lubumbashi</h2>
          <p className="text-xs text-slate-500">
            Conçu pour les Lushois avec la technologie de livraison la plus avancée du Katanga.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5 text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Livraison Ultra-Rapide</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Nos courtiers connaissent chaque avenue de Lubumbashi pour vous livrer chaud en moins de 30 minutes.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5 text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Code PIN Anti-Erreur</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Un code secret à 4 chiffres garantit que votre repas est remis exclusivement à la bonne personne.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5 text-center">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">100% Mobile Money RDC</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Débit direct via M-Pesa, Airtel Money, Orange Money ou Afrimoney avec validation USSD instantanée.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
