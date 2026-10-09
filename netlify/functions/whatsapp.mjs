// Twilio WhatsApp webhook: POST /api/whatsapp (application/x-www-form-urlencoded) -> TwiML reply.
// The conversation keeps only the three search slots, keyed by a hash of the phone number,
// and expires after 30 minutes. "BORRAR" / "DELETE" erases it immediately.
import crypto from "node:crypto";
import { getStore } from "@netlify/blobs";
import { understand } from "../lib/understand.mjs";
import { buildProviders } from "../../site/data.js";
import { makeSearch, planById, specById, townById } from "../../site/core.js";

const search = makeSearch(buildProviders());
const TTL_MS = 30 * 60 * 1000;

const xml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const twiml = (msg) => new Response(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${xml(msg)}</Message></Response>`, { headers: { "content-type": "text/xml" } });

// https://www.twilio.com/docs/usage/security#validating-requests
function validTwilioSignature(req, params) {
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!token) return true; // sandbox convenience; set the token in production
  const url = process.env.PUBLIC_WHATSAPP_URL || req.url;
  const data = url + Object.keys(params).sort().map((k) => k + params[k]).join("");
  const expected = crypto.createHmac("sha1", token).update(data).digest("base64");
  const got = req.headers.get("x-twilio-signature") || "";
  return got.length === expected.length && crypto.timingSafeEqual(Buffer.from(got), Buffer.from(expected));
}

function ask(ctx, es) {
  if (!ctx.specialty) return es ? "¿Qué especialista necesitas? Puedes decirme el síntoma, por ejemplo: \"me pica la piel\"." : "Which specialist do you need? You can describe the symptom, e.g. \"my skin itches\".";
  if (!ctx.plan) return es ? "¿Qué plan médico tienes? (Plan Vital, Triple-S, MMM, MCS, First Medical, Humana)" : "Which health plan do you have? (Plan Vital, Triple-S, MMM, MCS, First Medical, Humana)";
  return es ? "¿En qué pueblo te queda bien ir?" : "Which town works for you?";
}

function answer(ctx, es) {
  const r = search(ctx);
  const sp = specById(ctx.specialty), pl = planById(ctx.plan), tw = townById(ctx.town);
  const doc = sp.doc[es ? "es" : "en"];
  const head = es
    ? `De ${r.listed.length} ${doc}s que el directorio de ${pl.name} lista cerca de ${tw.name}, ${r.confirmed.length} están confirmados hoy. ${r.ghost.length} ya no lo aceptan.`
    : `Of ${r.listed.length} ${doc}s the ${pl.name} directory lists near ${tw.name}, ${r.confirmed.length} are confirmed today. ${r.ghost.length} no longer accept it.`;
  const rows = r.confirmed.slice(0, 3).map(({ p, d }) => {
    const v = p.plans[ctx.plan].verifiedDaysAgo;
    return `✅ ${p.name} · ${townById(p.town).name} (${Math.round(d)} km) · ${p.phone} · ${es ? "verificado" : "verified"} ${v === 0 ? (es ? "hoy" : "today") : es ? `hace ${v} días` : `${v} days ago`}`;
  });
  const none = es
    ? "Nadie confirmado todavía. Responde AYUDA y te digo qué hacer: telemedicina, una carta a tu plan y el Procurador del Paciente."
    : "No one confirmed yet. Reply HELP and I'll tell you what to do: telehealth, a letter to your plan and the Patient Advocate Office.";
  const foot = es ? "\n(Prototipo: datos sintéticos.)" : "\n(Prototype: synthetic data.)";
  return [head, ...(rows.length ? rows : [none])].join("\n") + foot;
}

export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const params = Object.fromEntries(new URLSearchParams(await req.text()));
  if (!validTwilioSignature(req, params)) return new Response("Forbidden", { status: 403 });

  const from = params.From || "";
  const body = (params.Body || "").trim();
  const key = crypto.createHash("sha256").update(from).digest("hex").slice(0, 32);
  const store = getStore("wa-sessions");

  if (/^(borrar|delete)$/i.test(body)) {
    await store.delete(key);
    return twiml("Listo, borré tu conversación. / Done, your conversation was deleted.");
  }
  if (!body && Number(params.NumMedia || 0) > 0) {
    return twiml("Por ahora no puedo escuchar notas de voz por aquí; escríbeme el mensaje, por favor. / I can't listen to voice notes here yet; please type your message.");
  }

  const saved = await store.get(key, { type: "json" });
  const known = saved && Date.now() - saved.at < TTL_MS ? saved.ctx : {};
  const result = await understand(body, known);
  const es = (result.language || "es") === "es";

  if (result.urgent) return twiml(result.note || (es ? "Si es una emergencia, llama al 911 ahora." : "If this is an emergency, call 911 now."));
  if (/^(ayuda|help)$/i.test(body) && known.specialty && known.plan && known.town) {
    return twiml(es
      ? "1) Pide telemedicina. 2) Escríbele a tu plan: \"Necesito un especialista dentro de la red o que autoricen uno fuera de la red al costo de la red.\" 3) Si no responden, presenta una querella en la Oficina del Procurador del Paciente."
      : "1) Ask for telehealth. 2) Write to your plan: \"I need an in-network specialist, or authorization for an out-of-network one at in-network cost.\" 3) If they don't respond, file a complaint with the Patient Advocate Office.");
  }

  const ctx = { specialty: result.specialty, plan: result.plan, town: result.town };
  for (const k of Object.keys(ctx)) if (!ctx[k]) delete ctx[k];
  await store.setJSON(key, { ctx, at: Date.now() });

  if (!ctx.specialty || !ctx.plan || !ctx.town) {
    return twiml((result.note ? result.note + "\n" : "") + ask(ctx, es));
  }
  return twiml(answer(ctx, es));
};

export const config = { path: "/api/whatsapp" };
