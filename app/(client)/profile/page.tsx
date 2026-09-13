import { redirect } from "next/navigation";
import { getMyProfileDetails } from "@/lib/actions/auth.actions";
import { UserProfileManager } from "@/components/profile/UserProfileManager";

export const metadata = {
  title: "Mon Profil | Linki Lubumbashi",
  description: "Consultez et modifiez vos données personnelles, coordonnées et paramètres de compte Linki.",
};

export default async function ProfilePage() {
  const profileDetails = await getMyProfileDetails();

  if (!profileDetails) {
    redirect("/login?redirect=/profile");
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Paramètres du Profil
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gérez votre identité, vos coordonnées de livraison et vos informations de rôle sur Linki Lubumbashi.
          </p>
        </div>

        <UserProfileManager initialData={profileDetails} />
      </div>
    </div>
  );
}
