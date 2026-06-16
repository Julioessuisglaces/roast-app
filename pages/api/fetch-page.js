// Server-side page reader. Runs on Vercel (no browser CORS limits).
// Tries Jina Reader first (renders JS, returns clean text); falls back to raw HTML.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  let { url } = req.body || {};
  if (!url || typeof url !== "string") return res.status(400).json({ error: "no-url" });
  url = url.trim();
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;

  try {
    // Jina Reader: server-side render, clean text output.
    const r = await fetch("https://r.jina.ai/" + url, {
      headers: { "X-Return-Format": "text" },
    });
    if (r.ok) {
      const text = await r.text();
      if (text && text.trim().length > 60) {
        return res.status(200).json({ text: text.slice(0, 12000) });
      }
    }
  } catch (e) { /* fall through to raw fetch */ }

  try {
    // Fallback: fetch raw HTML and strip tags crudely.
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; RoastBot/1.0)" } });
    if (!r.ok) return res.status(502).json({ error: "fetch-failed" });
    const html = await r.text();
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!text || text.length < 60) return res.status(422).json({ error: "empty-page" });
    return res.status(200).json({ text: text.slice(0, 12000) });
  } catch (e) {
    return res.status(502).json({ error: "fetch-failed" });
  }
}
