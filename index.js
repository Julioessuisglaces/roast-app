import React, { useState, useRef } from "react";

// ── Design tokens — bright, modern, sky-blue palette ──
const C = {
  bg: "#F7FAFD", // cool off-white base
  gradTop: "#CFE6FB", // soft sky blue (top of gradient)
  gradBot: "#F7FAFD", // fades to base
  card: "#FFFFFF", // clean white cards
  border: "#E4ECF3", // soft cool hairline
  ink: "#0F1B2A", // deep navy near-black
  mid: "#6B7A8C", // cool muted grey
  accent: "#1E6FE0", // confident sky/azure blue
  accentSoft: "#E8F1FE", // tint for soft fills
  brown: "#1E6FE0", // alias kept pointing at accent (legacy refs)
  off: "#FFFFFF",
  // legacy aliases so existing references keep working
  grey: "#E4ECF3",
};
const SHADOW = "0 18px 50px -16px rgba(15,42,80,0.20)";
const SHADOW_SM = "0 6px 20px -8px rgba(15,42,80,0.15)";
const RADIUS = 18; // cards / inputs
const PILL = 999; // chips / buttons

// ── UI strings (FR / DE / EN). The roast OUTPUT language is set
//    separately — the model writes in the pasted page's language. ──
const T = {
  en: {
    eyebrow: "The Landing Page Roast",
    h1: "Does your landing page really convert?",
    sub: "It may look clear. But if your visitors hesitate, every click can become a missed opportunity.",
    sub2: "Paste your URL. Get a full analysis, marketing recommendations, and rewrite suggestions in under a minute.",
    priceLine: "CHF 9 — Full access for 7 days",
    who: "First — who do you sell to?",
    b2cHint: "Selling to individuals",
    b2bHint: "Selling to businesses",
    goalQ: "And — what's this page for?",
    pasteTab: "Paste copy",
    urlTab: "Paste a URL",
    urlPlaceholder: "yourdomain.com/landing-page",
    urlNote: "We'll read the live page automatically. JavaScript-heavy pages may not read cleanly — paste the copy if so.",
    pastePlaceholder: "Paste your headline, subhead, body copy, and button text here…",
    roastBtn: "Start the analysis",
    working: "Working…",
    hero: "Who's the hero?",
    oneThing: "If you fix one thing",
    cureTitle: "That's the diagnosis. Want the cure?",
    cureSub: "Unlock the full roast across all seven beats, the imagery your page needs, three rewritten headlines you can paste in today, and the exact page structure to rebuild it.",
    unlock: "Unlock the full fix",
    unlocking: "Unlocking…",
    oneOff: "One payment. 7 days of unlimited roasts. No subscription.",
    passActive: "Full access active — roast and re-roast freely until {date}.",
    headlines: "Headlines to use instead",
    showImg: "What the page should show",
    avoid: "Avoid",
    fix: "Fix",
    build: "The page you should build instead",
    goals: { convert: "Convert", trust: "Build trust", showcase: "Showcase a product", capture: "Capture a lead", explain: "Explain the offer" },
    goalHints: { convert: "Get visitors to buy, sign up, or book.", trust: "Reassure a wary visitor that you're credible.", showcase: "Make one product or feature shine.", capture: "Get an email or a booked call, not a sale yet.", explain: "Make a complex or new thing instantly clear." },
    statusFetch: "Fetching the page…",
    statusRead: "Reading it back to you…",
    errNoUrl: "Paste a URL first — e.g. yourdomain.com/landing.",
    errEmpty: "I reached the page but couldn't read meaningful text — it may be heavily JavaScript-based or blocked. Try pasting the copy instead.",
    errFetch: "Couldn't fetch that URL. The preview sandbox may block external sites, or the page may be down. Paste the copy instead, or try again once deployed.",
    errShort: "Paste the actual landing-page copy — headline, subhead, buttons, the lot.",
    errApi: "The API rejected the request ({code}). If this is the preview sandbox, try the deployed version.",
    errFormat: "The model replied but not in the expected format. Try again — if it persists, the input may be too long.",
    errGeneric: "Something broke before a roast came back. Try again, or switch to pasting the copy.",
  },
  fr: {
    eyebrow: "Le verdict sans détour",
    h1: "Votre landing page convertit-elle vraiment ?",
    sub: "Elle peut sembler claire. Mais si vos visiteurs hésitent, chaque clic peut devenir une occasion perdue.",
    sub2: "Collez votre URL. Obtenez une analyse complète, des recommandations marketing et des suggestions de réécriture en moins d'une minute.",
    priceLine: "CHF 9 — Accès complet pendant 7 jours",
    who: "D'abord. À qui vendez-vous ?",
    b2cHint: "Vente aux particuliers",
    b2bHint: "Vente aux entreprises",
    goalQ: "Ensuite. Quel est le but de cette page ?",
    pasteTab: "Coller le texte",
    urlTab: "Coller une URL",
    urlPlaceholder: "votredomaine.ch/page",
    urlNote: "Nous lisons la page en direct. Les pages très chargées en JavaScript peuvent mal se lire. Collez le texte si besoin.",
    pastePlaceholder: "Collez votre titre, sous-titre, corps de texte et libellés de boutons ici…",
    roastBtn: "Commencer l'analyse",
    working: "En cours…",
    hero: "Qui est le héros ?",
    oneThing: "Si vous ne corrigez qu'une chose",
    cureTitle: "Voilà le diagnostic. Vous voulez le remède ?",
    cureSub: "Débloquez l'analyse complète sur les sept points, les visuels dont votre page a besoin, trois titres réécrits prêts à l'emploi, et la structure exacte pour reconstruire la page.",
    unlock: "Débloquer la correction complète",
    unlocking: "Déblocage…",
    oneOff: "Un seul paiement. 7 jours d'analyses illimitées. Sans abonnement.",
    passActive: "Accès complet actif. Analysez et réanalysez librement jusqu'au {date}.",
    headlines: "Titres à utiliser à la place",
    showImg: "Ce que la page devrait montrer",
    avoid: "À éviter",
    fix: "Correction",
    build: "La page que vous devriez construire",
    goals: { convert: "Convertir", trust: "Inspirer confiance", showcase: "Mettre en valeur un produit", capture: "Gagner des leads", explain: "Expliquer l'offre" },
    goalHints: { convert: "Inciter à acheter, s'inscrire ou réserver.", trust: "Rassurer un visiteur méfiant sur votre crédibilité.", showcase: "Faire briller un produit ou une fonction.", capture: "Obtenir un contact qualifié, pas encore une vente.", explain: "Rendre une offre complexe immédiatement claire." },
    statusFetch: "Lecture de la page…",
    statusRead: "Analyse en cours…",
    errNoUrl: "Collez d'abord une URL. Par exemple votredomaine.ch/page.",
    errEmpty: "J'ai atteint la page mais n'ai pas pu en lire le texte. Elle est peut-être trop chargée en JavaScript ou bloquée. Collez plutôt le texte.",
    errFetch: "Impossible de récupérer cette URL. L'aperçu bloque peut-être les sites externes, ou la page est indisponible. Collez le texte, ou réessayez une fois déployé.",
    errShort: "Collez le texte réel de la page. Titre, sous-titre, boutons, tout.",
    errApi: "L'API a refusé la requête ({code}). S'il s'agit de l'aperçu, essayez la version déployée.",
    errFormat: "Le modèle a répondu dans un format inattendu. Réessayez. Si cela persiste, le texte est peut-être trop long.",
    errGeneric: "Une erreur est survenue avant l'analyse. Réessayez, ou collez le texte directement.",
  },
  de: {
    eyebrow: "Der Landingpage-Roast",
    h1: "Konvertiert Ihre Landingpage wirklich?",
    sub: "Sie mag klar wirken. Aber wenn Ihre Besucher zögern, kann jeder Klick zur verpassten Chance werden.",
    sub2: "Fügen Sie Ihre URL ein. Erhalten Sie in unter einer Minute eine vollständige Analyse, Marketing-Empfehlungen und Umschreibvorschläge.",
    priceLine: "CHF 9 — Voller Zugang für 7 Tage",
    who: "Zuerst — an wen verkaufen Sie?",
    b2cHint: "Verkauf an Privatpersonen",
    b2bHint: "Verkauf an Unternehmen",
    goalQ: "Dann — wofür ist diese Seite?",
    pasteTab: "Text einfügen",
    urlTab: "URL einfügen",
    urlPlaceholder: "ihredomain.ch/seite",
    urlNote: "Wir lesen die Live-Seite automatisch. Stark JavaScript-basierte Seiten lassen sich evtl. schlecht lesen — fügen Sie dann den Text ein.",
    pastePlaceholder: "Fügen Sie hier Ihre Überschrift, Unterzeile, Fließtext und Button-Texte ein…",
    roastBtn: "Analyse starten",
    working: "Läuft…",
    hero: "Wer ist der Held?",
    oneThing: "Wenn Sie nur eines ändern",
    cureTitle: "Das ist die Diagnose. Wollen Sie die Lösung?",
    cureSub: "Schalten Sie die vollständige Analyse über alle sieben Punkte frei, die nötigen Bilder, drei umgeschriebene Überschriften zum sofortigen Einsetzen und die genaue Seitenstruktur zum Neuaufbau.",
    unlock: "Vollständige Lösung freischalten",
    unlocking: "Wird freigeschaltet…",
    oneOff: "Eine Zahlung. 7 Tage unbegrenzte Analysen. Kein Abo.",
    passActive: "Voller Zugang aktiv — analysieren Sie beliebig oft bis zum {date}.",
    headlines: "Diese Überschriften stattdessen",
    showImg: "Was die Seite zeigen sollte",
    avoid: "Vermeiden",
    fix: "Korrektur",
    build: "Die Seite, die Sie bauen sollten",
    goals: { convert: "Konvertieren", trust: "Vertrauen aufbauen", showcase: "Produkt präsentieren", capture: "Lead gewinnen", explain: "Angebot erklären" },
    goalHints: { convert: "Besucher zum Kauf, zur Anmeldung oder Buchung bewegen.", trust: "Einen skeptischen Besucher von Ihrer Glaubwürdigkeit überzeugen.", showcase: "Ein Produkt oder Feature hervorheben.", capture: "Eine E-Mail oder einen Termin gewinnen, noch keinen Verkauf.", explain: "Ein komplexes Angebot sofort verständlich machen." },
    statusFetch: "Seite wird gelesen…",
    statusRead: "Analyse läuft…",
    errNoUrl: "Fügen Sie zuerst eine URL ein — z. B. ihredomain.ch/seite.",
    errEmpty: "Ich habe die Seite erreicht, aber keinen sinnvollen Text gefunden — sie ist evtl. stark JavaScript-basiert oder blockiert. Fügen Sie den Text ein.",
    errFetch: "URL konnte nicht abgerufen werden. Die Vorschau blockiert evtl. externe Seiten, oder die Seite ist offline. Fügen Sie den Text ein oder versuchen Sie es nach dem Deployment erneut.",
    errShort: "Fügen Sie den echten Seitentext ein — Überschrift, Unterzeile, Buttons, alles.",
    errApi: "Die API hat die Anfrage abgelehnt ({code}). In der Vorschau bitte die deployte Version verwenden.",
    errFormat: "Das Modell hat in einem unerwarteten Format geantwortet. Versuchen Sie es erneut — bei Wiederholung ist der Text evtl. zu lang.",
    errGeneric: "Etwas ist vor der Analyse schiefgelaufen. Versuchen Sie es erneut oder fügen Sie den Text ein.",
  },
};


const GRADE_COLOR = (g) =>
  ({
    "Dead on arrival": "#8B3A2F",
    Forgettable: "#717171",
    "Has a pulse": "#9A7B3F",
    "Actually works": "#4A6B45",
    Rare: "#61513D",
  }[g] || "#717171");

const GOAL_IDS = ["convert", "trust", "showcase", "capture", "explain"];

export default function App() {
  const [lang, setLang] = useState("fr"); // FR default — primary market
  const [mode, setMode] = useState("paste"); // "paste" | "url"
  const [input, setInput] = useState("");
  const [url, setUrl] = useState("");
  const [goal, setGoal] = useState("convert");
  const [market, setMarket] = useState("b2c");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(""); // shown while fetching/reading
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [unlocked, setUnlocked] = useState(false); // does a valid pass cover this session
  const [passUntil, setPassUntil] = useState(0); // pass expiry timestamp (ms)
  const [pass, setPass] = useState(""); // signed pass token from the server
  const [paying, setPaying] = useState(false);
  const cardRef = useRef(null);

  const t = T[lang]; // current UI strings
  const PRICE = "CHF 9";

  // On mount: restore any saved pass, and handle the return from Stripe.
  React.useEffect(() => {
    // 1. Restore a previously bought pass from this browser.
    try {
      const saved = localStorage.getItem("roastPass");
      const until = parseInt(localStorage.getItem("roastPassUntil") || "0", 10);
      if (saved && until > Date.now()) {
        setPass(saved);
        setPassUntil(until);
        setUnlocked(true);
      }
    } catch {}

    // 2. If Stripe just sent the buyer back, verify the payment and store the pass.
    try {
      const params = new URLSearchParams(window.location.search);
      const sid = params.get("session_id");
      if (sid) {
        fetch("/api/verify?session_id=" + encodeURIComponent(sid))
          .then((r) => (r.ok ? r.json() : Promise.reject()))
          .then((d) => {
            if (d.pass) {
              setPass(d.pass);
              setPassUntil(d.until);
              setUnlocked(true);
              try {
                localStorage.setItem("roastPass", d.pass);
                localStorage.setItem("roastPassUntil", String(d.until));
              } catch {}
            }
          })
          .catch(() => {})
          .finally(() => {
            // Clean the session_id out of the URL.
            window.history.replaceState({}, "", window.location.pathname);
          });
      }
    } catch {}
  }, []);

  // ── PAYMENT: send the buyer to Stripe Checkout ──────────────
  const unlock = async () => {
    setPaying(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location = data.url; // off to Stripe; returns to /?session_id=...
      } else {
        setError(t.errGeneric);
        setPaying(false);
      }
    } catch (e) {
      setError(t.errGeneric);
      setPaying(false);
    }
  };

  // Fetch readable page text via our server route (no CORS, JS-rendered).
  const fetchPageText = async (rawUrl) => {
    const res = await fetch("/api/fetch-page", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: rawUrl }),
    });
    if (res.status === 422) throw new Error("empty-page");
    if (!res.ok) throw new Error("reader-failed");
    const data = await res.json();
    if (!data.text || data.text.trim().length < 60) throw new Error("empty-page");
    return data.text;
  };

  const roast = async () => {
    setError(null);
    let pageText = input;

    // Resolve the input depending on mode.
    if (mode === "url") {
      if (!url.trim()) {
        setError(t.errNoUrl);
        return;
      }
      setLoading(true);
      setResult(null);
      setStatus(t.statusFetch);
      try {
        pageText = await fetchPageText(url);
      } catch (e) {
        setLoading(false);
        setStatus("");
        setError(e.message === "empty-page" ? t.errEmpty : t.errFetch);
        return;
      }
    } else {
      if (input.trim().length < 40) {
        setError(t.errShort);
        return;
      }
      setLoading(true);
      setResult(null);
    }

    setStatus(t.statusRead);
    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageText,
          goalLabel: T.en.goals[goal],
          goalHint: T.en.goalHints[goal],
          market,
          pass, // signed pass token; server gates the cure on it
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error("api-" + (err.status || res.status));
      }
      const parsed = await res.json();
      setResult(parsed);
      // The server only includes the cure (roasts/rewrites/skeleton) when the
      // pass is valid. Show the unlocked view exactly when it sent the cure.
      setUnlocked(Boolean(parsed.paid));
    } catch (e) {
      const msg = String(e.message || e);
      setError(
        msg.startsWith("api-")
          ? t.errApi.replace("{code}", msg)
          : msg.startsWith("no-json")
          ? t.errFormat
          : t.errGeneric
      );
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${C.gradTop} 0%, ${C.gradBot} 460px)`, color: C.ink, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=DM+Sans:wght@400;500;700&display=swap');
        * { box-sizing: border-box; }
        textarea:focus, input:focus, button:focus-visible { outline: 2px solid ${C.accent}; outline-offset: 2px; }
        textarea::placeholder, input::placeholder { color: ${C.mid}; opacity: 0.7; }
        @media (prefers-reduced-motion: no-preference){ .fade{ animation: f .5s cubic-bezier(.2,.7,.2,1) both; } }
        @keyframes f { from{opacity:0; transform:translateY(10px);} to{opacity:1; transform:none;} }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px 96px" }}>
        {/* Language switcher */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginBottom: 28 }}>
          {["fr", "de", "en"].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                padding: "5px 11px", fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 700,
                letterSpacing: "0.05em", cursor: "pointer", borderRadius: PILL,
                border: `1px solid ${lang === l ? C.ink : C.border}`,
                background: lang === l ? C.ink : "transparent",
                color: lang === l ? C.off : C.mid,
              }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Hero */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: PILL, background: C.accentSoft, marginBottom: 22 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.accent, display: "inline-block" }} />
          <span style={{ fontFamily: "'DM Sans'", textTransform: "uppercase", letterSpacing: "0.16em", fontSize: 11, fontWeight: 700, color: C.accent }}>
            {t.eyebrow}
          </span>
        </div>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", color: C.ink, fontWeight: 600, fontSize: 64, lineHeight: 1.0, margin: "0 0 22px", letterSpacing: "-0.025em", maxWidth: 720 }}>
          {t.h1}
        </h1>
        <p style={{ color: C.mid, fontSize: 19, lineHeight: 1.55, maxWidth: 580, margin: "0 0 18px" }}>
          {t.sub}
        </p>
        {t.sub2 && (
          <p style={{ color: C.ink, fontSize: 17, lineHeight: 1.55, maxWidth: 580, margin: "0 0 22px" }}>
            {t.sub2}
          </p>
        )}
        {t.priceLine && (
          <div style={{ display: "inline-flex", alignItems: "center", padding: "8px 16px", borderRadius: PILL, background: C.accentSoft, color: C.accent, fontWeight: 700, fontSize: 14.5, marginBottom: 44 }}>
            {t.priceLine}
          </div>
        )}

        {/* Market selector — broadest frame, comes first */}
        <p style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.mid, margin: "0 0 12px" }}>
          {t.who}
        </p>
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {[
            { id: "b2c", label: "B2C", hint: t.b2cHint },
            { id: "b2b", label: "B2B", hint: t.b2bHint },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMarket(m.id)}
              style={{
                padding: "9px 20px", fontFamily: "'DM Sans'", fontSize: 14, fontWeight: 500,
                cursor: "pointer", borderRadius: PILL,
                border: `1px solid ${market === m.id ? C.ink : C.border}`,
                background: market === m.id ? C.ink : C.card,
                color: market === m.id ? C.off : C.mid,
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Goal selector */}
        <p style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.mid, margin: "0 0 12px" }}>
          {t.goalQ}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
          {GOAL_IDS.map((id) => (
            <button
              key={id}
              onClick={() => setGoal(id)}
              style={{
                padding: "9px 16px", fontFamily: "'DM Sans'", fontSize: 14, fontWeight: 500,
                cursor: "pointer", borderRadius: PILL,
                border: `1px solid ${goal === id ? C.ink : C.border}`,
                background: goal === id ? C.ink : C.card,
                color: goal === id ? C.off : C.mid,
              }}
            >
              {t.goals[id]}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 13, color: C.mid, margin: "0 0 28px", minHeight: 18 }}>
          {t.goalHints[goal]}
        </p>

        {/* Input mode toggle */}
        <div style={{ display: "flex", gap: 24, marginBottom: 14, borderBottom: `1px solid ${C.grey}` }}>
          {[
            { id: "paste", label: t.pasteTab },
            { id: "url", label: t.urlTab },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => { setMode(m.id); setError(null); }}
              style={{
                padding: "0 0 12px", fontFamily: "'DM Sans'", fontSize: 15, fontWeight: 700,
                cursor: "pointer", background: "none", border: "none",
                color: mode === m.id ? C.ink : C.mid,
                borderBottom: `2px solid ${mode === m.id ? C.accent : "transparent"}`,
                marginBottom: -1,
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Input */}
        {mode === "url" ? (
          <div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && roast()}
              placeholder={t.urlPlaceholder}
              style={{
                width: "100%", padding: 18, fontSize: 16, fontFamily: "'DM Sans'",
                color: C.ink, background: C.card, border: `1px solid ${C.border}`,
                borderRadius: RADIUS, boxShadow: SHADOW_SM,
              }}
            />
            <p style={{ fontSize: 13, color: C.mid, margin: "10px 0 0" }}>
              {t.urlNote}
            </p>
          </div>
        ) : (
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.pastePlaceholder}
            rows={9}
            style={{
              width: "100%", padding: 20, fontSize: 15, lineHeight: 1.5,
              fontFamily: "'DM Sans'", color: C.ink, background: C.card,
              border: `1px solid ${C.border}`, borderRadius: RADIUS, resize: "vertical", boxShadow: SHADOW_SM,
            }}
          />
        )}
        <button
          onClick={roast}
          disabled={loading}
          style={{
            marginTop: 18, padding: "16px 38px", fontFamily: "'DM Sans'", fontWeight: 700,
            fontSize: 16, letterSpacing: "0.01em", color: "#fff", background: loading ? C.mid : C.accent,
            border: "none", borderRadius: PILL, cursor: loading ? "default" : "pointer",
            display: "inline-flex", alignItems: "center", gap: 10,
            boxShadow: loading ? "none" : "0 10px 24px -8px rgba(30,111,224,0.45)",
          }}
        >
          {loading && (
            <span
              style={{
                width: 16, height: 16, borderRadius: "50%",
                border: `2px solid rgba(252,252,249,0.35)`, borderTopColor: C.off,
                display: "inline-block", animation: "spin 0.7s linear infinite",
              }}
            />
          )}
          {loading ? (status || t.working) : t.roastBtn}
        </button>

        {error && <p style={{ color: "#8B3A2F", marginTop: 16, fontSize: 14 }}>{error}</p>}

        {/* Result */}
        {result && (
          <div ref={cardRef} className="fade" style={{ marginTop: 48, background: C.card, border: `1px solid ${C.border}`, borderRadius: RADIUS, overflow: "hidden", boxShadow: SHADOW }}>
            <div style={{ padding: "32px 32px 28px", borderBottom: `1px solid ${C.grey}` }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: GRADE_COLOR(result.grade) }}>
                  {result.grade}
                </span>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 46, fontWeight: 800, color: C.accent, lineHeight: 1 }}>
                  {result.score}<span style={{ fontSize: 20, color: C.mid }}>/100</span>
                </span>
              </div>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 27, lineHeight: 1.22, color: C.ink, margin: "18px 0 0", letterSpacing: "-0.015em" }}>
                “{result.verdict}”
              </p>
              {result.heroCheck && (
                <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${C.grey}` }}>
                  <p style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.mid, margin: "0 0 6px" }}>
                    {t.hero}
                  </p>
                  <p style={{ fontSize: 16, lineHeight: 1.5, color: C.ink, margin: 0 }}>{result.heroCheck}</p>
                </div>
              )}
            </div>

            {/* FREE: the single highest-leverage fix, always shown */}
            {result.oneThing && (
              <div style={{ background: C.accentSoft, padding: "26px 32px" }}>
                <p style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.accent, margin: "0 0 8px" }}>
                  {t.oneThing}
                </p>
                <p style={{ fontSize: 17, lineHeight: 1.5, color: C.ink, margin: 0 }}>{result.oneThing}</p>
              </div>
            )}

            {/* PAYWALL GATE — full diagnosis + the cure */}
            {!unlocked ? (
              <div style={{ padding: "36px 32px", borderTop: `1px solid ${C.grey}`, textAlign: "center" }}>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 30, fontWeight: 800, color: C.ink, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
                  {t.cureTitle}
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.55, color: C.mid, maxWidth: 440, margin: "0 auto 22px" }}>
                  {t.cureSub}
                </p>
                <button
                  onClick={unlock}
                  disabled={paying}
                  style={{
                    padding: "15px 38px", fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 15,
                    color: "#fff", background: paying ? C.mid : C.accent, border: "none", borderRadius: PILL, boxShadow: paying ? "none" : "0 10px 24px -8px rgba(30,111,224,0.45)",
                    cursor: paying ? "default" : "pointer",
                  }}
                >
                  {paying ? t.unlocking : `${t.unlock} — ${PRICE}`}
                </button>
                <p style={{ fontSize: 12, color: C.mid, margin: "14px 0 0" }}>
                  {t.oneOff}
                </p>
              </div>
            ) : (
              <>
                {passUntil > 0 && (
                  <div style={{ padding: "12px 32px", background: C.ink }}>
                    <p style={{ fontFamily: "'DM Sans'", fontSize: 12.5, color: C.off, margin: 0, letterSpacing: "0.01em" }}>
                      {t.passActive.replace("{date}", new Date(passUntil).toLocaleDateString(lang === "en" ? "en-GB" : lang === "de" ? "de-CH" : "fr-CH"))}
                    </p>
                  </div>
                )}
                <div style={{ padding: "8px 32px" }}>
                  {result.roasts?.map((r, i) => (
                    <div key={i} style={{ padding: "22px 0", borderTop: i === 0 ? `1px solid ${C.grey}` : "none", borderBottom: i < result.roasts.length - 1 ? `1px solid ${C.grey}` : "none" }}>
                      <p style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.mid, margin: "0 0 8px" }}>
                        {r.axis}
                      </p>
                      <p style={{ fontSize: 16, lineHeight: 1.5, color: C.ink, margin: "0 0 8px" }}>{r.hit}</p>
                      <p style={{ fontSize: 15, lineHeight: 1.5, color: C.accent, margin: 0 }}>
                        <span style={{ fontWeight: 700 }}>{t.fix} → </span>{r.fix}
                      </p>
                    </div>
                  ))}
                </div>

                {result.headlineRewrites?.length > 0 && (
                  <div style={{ padding: "4px 32px 24px" }}>
                    <div style={{ padding: "22px 0 0", borderTop: `1px solid ${C.grey}` }}>
                      <p style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.mid, margin: "0 0 12px" }}>
                        {t.headlines}
                      </p>
                      {result.headlineRewrites.map((h, i) => (
                        <p key={i} style={{ fontFamily: "'Poppins', sans-serif", fontSize: 21, lineHeight: 1.3, color: C.ink, margin: "0 0 12px", paddingLeft: 16, borderLeft: `3px solid ${C.accent}` }}>
                          {h}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {result.visuals && (
                  <div style={{ padding: "4px 32px 24px" }}>
                    <div style={{ padding: "22px 0 0", borderTop: `1px solid ${C.grey}` }}>
                      <p style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.mid, margin: "0 0 8px" }}>
                        {t.showImg}
                      </p>
                      <p style={{ fontSize: 16, lineHeight: 1.5, color: C.ink, margin: "0 0 8px" }}>{result.visuals.prescription}</p>
                      {result.visuals.avoid && (
                        <p style={{ fontSize: 15, lineHeight: 1.5, color: "#8B3A2F", margin: 0 }}>
                          <span style={{ fontWeight: 700 }}>{t.avoid} → </span>{result.visuals.avoid}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {result.skeleton?.length > 0 && (
                  <div style={{ background: C.accentSoft, padding: "26px 32px" }}>
                    <p style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.accent, margin: "0 0 16px" }}>
                      {t.build}
                    </p>
                    {result.skeleton.map((s, i) => (
                      <div key={i} style={{ display: "flex", gap: 14, marginBottom: 14 }}>
                        <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 800, color: C.accent, minWidth: 26 }}>{i + 1}</span>
                        <div>
                          <p style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 14, color: C.ink, margin: "2px 0 2px" }}>{s.section}</p>
                          <p style={{ fontSize: 14, lineHeight: 1.5, color: C.mid, margin: 0 }}>{s.says}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
