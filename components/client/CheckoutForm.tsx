"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";
import { createOrder } from "@/lib/actions/client.actions";
import { processMobileMoneyPayment } from "@/lib/actions/payment.actions";
import { formatPrice, detectMobileMoneyProvider, LUBUMBASHI_COMMUNES, type MobileMoneyProvider } from "@/lib/utils";
import {
  MapPin,
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  HeartHandshake,
  FileText,
  Radio,
  Check,
} from "lucide-react";

interface OperatorConfig {
  id: MobileMoneyProvider;
  name: string;
  tagline: string;
  color: string;
  bgLight: string;
  borderColor: string;
  textColor: string;
  badgeBg: string;
  prefixes: string;
}

const OPERATORS: OperatorConfig[] = [
  {
    id: "mpesa",
    name: "M-Pesa (Vodacom)",
    tagline: "Le leader du paiement mobile en RDC",
    color: "#e60000",
    bgLight: "bg-red-50",
    borderColor: "border-red-500",
    textColor: "text-red-700",
    badgeBg: "bg-red-600 text-white",
    prefixes: "081, 082, 083",
  },
  {
    id: "airtel",
    name: "Airtel Money",
    tagline: "Paiement instantané à Lubumbashi",
    color: "#ff0000",
    bgLight: "bg-rose-50",
    borderColor: "border-rose-500",
    textColor: "text-rose-700",
    badgeBg: "bg-rose-600 text-white",
    prefixes: "097, 098, 099",
  },
  {
    id: "orange",
    name: "Orange Money",
    tagline: "Simple, rapide et 100% sécurisé",
    color: "#ff7900",
    bgLight: "bg-orange-50",
    borderColor: "border-orange-500",
    textColor: "text-orange-700",
    badgeBg: "bg-orange-500 text-white",
    prefixes: "084, 085, 089, 080",
  },
  {
    id: "afrimoney",
    name: "Afrimoney (Africell)",
    tagline: "Tarifs réduits sur vos transferts",
    color: "#6b21a8",
    bgLight: "bg-purple-50",
    borderColor: "border-purple-500",
    textColor: "text-purple-700",
    badgeBg: "bg-purple-600 text-white",
    prefixes: "090, 091",
  },
];

const TIP_OPTIONS = [0, 1000, 2500, 5000];

export function CheckoutForm() {
  const router = useRouter();
  const { items, restaurantId, restaurantName, subtotal, clearCart } =
    useCart();
  const [isPending, startTransition] = useTransition();

  const [commune, setCommune] = useState<string>(LUBUMBASHI_COMMUNES[1]); // Golf par défaut
  const [addressDetails, setAddressDetails] = useState("Boulevard Msiri, en face du Cercle du Golf");
  const [instructions, setInstructions] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<MobileMoneyProvider>("mpesa");
  const [mobileNumber, setMobileNumber] = useState("+243 82 123 4567");
  const [tip, setTip] = useState(1000);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // État de la simulation USSD
  const [ussdStep, setUssdStep] = useState<"idle" | "pushing" | "waiting_pin" | "confirmed">("idle");
  const [confirmedTransaction, setConfirmedTransaction] = useState<{
    ref: string;
    orderId: string;
    codePin: string;
  } | null>(null);

  if (items.length === 0 && ussdStep === "idle") {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <Smartphone className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Votre panier est vide</h2>
        <p className="text-xs text-slate-500">
          Veuillez sélectionner des spécialités dans un restaurant de Lubumbashi avant de procéder au paiement.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
        >
          Voir les restaurants
        </button>
      </div>
    );
  }

  // Calcul du montant final (Sous-total + Livraison fixe Lubumbashi 3 500 FC + Pourboire coursier)
  const effectiveDeliveryFee = 3500;
  const grandTotal = subtotal + effectiveDeliveryFee + tip;

  // Détection automatique de l'opérateur selon le numéro tapé
  const handlePhoneChange = (val: string) => {
    setMobileNumber(val);
    const detected = detectMobileMoneyProvider(val);
    if (detected && detected !== selectedProvider) {
      setSelectedProvider(detected);
    }
  };

  const currentOp = OPERATORS.find((o) => o.id === selectedProvider) || OPERATORS[0];

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!restaurantId) return;

    // Début du flow USSD
    setUssdStep("pushing");

    startTransition(async () => {
      // 1. Créer la commande sécurisée côté serveur
      const fullAddress = `${addressDetails}, ${commune}, Lubumbashi`;
      const orderRes = await createOrder({
        restaurant_id: restaurantId,
        adresse_livraison: fullAddress,
        lat: -11.656,
        lng: 27.472,
        pourboire_livreur: tip,
        instructions_livraison: instructions || undefined,
        items: items.map((it) => ({
          menu_item_id: it.dish.id,
          nom: it.dish.nom,
          quantite: it.quantity,
          prix_unitaire: it.dish.prix,
          notes: it.notes || null,
        })),
      });

      if (!orderRes.success || !orderRes.data) {
        setUssdStep("idle");
        setErrorMsg(orderRes.error || "Erreur de validation de la commande");
        return;
      }

      const { orderId, codePin } = orderRes.data;

      // Vider immédiatement le panier dès la création réussie de la commande
      clearCart();

      // 2. Simuler l'attente du code PIN sur le téléphone (UX UberEats)
      setUssdStep("waiting_pin");

      setTimeout(async () => {
        // 3. Valider le paiement Mobile Money
        const payRes = await processMobileMoneyPayment({
          orderId,
          amount: grandTotal,
          phone: mobileNumber,
          provider: selectedProvider,
        });

        if (!payRes.success || !payRes.data) {
          setUssdStep("idle");
          setErrorMsg(payRes.error || "Paiement Mobile Money non validé");
          return;
        }

        setConfirmedTransaction({
          ref: payRes.data.transactionRef,
          orderId,
          codePin,
        });
        setUssdStep("confirmed");

        // Redirection après 2 secondes vers le tracker en direct
        setTimeout(() => {
          router.push(`/orders/${orderId}`);
        }, 2200);
      }, 1500);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Colonne Principale : Coordonnées & Paiement Mobile Money */}
      <div className="lg:col-span-7 space-y-6">
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2">
            <span className="font-bold">Erreur :</span> {errorMsg}
          </div>
        )}

        {/* 1. Adresse de livraison à Lubumbashi */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Adresse de livraison à Lubumbashi</h2>
              <p className="text-[11px] text-slate-500">Sélectionnez votre commune et indiquez les détails d&apos;accès</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Commune de Lubumbashi
              </label>
              <select
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {LUBUMBASHI_COMMUNES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Avenue, Numéro ou Concession
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={addressDetails}
                  onChange={(e) => setAddressDetails(e.target.value)}
                  placeholder="Ex: Boulevard Msiri, près du Carrefour"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Instructions pour le coursier (UberEats Feature) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Précisions pour le livreur (repères locaux)
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Optionnel</span>
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Ex: Portail blanc en face de l'Hôtel Karavia, appeler à la barrière du Golf"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* 2. Pourboire au coursier (UberEats Feature) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-xs font-bold text-slate-900">Encourager votre coursier lushois</h3>
                <p className="text-[11px] text-slate-500">100% du pourboire est directement reversé au livreur</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              +{formatPrice(tip)}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2.5 pt-1">
            {TIP_OPTIONS.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setTip(amount)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  tip === amount
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                {amount === 0 ? "Aucun" : formatPrice(amount)}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Paiement Mobile Money RDCongo */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Paiement Mobile Money RDC</h2>
              <p className="text-[11px] text-slate-500">Paiement instantané en Francs Congolais (CDF) par USSD Push</p>
            </div>
          </div>

          {/* Grille des 4 Opérateurs RDC */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {OPERATORS.map((op) => {
              const isSelected = selectedProvider === op.id;
              return (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => setSelectedProvider(op.id)}
                  className={`relative p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[95px] ${
                    isSelected
                      ? `${op.bgLight} ${op.borderColor} ring-2 ring-emerald-500/20 shadow-xs`
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100/70"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[11px] font-bold text-slate-900">{op.name.split(" ")[0]}</span>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <span className="text-[9px] text-slate-500 block">Préfixes</span>
                    <span className="text-[10px] font-semibold text-slate-700">{op.prefixes}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Saisie du Numéro de téléphone congolais */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                Numéro {currentOp.name} pour le débit
              </label>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                Auto-détection RDC
              </span>
            </div>

            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="+243 82 000 0000"
              required
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />

            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              Une requête USSD push sera envoyée sur ce numéro pour confirmation par code PIN.
            </p>
          </div>

          {/* Bouton de confirmation de commande */}
          <button
            type="button"
            onClick={handleCheckout}
            disabled={isPending || ussdStep !== "idle"}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending || ussdStep !== "idle" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Traitement de la commande...
              </>
            ) : (
              <>
                <span>Commander & Payer {formatPrice(grandTotal)}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Colonne Récapitulatif Panier & UberEats Assurance */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5 sticky top-20">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              {restaurantName || "Restaurant Partenaire"}
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-2">Récapitulatif de commande</h3>
            <p className="text-xs text-slate-500">{items.length} article(s) sélectionné(s)</p>
          </div>

          {/* Liste des plats */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 text-xs">
            {items.map((it) => (
              <div key={it.dish.id} className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <div className="space-y-0.5 max-w-[70%]">
                  <span className="font-semibold text-slate-800">
                    {it.quantity}x {it.dish.nom}
                  </span>
                  {it.notes && <p className="text-[10px] text-slate-400 italic">&ldquo;{it.notes}&rdquo;</p>}
                </div>
                <span className="font-bold text-slate-900">{formatPrice(it.dish.prix * it.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Décomposition financière */}
          <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Sous-total plats</span>
              <span className="font-medium text-slate-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Frais de livraison Lubumbashi</span>
              <span className="font-medium text-slate-900">{formatPrice(effectiveDeliveryFee)}</span>
            </div>
            {tip > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Pourboire coursier</span>
                <span>+{formatPrice(tip)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-200">
              <span>Total à payer</span>
              <span className="text-emerald-700">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          {/* Badges de Réassurance UberEats */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-[11px] text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Paiement sécurisé par <strong>{currentOp.name}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Remise protégée par <strong>Code PIN 4 chiffres</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Interactive USSD Push Simulation (Expérience Mobile Money) */}
      {ussdStep !== "idle" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-xl text-center space-y-6">
            {ussdStep === "pushing" && (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <Radio className="w-8 h-8 animate-pulse text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Envoi de la requête Mobile Money...</h3>
                <p className="text-xs text-slate-500">
                  Connexion au réseau <strong>{currentOp.name}</strong> en cours pour le compte <strong>{mobileNumber}</strong>.
                </p>
              </div>
            )}

            {ussdStep === "waiting_pin" && (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 animate-bounce">
                  <Smartphone className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Validation USSD requise</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Une invite de paiement est apparue sur votre téléphone. Composez votre{" "}
                  <strong className="text-slate-900">code PIN secret</strong> pour valider le montant de{" "}
                  <strong className="text-emerald-700">{formatPrice(grandTotal)}</strong>.
                </p>
                <div className="py-2 px-4 bg-slate-50 rounded-xl border border-slate-200 text-[11px] font-mono text-slate-700 inline-block">
                  Opérateur : {currentOp.name} • Haut-Katanga
                </div>
              </div>
            )}

            {ussdStep === "confirmed" && confirmedTransaction && (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Paiement Mobile Money validé !</h3>
                <p className="text-xs text-slate-500">
                  Votre commande a été transmise au restaurant avec succès.
                </p>
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-left space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Référence :</span>
                    <span className="font-mono font-bold text-slate-900">{confirmedTransaction.ref}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Code PIN remise :</span>
                    <span className="font-mono font-bold text-emerald-700">{confirmedTransaction.codePin}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">Redirection vers le suivi de commande en direct...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
