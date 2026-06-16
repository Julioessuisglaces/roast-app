// Server-side roast. Holds the Anthropic key (never exposed to the browser).
const SYSTEM_PROMPT = require("../../components/prompt").SYSTEM_PROMPT;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  const { pageText, goalLabel, goalHint, market } = req.body || {};
  if (!pageText || pageText.trim().length < 40) return res.status(400).json({ error: "short" });

  const userContent =
    `The page owner's stated goal for this page is: "${goalLabel}" — ${goalHint}\n\n` +
    `This is a ${String(market).toUpperCase()} page. Apply the right lens: B2B sells to a buying committee where the reader must justify the choice to others — their deep fear is career/decision risk, proof means case studies, named logos, ROI and security, and the honest CTA is usually transitional (book a demo, talk to sales), so do NOT punish a soft CTA. B2C sells to one person deciding for themselves — the driver is often identity, aspiration or relief, proof means reviews, real user photos and founder authenticity, and a direct CTA (buy, start) is appropriate. Judge the page's PROBLEM beat (especially the internal problem), its PROOF, and its CTA against the right market.\n\n` +
    `Judge the page primarily against THAT goal. Weight the SB7 beats toward what that goal needs, and do not punish the page for failing at a job it isn't trying to do. If the goal and the copy are fundamentally mismatched, or the page uses B2C tactics on a B2B buyer (or vice versa), say so — that itself is the most important roast.\n\n` +
    `LANGUAGE: Detect the language of the page copy below and write EVERY string in your JSON response in THAT SAME language. Keep the JSON keys in English exactly as specified.\n\n` +
    `Here is the page's copy and structure:\n\n${pageText}`;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2200,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userContent }],
      }),
    });
    if (!r.ok) {
      const detail = await r.text();
      return res.status(502).json({ error: "api", status: r.status, detail: detail.slice(0, 300) });
    }
    const data = await r.json();
    let text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("").trim();
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");
    if (first === -1 || last === -1) return res.status(502).json({ error: "no-json" });
    return res.status(200).json(JSON.parse(text.slice(first, last + 1)));
  } catch (e) {
    return res.status(500).json({ error: "server", detail: String(e.message || e) });
  }
}
