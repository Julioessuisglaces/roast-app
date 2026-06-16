// Creates a Stripe Checkout session for a one-off CHF 9 / 7-day pass.
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  try {
    const origin = req.headers.origin || `https://${req.headers.host}`;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "chf",
            product_data: {
              name: "Le verdict sans détour — Pass 7 jours",
              description: "Analyses illimitées et corrections complètes pendant 7 jours.",
            },
            unit_amount: 900, // CHF 9.00, in centimes
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
    });
    return res.status(200).json({ url: session.url });
  } catch (e) {
    return res.status(500).json({ error: "checkout", detail: String(e.message || e) });
  }
}
