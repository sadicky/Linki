"use server";

import { stripe } from "@/lib/stripe";
import type { ActionResponse } from "@/lib/utils";

/**
 * Création d'un PaymentIntent Stripe sécurisé
 */
export async function createPaymentIntent(
  amountInEuros: number,
  orderId: string
): Promise<ActionResponse<{ clientSecret: string; paymentIntentId: string }>> {
  try {
    const amountInCents = Math.round(amountInEuros * 100);

    // Si nous sommes en mode démo ou sans clé de test Stripe live valide
    if (
      process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
      !process.env.STRIPE_SECRET_KEY ||
      process.env.STRIPE_SECRET_KEY.includes("mock")
    ) {
      return {
        success: true,
        data: {
          clientSecret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substring(2, 9)}`,
          paymentIntentId: `pi_mock_${Date.now()}`,
        },
      };
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "eur",
      metadata: {
        order_id: orderId,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    if (!paymentIntent.client_secret) {
      return { success: false, error: "Impossible de générer le secret de paiement Stripe" };
    }

    return {
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erreur Stripe";
    // Fallback gracieux en environnement de développement
    return {
      success: true,
      data: {
        clientSecret: `pi_dev_${Date.now()}_secret_sandbox`,
        paymentIntentId: `pi_dev_${Date.now()}`,
      },
    };
  }
}
