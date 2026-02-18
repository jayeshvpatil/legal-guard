import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-01-27.acacia",
});

export async function createCheckoutSession(options: {
  plan: "single" | "unlimited";
  scanId?: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const priceId =
    options.plan === "single"
      ? process.env.STRIPE_PRICE_SINGLE
      : process.env.STRIPE_PRICE_MONTHLY;

  if (!priceId) {
    throw new Error(`Stripe price ID not configured for plan: ${options.plan}`);
  }

  const session = await stripe.checkout.sessions.create({
    mode: options.plan === "unlimited" ? "subscription" : "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: options.successUrl,
    cancel_url: options.cancelUrl,
    metadata: {
      scanId: options.scanId || "",
      plan: options.plan,
    },
  });

  return session;
}

export { stripe };
