// After Stripe redirects back, confirm the session was actually paid,
// then issue a signed 7-day pass the browser can present to /api/roast.
const Stripe = require("stripe");
const { signPass } = require("../../lib/pass");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: "no-session" });
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status !== "paid") return res.status(402).json({ error: "unpaid" });
    const until = Date.now() + 7 * 24 * 60 * 60 * 1000;
    return res.status(200).json({ pass: signPass(until), until });
  } catch (e) {
    return res.status(500).json({ error: "verify", detail: String(e.message || e) });
  }
}
