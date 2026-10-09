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
