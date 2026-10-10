// Shared logic for the browser app and the serverless functions (no DOM here).
import { PLANS, SPECIALTIES, TOWNS } from "./data.js";

export const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
export const planById = (id) => PLANS.find((p) => p.id === id);
export const specById = (id) => SPECIALTIES.find((s) => s.id === id);
export const townById = (id) => TOWNS.find((t) => t.id === id);

export function km(a, b) {
  const R = 6371, toR = Math.PI / 180;
  const dLat = (b.lat - a.lat) * toR, dLon = (b.lon - a.lon) * toR;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * toR) * Math.cos(b.lat * toR) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

// Towns not in the registry map to the nearest listed town (also used by the offline parser).
const NEARBY = {
  "toa baja": "bayamon", "toa alta": "bayamon", "dorado": "bayamon", "catano": "bayamon", "naranjito": "bayamon", "corozal": "bayamon", "comerio": "bayamon",
  "trujillo alto": "carolina", "canovanas": "carolina", "loiza": "carolina", "rio grande": "carolina",
  "gurabo": "caguas", "juncos": "caguas", "san lorenzo": "caguas", "aguas buenas": "caguas", "cidra": "cayey", "aibonito": "cayey", "barranquitas": "cayey",
  "juana diaz": "ponce", "santa isabel": "ponce", "villalba": "ponce", "coamo": "ponce", "adjuntas": "ponce", "jayuya": "ponce",
  "penuelas": "yauco", "guanica": "yauco", "guayanilla": "yauco", "sabana grande": "yauco", "lajas": "yauco",
  "cabo rojo": "mayaguez", "hormigueros": "mayaguez", "san german": "mayaguez", "anasco": "mayaguez", "maricao": "mayaguez", "las marias": "mayaguez",
  "isabela": "aguadilla", "moca": "aguadilla", "aguada": "aguadilla", "rincon": "aguadilla", "san sebastian": "aguadilla", "quebradillas": "aguadilla",
  "hatillo": "arecibo", "camuy": "arecibo", "utuado": "arecibo", "lares": "arecibo",
  "vega baja": "manati", "vega alta": "manati", "barceloneta": "manati", "ciales": "manati", "florida": "manati", "morovis": "manati", "orocovis": "manati",
  "yabucoa": "humacao", "naguabo": "humacao", "las piedras": "humacao", "maunabo": "humacao",
  "luquillo": "fajardo", "ceiba": "fajardo", "vieques": "fajardo", "culebra": "fajardo",
  "salinas": "guayama", "arroyo": "guayama", "patillas": "guayama",
};

// Deterministic ES/EN slot parser. It is the offline fallback when the Claude endpoint is unavailable.
export function parseQuery(text) {
  const n = norm(text);
  const out = {};
  const s = SPECIALTIES.find((s) => s.rx.test(n));
  if (s) out.specialty = s.id;
  const p = PLANS.find((p) => p.aliases.some((a) => n.includes(norm(a))));
  if (p) out.plan = p.id;
  const tw = TOWNS.find((tw) => n.includes(norm(tw.name)));
  if (tw) out.town = tw.id;
  else { const near = Object.entries(NEARBY).find(([name]) => n.includes(name)); if (near) out.town = near[1]; }
  return out;
}

export function status(pr, planId) {
  const s = pr.plans[planId];
  if (s.verifiedDaysAgo < 90) return s.accepts && pr.acceptsNew ? "confirmed" : "ghost";
  return "unverified";
}

export function makeSearch(providers) {
  return function search({ specialty, plan: planId, town: townId }) {
    const origin = townById(townId);
    const listed = providers
      .filter((p) => p.specialty === specialty && p.plans[planId].listed)
      .map((p) => ({ p, d: km(origin, townById(p.town)) }))
      .filter((x) => x.d <= 45)
      .sort((a, b) => a.d + a.p.nextDays / 8 - (b.d + b.p.nextDays / 8));
    const groups = { confirmed: [], ghost: [], unverified: [] };
    for (const x of listed) groups[status(x.p, planId)].push(x);
    return { listed, ...groups };
  };
}

// On-device emergency screen. Runs before (and independent of) the AI layer, so 911/988 guidance
// appears even when Claude is unreachable. Deliberately broad: a false alarm costs one sentence.
const URGENT = [
  /dolor (fuerte )?(en el |de )?pecho/, /no puedo respirar/, /me falta el aire/, /me ahogo/, /chest pain/, /can'?t breathe/, /short(ness)? of breath/,
  /derrame/, /stroke/, /cara (caida|torcida)/, /sangr(o|ando) mucho/, /bleeding (a lot|heavily)/, /desmay/, /fainted/, /convulsi/, /seizure (now|right now)/,
  /suicid/, /quitar(me|se)? la vida/, /matar(me|se)/, /(me|se) (quiere|quiero) matar/, /no (quiero|quiere) vivir/, /kill (my|him|her|them)sel(f|ves)/, /end (my|his|her|their) li(fe|ves)/, /overdos/, /sobredosis/,
];
export function looksUrgent(text) {
  const n = norm(text);
  return URGENT.some((rx) => rx.test(n));
}
export function urgentMessage(text, lang) {
  const n = norm(text);
  const mental = /suicid|quitar(me|se)? la vida|matar(me|se)|(me|se) (quiere|quiero) matar|no (quiero|quiere) vivir|kill (my|him|her|them)sel(f|ves)|end (my|his|her|their) li(fe|ves)/.test(n);
  return lang === "es"
    ? `Esto puede ser una emergencia. Llama al <b>911</b> ahora.${mental ? " Si estás pensando en hacerte daño, llama o textea al <b>988</b> (Línea PAS de ASSMCA: 1-800-981-0023)." : ""}`
    : `This may be an emergency. Call <b>911</b> now.${mental ? " If you are thinking about harming yourself, call or text <b>988</b>." : ""}`;
}
