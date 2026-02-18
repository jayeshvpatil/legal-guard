import { Hono } from "hono";

const webhook = new Hono();

// Stripe webhook handler (placeholder — requires Stripe keys)
webhook.post("/stripe", async (c) => {
  const signature = c.req.header("stripe-signature");

  if (!signature) {
    return c.json({ error: "Missing stripe-signature header" }, 400);
  }

  // TODO: Verify webhook signature and process events
  // - checkout.session.completed → activate scan
  // - customer.subscription.created → set plan to unlimited
  // - customer.subscription.deleted → set plan to free

  return c.json({ received: true });
});

export default webhook;
