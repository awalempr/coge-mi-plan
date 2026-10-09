// Synthetic dataset — fictional providers, generated deterministically.
// No real patient or provider data is used anywhere in this prototype.

export const PLANS = [
  { id: "vital", name: "Plan Vital", kind: "Medicaid", accept: 0.30, aliases: ["vital", "medicaid", "reforma", "plan de gobierno", "tarjeta de salud"] },
  { id: "triples", name: "Triple-S", kind: "Advantage / Comercial", accept: 0.62, aliases: ["triple-s", "triple s", "triples", "sss", "triple"] },
  { id: "mmm", name: "MMM", kind: "Medicare Advantage", accept: 0.55, aliases: ["mmm", "medicare y mucho mas", "medicare y mucho más"] },
  { id: "mcs", name: "MCS", kind: "Advantage / Comercial", accept: 0.52, aliases: ["mcs", "classicare"] },
  { id: "first", name: "First Medical", kind: "Advantage / Comercial", accept: 0.48, aliases: ["first medical", "first"] },
  { id: "humana", name: "Humana", kind: "Medicare Advantage", accept: 0.50, aliases: ["humana"] },
];

export const SPECIALTIES = [
  { id: "derm", es: "Dermatología", en: "Dermatology", doc: { es: "dermatólogo", en: "dermatologist" }, supply: 0.6, accept: 0.55, rx: /dermat|piel|skin/ },
  { id: "endo", es: "Endocrinología", en: "Endocrinology", doc: { es: "endocrinólogo", en: "endocrinologist" }, supply: 0.6, accept: 0.8, rx: /endocrin|diabet|tiroides|thyroid/ },
  { id: "cardio", es: "Cardiología", en: "Cardiology", doc: { es: "cardiólogo", en: "cardiologist" }, supply: 1.0, accept: 1.0, rx: /cardi|corazon|heart/ },
  { id: "neuro", es: "Neurología", en: "Neurology", doc: { es: "neurólogo", en: "neurologist" }, supply: 0.6, accept: 0.85, rx: /neurol|neuro(?!c)|nervio/ },
  { id: "reuma", es: "Reumatología", en: "Rheumatology", doc: { es: "reumatólogo", en: "rheumatologist" }, supply: 0.4, accept: 0.8, rx: /reuma|rheuma|artritis|arthritis|lupus/ },
  { id: "gastro", es: "Gastroenterología", en: "Gastroenterology", doc: { es: "gastroenterólogo", en: "gastroenterologist" }, supply: 0.8, accept: 0.95, rx: /gastro|estomago|stomach/ },
  { id: "psiq", es: "Psiquiatría", en: "Psychiatry", doc: { es: "psiquiatra", en: "psychiatrist" }, supply: 0.6, accept: 0.6, rx: /psiqui|psychiat|siquiatr/ },
  { id: "oftal", es: "Oftalmología", en: "Ophthalmology", doc: { es: "oftalmólogo", en: "ophthalmologist" }, supply: 0.8, accept: 0.9, rx: /oftalm|ophthal|ojos|eye/ },
  { id: "uro", es: "Urología", en: "Urology", doc: { es: "urólogo", en: "urologist" }, supply: 0.6, accept: 0.9, rx: /urolog|prostat/ },
  { id: "neumo", es: "Neumología", en: "Pulmonology", doc: { es: "neumólogo", en: "pulmonologist" }, supply: 0.5, accept: 0.85, rx: /neumo|pulmon|asma|asthma/ },
];

export const TOWNS = [
  { id: "sanjuan", name: "San Juan", region: "Metro", lat: 18.4655, lon: -66.1057, size: 3.0 },
  { id: "bayamon", name: "Bayamón", region: "Metro", lat: 18.3986, lon: -66.1557, size: 2.0 },
  { id: "carolina", name: "Carolina", region: "Metro", lat: 18.3808, lon: -65.9574, size: 1.6 },
  { id: "guaynabo", name: "Guaynabo", region: "Metro", lat: 18.3576, lon: -66.1110, size: 1.4 },
  { id: "caguas", name: "Caguas", region: "Este", lat: 18.2341, lon: -66.0485, size: 1.4 },
  { id: "humacao", name: "Humacao", region: "Este", lat: 18.1497, lon: -65.8274, size: 0.7 },
  { id: "fajardo", name: "Fajardo", region: "Este", lat: 18.3258, lon: -65.6524, size: 0.5 },
  { id: "cayey", name: "Cayey", region: "Este", lat: 18.1119, lon: -66.1660, size: 0.4 },
  { id: "arecibo", name: "Arecibo", region: "Norte", lat: 18.4724, lon: -66.7157, size: 0.9 },
  { id: "manati", name: "Manatí", region: "Norte", lat: 18.4277, lon: -66.4925, size: 0.6 },
  { id: "mayaguez", name: "Mayagüez", region: "Oeste", lat: 18.2013, lon: -67.1397, size: 1.0 },
  { id: "aguadilla", name: "Aguadilla", region: "Oeste", lat: 18.4274, lon: -67.1541, size: 0.6 },
  { id: "ponce", name: "Ponce", region: "Sur", lat: 18.0111, lon: -66.6141, size: 1.3 },
  { id: "yauco", name: "Yauco", region: "Sur", lat: 18.0350, lon: -66.8499, size: 0.35 },
  { id: "guayama", name: "Guayama", region: "Sur", lat: 17.9841, lon: -66.1138, size: 0.4 },
];

export const REGIONS = ["Metro", "Este", "Norte", "Oeste", "Sur"];

// Deterministic PRNG so every demo run shows the same numbers.
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST = ["Ana", "Carlos", "María", "José", "Luz", "Ramón", "Gloria", "Héctor", "Wanda", "Luis", "Marisol", "Edwin", "Yolanda", "Javier", "Ivelisse", "Rafael", "Nilda", "Ángel", "Carmen", "Félix", "Zoraida", "Orlando", "Mildred", "Jorge"];
const LAST = ["Rivera", "Colón", "Ortiz", "Santiago", "Torres", "Vázquez", "Rodríguez", "Pagán", "Figueroa", "Meléndez", "Cruz", "Maldonado", "Acevedo", "Negrón", "Quiñones", "Rosado", "Báez", "Del Valle", "Irizarry", "Medina", "Marrero", "Alicea", "Lugo", "Feliciano"];
const FEMALE = new Set(["Ana", "María", "Luz", "Gloria", "Wanda", "Marisol", "Yolanda", "Ivelisse", "Nilda", "Carmen", "Zoraida", "Mildred"]);

export const TODAY = new Date("2026-10-09T12:00:00");
const DAY = 86400000;

export function buildProviders() {
  const r = mulberry32(787);
  const pick = (arr) => arr[Math.floor(r() * arr.length)];
  const providers = [];
  let id = 1;
  for (const town of TOWNS) {
    for (const sp of SPECIALTIES) {
      const n = Math.max(0, Math.round(town.size * sp.supply * (2.0 + r() * 2.4) - (town.size < 0.6 ? 0.7 : 0)));
      for (let i = 0; i < n; i++) {
        const first = pick(FIRST);
        const name = `${FEMALE.has(first) ? "Dra." : "Dr."} ${first} ${pick(LAST)} ${pick(LAST)}`;
        const cashOnly = r() < 0.12 + (sp.accept < 0.7 ? 0.12 : 0);
        const plans = {};
        for (const p of PLANS) {
          // What the plan's directory says vs. what the office actually does today.
          const accepts = !cashOnly && r() < p.accept * sp.accept * (town.region === "Metro" ? 1 : 0.92);
          const listed = accepts ? r() < 0.97 : r() < (cashOnly ? 0.75 : 0.55);
          const verifiedDaysAgo = r() < 0.55 ? Math.floor(r() * 60) : 95 + Math.floor(r() * 400);
          plans[p.id] = { listed, accepts, verifiedDaysAgo, source: verifiedDaysAgo < 90 ? pick(["ai_call", "ai_call", "office_portal", "patient_report"]) : "directory" };
        }
        providers.push({
          id: id++,
          name,
          plans,
          specialty: sp.id,
          town: town.id,
          phone: `787-${String(200 + Math.floor(r() * 799))}-${String(1000 + Math.floor(r() * 8999))}`,
          acceptsNew: r() < 0.82,
          nextDays: 3 + Math.floor(r() * (sp.accept < 0.7 ? 120 : 60)),
          cashPrice: cashOnly ? 120 + Math.floor(r() * 9) * 15 : null,
          cashOnly,
          telehealth: r() < 0.3,
        });
      }
    }
  }
  return providers;
}

export function dateFromDays(days) {
  return new Date(TODAY.getTime() + days * DAY);
}
