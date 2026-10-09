// POST /api/understand  { text, known }  ->  { specialty?, plan?, town?, urgent, note, source }
import crypto from "node:crypto";
import { getStore } from "@netlify/blobs";
import { understand, aiEnabled } from "../lib/understand.mjs";

// Public demo link: cap Claude calls per visitor so a shared URL can't run up the API bill.
const LIMIT = 30, WINDOW_MS = 10 * 60 * 1000;
async function overLimit(req, context) {
  const ip = context?.ip || req.headers.get("x-nf-client-connection-ip") || "unknown";
  const key = crypto.createHash("sha256").update(ip).digest("hex").slice(0, 32);
  const store = getStore("rate-limit");
  const now = Date.now();
  const rec = (await store.get(key, { type: "json" })) || { start: now, n: 0 };
  if (now - rec.start > WINDOW_MS) { rec.start = now; rec.n = 0; }
  rec.n++;
  await store.setJSON(key, rec);
  return rec.n > LIMIT;
}

const ALLOWED = new Set(["specialty", "plan", "town"]);

export default async (req, context) => {
  if (req.method === "GET") return Response.json({ ai: aiEnabled() });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  let body;
  try { body = await req.json(); } catch { return new Response("Bad JSON", { status: 400 }); }
  const known = Object.fromEntries(Object.entries(body?.known || {}).filter(([k, v]) => ALLOWED.has(k) && typeof v === "string"));
  if (await overLimit(req, context)) return Response.json({ ...known, source: "local", urgent: false, note: "" }, { status: 429 });
  const result = await understand(body?.text, known);
  return Response.json(result, { headers: { "cache-control": "no-store" } });
};

export const config = { path: "/api/understand" };
