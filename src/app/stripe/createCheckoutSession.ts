"use server";

import Stripe from "stripe";

const key = process.env.STRIPE_KEY;
const stripe = new Stripe(key || "", {
  apiVersion: "2024-06-20",
});

export async function createCheckoutSession(priceId: string, userID: string) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: "http://localhost:3001/success",
    cancel_url: "http://localhost:3001/pricing",
    metadata: {
      userID,
    },
  });

  return session.url!;
}
