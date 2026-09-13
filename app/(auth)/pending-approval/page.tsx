import Link from "next/link";
import { getCurrentUser, signOut } from "@/lib/actions/auth.actions";
import { Clock, CheckCircle, ArrowLeft, LogOut } from "lucide-react";

export default async function PendingApprovalPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 antialiased">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Dossier en cours de vérification</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Validation Partenaire en Cours</h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Merci pour votre inscription sur Linki en tant que partenaire{" "}
            <strong className="text-slate-800 capitalize">{user?.role || "partenaire"}</strong>. Votre établissement ou profil est actuellement examiné par notre équipe de modération.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span>Titulaire :</span>
            <span className="text-slate-900 font-semibold">{user?.full_name || "Partenaire Linki"}</span>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span>Rôle sollicité :</span>
            <span className="text-amber-700 font-semibold uppercase">{user?.role}</span>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span>Statut administratif :</span>
            <span className="text-amber-700 font-semibold">En cours d&apos;examen</span>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 space-y-2 text-left">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Délai moyen de traitement : 24 à 48 heures</span>
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Dès validation par notre équipe d&apos;administration, votre accès au tableau de bord sera automatiquement débloqué et vous recevrez une confirmation par SMS / email.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l&apos;accueil</span>
          </Link>

          <form action={signOut}>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Se déconnecter</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
