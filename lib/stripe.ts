import Stripe from "stripe";

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_mock_stripe_key_for_dev",
  {
    apiVersion: "2025-01-27.acacia" as unknown as Stripe.LatestApiVersion,
    appInfo: {
      name: "Linki Food Delivery SaaS",
      version: "1.0.0",
    },
  }
);
