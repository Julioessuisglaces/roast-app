// Signs and verifies a "pass" token without a database.
// The token is a base64 expiry timestamp + an HMAC signature the
// browser cannot forge (only the server knows PASS_SECRET).
const crypto = require("crypto");
const SECRET = process.env.PASS_SECRET || "dev-secret-change-me";

function signPass(until) {
  const payload = String(until);
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return Buffer.from(payload).toString("base64") + "." + sig;
}

function verifyPass(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return 0;
  const [b64, sig] = token.split(".");
  let payload;
  try { payload = Buffer.from(b64, "base64").toString("utf8"); } catch { return 0; }
  const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  if (!sig || sig.length !== expected.length) return 0;
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return 0;
  } catch { return 0; }
  const until = parseInt(payload, 10);
  if (!until || until < Date.now()) return 0; // expired or invalid
  return until;
}

module.exports = { signPass, verifyPass };
