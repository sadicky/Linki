"use client";

import React, { useState, useTransition } from "react";
import { updatePartnerStatus } from "@/lib/actions/admin.actions";
import { formatDate } from "@/lib/utils";
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  Utensils,
  Bike,
  Clock,
  Phone,
  Loader2,
} from "lucide-react";
import type { Profile } from "@/lib/mock-data";
import type { AccountStatus } from "@/lib/supabase/types";

interface PartnerValidationsManagerProps {
  initialPending: Profile[];
}

export function PartnerValidationsManager({
  initialPending,
}: PartnerValidationsManagerProps) {
  const [partners, setPartners] = useState(initialPending);
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (userId: string, newStatus: AccountStatus) => {
    startTransition(async () => {
      const res = await updatePartnerStatus(userId, newStatus);
      if (res.success) {
        setPartners((prev) => prev.filter((p) => p.id !== userId));
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
          <UserCheck className="w-7 h-7 text-amber-500" />
          Validation des Partenaires
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Examinez les demandes d&apos;inscription des restaurants et des livreurs avant de leur donner accès au réseau Linki.
        </p>
      </div>

      {partners.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 space-y-3 shadow-xs">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Toutes les demandes ont été traitées !</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Il n&apos;y a aucun partenaire en attente de validation manuelle en ce moment.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {partners.map((partner) => {
            const isResto = partner.role === "restaurant";

            return (
              <div
                key={partner.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-2xs hover:shadow-xs transition-all"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-xs ${
                      isResto
                        ? "bg-amber-500"
                        : "bg-sky-600"
                    }`}
                  >
                    {isResto ? <Utensils className="w-6 h-6" /> : <Bike className="w-6 h-6" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{partner.full_name}</h3>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          isResto
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-sky-50 text-sky-700 border border-sky-200"
                        }`}
                      >
                        {partner.role}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      {partner.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{partner.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Inscrit le {formatDate(partner.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Boutons d'approbation */}
                <div className="flex items-center gap-2.5 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <button
                    onClick={() => handleUpdate(partner.id, "actif")}
                    disabled={isPending}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    {isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                    )}
                    <span>Approuver et Activer</span>
                  </button>

                  <button
                    onClick={() => handleUpdate(partner.id, "suspendu")}
                    disabled={isPending}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-semibold text-xs rounded-xl border border-slate-200 transition-all cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Rejeter</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
