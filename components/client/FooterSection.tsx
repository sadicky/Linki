"use client";

import React from "react";
import Link from "next/link";
import { UtensilsCrossed, Phone, Mail, MapPin, Heart, ShieldCheck } from "lucide-react";

export function FooterSection() {
  return (
    <footer className="mt-16 bg-white border-t border-slate-200/80 pt-12 pb-8 rounded-3xl p-8 sm:p-12 shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-100">
        {/* Colonne 1 : Brand & Mission */}
        <div className="lg:col-span-2 space-y-4">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
              L
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              Linki<span className="text-emerald-600">.cd</span>
            </span>
          </Link>

          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
            La première plateforme de livraison de repas à domicile et au bureau à Lubumbashi (Haut-Katanga, RDC). Commandez vos plats authentiques préférés et payez en direct par Mobile Money.
          </p>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Boulevard Msiri, Quartier Golf, Lubumbashi, RDC</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>+243 81 000 0000 (Support Lushois 7j/7)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>contact@linki.cd</span>
            </div>
          </div>
        </div>

        {/* Colonne 2 : Communes de Lubumbashi */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Communes Desservies
          </h4>
          <ul className="space-y-2 text-xs text-slate-500">
            <li>Quartier Golf & Météo</li>
            <li>Centre-ville & Mzee</li>
            <li>Kamalondo & Kasa-Vubu</li>
            <li>Bel-Air & Gambela</li>
            <li>Commune de la Kenya</li>
            <li>Ruashi & Kampemba</li>
          </ul>
        </div>

        {/* Colonne 3 : Liens Rapides */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Plateforme Linki
          </h4>
          <ul className="space-y-2 text-xs text-slate-500">
            <li>
              <Link href="/login" className="hover:text-emerald-700 transition-colors">
                Se connecter
              </Link>
            </li>
            <li>
              <Link href="/register?role=client" className="hover:text-emerald-700 transition-colors">
                Créer un compte Client
              </Link>
            </li>
            <li>
              <Link href="/register?role=restaurant" className="hover:text-emerald-700 transition-colors">
                Devenir Restaurant Partenaire
              </Link>
            </li>
            <li>
              <Link href="/register?role=livreur" className="hover:text-emerald-700 transition-colors">
                Rejoindre comme Livreur Moto
              </Link>
            </li>
            <li>
              <Link href="/orders" className="hover:text-emerald-700 transition-colors">
                Suivi de mes commandes
              </Link>
            </li>
          </ul>
        </div>

        {/* Colonne 4 : Moyens de paiement RDC */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Paiements 100% RDC
          </h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Transactions sécurisées et instantanées en Francs Congolais (CDF).
          </p>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center text-red-600">
              🔴 M-Pesa
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center text-red-500">
              🔴 Airtel Money
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center text-orange-600">
              🟠 Orange Money
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center text-blue-600">
              🔵 Afrimoney
            </div>
          </div>
        </div>
      </div>

      {/* Bas de page Copyright */}
      <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <span>© {new Date().getFullYear()} Linki RDC. Fait avec passion à Lubumbashi</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
        </div>
        <div className="flex items-center gap-4 text-slate-500">
          <span>Conditions d&apos;utilisation</span>
          <span>•</span>
          <span>Politique de confidentialité</span>
          <span>•</span>
          <span>Tarifs en Francs Congolais (CDF)</span>
        </div>
      </div>
    </footer>
  );
}
