import { CheckoutForm } from "@/components/client/CheckoutForm";

export default function CheckoutPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Finaliser ma commande</h1>
        <p className="text-xs text-slate-500 mt-1">
          Confirmez votre adresse à Lubumbashi et réglez en toute sécurité par Mobile Money en Francs Congolais (CDF).
        </p>
      </div>

      <CheckoutForm />
    </div>
  );
}
