import { redirect } from "next/navigation";
import { getMyProfileDetails } from "@/lib/actions/auth.actions";
import { UserProfileManager } from "@/components/profile/UserProfileManager";

export const metadata = {
  title: "Profil Restaurant Partenaire | Linki",
  description: "Paramètres du profil restaurateur et informations de l'établissement à Lubumbashi.",
};

export default async function RestaurantProfilePage() {
  const profileDetails = await getMyProfileDetails();

  if (!profileDetails) {
    redirect("/login?redirect=/dashboard/restaurant/profile");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Profil Restaurateur
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Gérez votre profil gérant et les coordonnées publiques de votre restaurant à Lubumbashi.
        </p>
      </div>

      <UserProfileManager initialData={profileDetails} />
    </div>
  );
}
