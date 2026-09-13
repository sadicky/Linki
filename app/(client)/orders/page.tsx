import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.actions";
import { getClientOrders } from "@/lib/actions/client.actions";
import { formatPrice, formatDate } from "@/lib/utils";
import { ReceiptText, ArrowRight, Store, Clock } from "lucide-react";

export default async function ClientOrdersHistoryPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?redirect=/orders");
  }

  const orders = await getClientOrders();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
          <ReceiptText className="w-7 h-7 text-emerald-600" />
          Mes Commandes
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Retrouvez l&apos;historique de vos commandes et suivez vos livraisons en direct.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <ReceiptText className="w-8 h-8" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Aucune commande pour le moment</h2>
          <p className="text-xs text-slate-500">
            Parcourez nos délicieux restaurants partenaires et passez votre première commande.
          </p>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 shadow-xs transition-colors"
          >
            Découvrir les restaurants
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-slate-100 hover:border-emerald-300 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-2xs hover:shadow-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {order.restaurant?.nom || "Restaurant"}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{formatDate(order.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500 pl-13">
                  <span>{order.adresse_livraison}</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <span className="text-sm font-extrabold text-slate-900">
                    {formatPrice(order.montant_total)}
                  </span>
                  <div>
                    <span
                      className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        order.statut === "livree"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : order.statut === "annulee"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-sky-50 text-sky-700 border border-sky-200 animate-pulse"
                      }`}
                    >
                      {order.statut.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/orders/${order.id}`}
                  className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 px-3 py-1.5 rounded-xl border border-slate-100 transition-colors"
                >
                  <span>Suivi en direct</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
