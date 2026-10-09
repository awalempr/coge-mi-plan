// POST /api/understand  { text, known }  ->  { specialty?, plan?, town?, urgent, note, source }
import { understand, aiEnabled } from "../lib/understand.mjs";

const ALLOWED = new Set(["specialty", "plan", "town"]);

export default async (req) => {
  if (req.method === "GET") return Response.json({ ai: aiEnabled() });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  let body;
  try { body = await req.json(); } catch { return new Response("Bad JSON", { status: 400 }); }
  const known = Object.fromEntries(Object.entries(body?.known || {}).filter(([k, v]) => ALLOWED.has(k) && typeof v === "string"));
  const result = await understand(body?.text, known);
  return Response.json(result, { headers: { "cache-control": "no-store" } });
};

export const config = { path: "/api/understand" };
