"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { resolveOrderDispute } from "@/lib/actions/admin.actions";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  ReceiptText,
  XCircle,
  ExternalLink,
  Store,
  User,
} from "lucide-react";
import type { Order } from "@/lib/mock-data";

interface GlobalOrdersManagerProps {
  initialOrders: (Order & { restaurantName?: string; clientName?: string })[];
}

export function GlobalOrdersManager({
  initialOrders,
}: GlobalOrdersManagerProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [isPending, startTransition] = useTransition();

  const handleCancelDispute = (orderId: string) => {
    if (!confirm("Annuler et rembourser cette commande litigieuse ?")) return;

    startTransition(async () => {
      const res = await resolveOrderDispute(orderId, "annulee");
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, statut: "annulee" } : o))
        );
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
          <ReceiptText className="w-7 h-7 text-sky-600" />
          Supervision Globale des Commandes & Litiges
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Surveillez le bon déroulement de chaque commande sur le réseau Linki et intervenez en cas de litige.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 tracking-wider">
              <tr>
                <th className="p-4">N° Commande & Date</th>
                <th className="p-4">Restaurant</th>
                <th className="p-4">Client</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Total</th>
                <th className="p-4">Commission</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4">
                    <span className="font-mono font-bold text-slate-900 block">
                      #{order.id.substring(0, 10)}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {formatDate(order.created_at)}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                      <Store className="w-3.5 h-3.5 text-amber-500" />
                      <span>{order.restaurantName}</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{order.clientName}</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        order.statut === "livree"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : order.statut === "annulee"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-sky-50 text-sky-700 border border-sky-200 animate-pulse"
                      }`}
                    >
                      {order.statut.replace("_", " ")}
                    </span>
                  </td>

                  <td className="p-4 font-bold text-slate-900">
                    {formatPrice(order.montant_total)}
                  </td>

                  <td className="p-4 font-semibold text-purple-700">
                    {formatPrice(order.commission)}
                  </td>

                  <td className="p-4 text-right space-x-2">
                    <Link
                      href={`/orders/${order.id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                    >
                      <span>Voir Live</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>

                    {order.statut !== "annulee" && order.statut !== "livree" && (
                      <button
                        onClick={() => handleCancelDispute(order.id)}
                        disabled={isPending}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                        title="Annuler pour litige"
                      >
                        <XCircle className="w-3 h-3" />
                        <span>Annuler litige</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
