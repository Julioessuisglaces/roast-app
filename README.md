# Landing Roast — deployable app

A Next.js version of the landing-page roast tool, ready for Vercel.
The Anthropic API key lives server-side (never in the browser), and page
fetching runs server-side too — so the "Paste a URL" mode works in a real
deployment (it cannot work inside the Claude artifact sandbox).

## What's inside
- `pages/index.js` — the full UI (FR/DE/EN, B2C/B2B, goals, paywall, design).
- `pages/api/roast.js` — server route that calls Anthropic with your key.
- `pages/api/fetch-page.js` — server route that reads a URL (Jina Reader + raw fallback).
- `components/prompt.js` — the SB7 roast system prompt (server-side only).

## Deploy to Vercel (matches the dashboard you're on)
1. Put this folder in a GitHub repo (create repo → upload files, or `git push`).
2. In Vercel → **Add New… → Project → Import** your repo.
3. Framework preset: **Next.js** (auto-detected). Leave build settings default.
4. Open **Settings → Environment Variables** and add:
   - `ANTHROPIC_API_KEY` = your key from console.anthropic.com
5. Click **Deploy**. You'll get a live `your-app.vercel.app` URL.
6. Open it, switch to "Coller une URL" / "Paste a URL", paste a real page — the
   fetch now works because Vercel is not sandboxed.

## Connect your Hostinger subdomain (optional)
1. Vercel → project → **Settings → Domains** → add `verdict.julienioset.ch`.
2. Vercel shows a CNAME target (e.g. `cname.vercel-dns.com`).
3. Hostinger → hPanel → **Domains → DNS** → add a **CNAME**:
   - Name: `verdict`   Value: the Vercel target.
4. Wait for DNS to propagate. The subdomain then serves the app.

## Notes
- Payments are NOT wired yet. The unlock button is still the stub from the
  prototype (grants a local 7-day pass). To charge real money, add Stripe
  Checkout + a webhook that records the pass server-side, and gate /api/roast's
  full "cure" output behind a verified pass. This is the next build step.
- URL reading won't work on every site (heavy-JS apps, scraper-blocked, or
  login-walled pages may return thin text). The UI falls back to pasting.
- Cost: Vercel Hobby is free; Anthropic API is a few cents per roast.
