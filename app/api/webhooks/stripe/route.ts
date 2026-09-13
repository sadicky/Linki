import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { demoStore } from "@/lib/mock-data";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (webhookSecret && sig && !webhookSecret.includes("mock")) {
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Signature invalide";
      return NextResponse.json({ error: `Webhook Error: ${msg}` }, { status: 400 });
    }
  } else {
    // Mode test ou sans signature configurée
    try {
      event = JSON.parse(body);
    } catch {
      return NextResponse.json({ received: true });
    }
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata?.order_id;

    if (orderId) {
      // 1. Mise à jour Supabase si configuré
      try {
        const supabase = createAdminClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = supabase as any;
        await db.from("orders").update({ statut: "acceptee" }).eq("id", orderId);
        await db.from("payments").upsert({
          order_id: orderId,
          stripe_payment_intent_id: paymentIntent.id,
          statut: "reussi",
          montant: (paymentIntent.amount || 0) / 100,
        });
      } catch {
        // Fallback démo
      }

      // 2. Mise à jour dans le magasin démo
      const order = demoStore.orders.find((o) => o.id === orderId);
      if (order && order.statut === "en_attente") {
        order.statut = "acceptee";
      }
    }
  }

  return NextResponse.json({ received: true });
}
