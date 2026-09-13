import { redirect } from "next/navigation";
import { getMyProfileDetails } from "@/lib/actions/auth.actions";
import { UserProfileManager } from "@/components/profile/UserProfileManager";

export const metadata = {
  title: "Profil Super Administrateur | Linki Admin",
  description: "Paramètres et données du compte Super Administrateur Linki Lubumbashi.",
};

export default async function AdminProfilePage() {
  const profileDetails = await getMyProfileDetails();

  if (!profileDetails) {
    redirect("/login?redirect=/admin/profile");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Profil Administrateur
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Gérez votre identité, vos coordonnées et vos paramètres de supervision de la plateforme Linki.
        </p>
      </div>

      <UserProfileManager initialData={profileDetails} />
    </div>
  );
}
