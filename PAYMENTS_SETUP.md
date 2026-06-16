# Adding payments — step by step

Your tool is already live. This adds the real CHF 9 / 7-day pass.
The model is ONE-OFF (single payment, no subscription).

## How it works (plain terms)
- Free users get the diagnosis (verdict, score, hero check, the one fix).
- Clicking unlock sends them to Stripe to pay CHF 9.
- After paying, Stripe returns them to the site; the server confirms the
  payment and issues a signed 7-day "pass".
- With a valid pass they get the full cure (all roasts, headline rewrites,
  imagery, page skeleton) and can re-roast freely for 7 days.
- The cure is removed server-side for anyone without a valid pass, so it
  cannot be unlocked from the browser.

## STEP 1 — Get a Stripe account + test key
1. Go to stripe.com, sign up (free).
2. Stay in TEST MODE (toggle top-right says "Test mode"). No real money yet.
3. Developers → API keys → copy your "Secret key" (starts with sk_test_...).

## STEP 2 — Invent a pass secret
Make up one long random string, e.g. mash the keyboard:
  PASS_SECRET=k7Qm2pX9raL4zVbN8tH3wEjU6sYd1cF0
Keep it private. It is what stops people forging passes.

## STEP 3 — Add the new files to GitHub
Re-upload the updated project to your `roast-app` repo (same Chrome
folder-drag method as before). Changed/new files:
  package.json            (now includes "stripe")
  pages/index.js          (real checkout + pass handling)
  pages/api/roast.js      (cure now gated)
  pages/api/checkout.js   (NEW)
  pages/api/verify.js     (NEW)
  lib/pass.js             (NEW — drag the whole `lib` folder)
GitHub makes a new commit; Vercel redeploys automatically.

## STEP 4 — Add the two new environment variables in Vercel
Vercel → your project → Settings → Environment Variables → add:
  STRIPE_SECRET_KEY = your sk_test_... key
  PASS_SECRET       = the random string from Step 2
(ANTHROPIC_API_KEY is already there.) Then redeploy if it doesn't auto-redeploy.

## STEP 5 — Test the payment with a fake card
On the live site: run a roast → click unlock → on Stripe's page use the
TEST card:  4242 4242 4242 4242, any future expiry, any CVC, any postcode.
You'll be sent back and the cure unlocks. No real money moves in test mode.

## STEP 6 — Go live (only when you're happy)
In Stripe, switch from Test to Live mode, copy the LIVE secret key
(sk_live_...), and replace STRIPE_SECRET_KEY in Vercel with it. Now real
cards are charged. Stripe takes ~2.9% + 0.30 per sale.

## Note — this is an MVP payment flow
It verifies payment on redirect rather than via a Stripe webhook. That's
fine to launch. If you later want it more robust (handles the rare case
where someone closes the tab before redirect), add a webhook — a later step.
