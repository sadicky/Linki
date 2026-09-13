import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Linki — Livraison de nourriture & Suivi temps réel",
  description:
    "Application SaaS de livraison de nourriture ultra-rapide. Commandez chez vos restaurants favoris, suivez votre livreur en temps réel sur la carte interactive.",
  keywords: ["livraison repas", "food delivery", "restaurant", "coursier", "linki", "saas"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full bg-slate-50 text-slate-900">
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
