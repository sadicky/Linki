import { redirect } from "next/navigation";
import { getMyProfileDetails } from "@/lib/actions/auth.actions";
import { UserProfileManager } from "@/components/profile/UserProfileManager";

export const metadata = {
  title: "Profil Coursier Livreur | Linki",
  description: "Paramètres du profil livreur coursier à Lubumbashi.",
};

export default async function LivreurProfilePage() {
  const profileDetails = await getMyProfileDetails();

  if (!profileDetails) {
    redirect("/login?redirect=/dashboard/livreur/profile");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Profil Coursier Livreur
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Gérez votre profil coursier, votre numéro Mobile Money pour vos gains de livraison à Lubumbashi.
        </p>
      </div>

      <UserProfileManager initialData={profileDetails} />
    </div>
  );
}
