import { getCourierEarnings } from "@/lib/actions/livreur.actions";
import { formatPrice, formatDate } from "@/lib/utils";
import { DollarSign, CheckCircle2 } from "lucide-react";

export default async function LivreurEarningsPage() {
  const earnings = await getCourierEarnings();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
          <DollarSign className="w-7 h-7 text-emerald-600" />
          Mes Gains & Rémunérations
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Suivi transparent de vos courses livrées et de vos virements à Lubumbashi.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Rémunéré</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">
            {formatPrice(earnings.totalEarnings)}
          </div>
          <span className="text-[11px] text-slate-400">Forfaits + frais de livraison</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Courses Terminées</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {earnings.completedCount}
          </div>
          <span className="text-[11px] text-slate-400">Livrées avec succès</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Rémunération Moyenne</span>
          <div className="text-2xl sm:text-3xl font-black text-sky-700">
            {formatPrice(
              earnings.completedCount > 0
                ? earnings.totalEarnings / earnings.completedCount
                : 7000
            )}
          </div>
          <span className="text-[11px] text-slate-400">Par course livrée</span>
        </div>
      </div>

      {/* Historique des courses */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <h2 className="text-base font-bold text-slate-900">Détail des dernières livraisons</h2>

        {earnings.history.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            Aucune course finalisée pour l&apos;instant. Les courses livrées apparaîtront ici avec le relevé de paiement.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {earnings.history.map((item) => (
              <div
                key={item.id}
                className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-mono text-slate-700 font-semibold">
                      Course #{item.orderId.substring(0, 10)}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] pl-6">{item.address}</p>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-emerald-700">
                    +{formatPrice(item.payout)}
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    {formatDate(item.deliveredAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
