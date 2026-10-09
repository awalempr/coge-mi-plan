import { PLANS, SPECIALTIES, TOWNS, REGIONS, buildProviders, dateFromDays } from "./data.js";

const providers = buildProviders();
const byId = new Map(providers.map((p) => [p.id, p]));
const plan = (id) => PLANS.find((p) => p.id === id);
const spec = (id) => SPECIALTIES.find((s) => s.id === id);
const town = (id) => TOWNS.find((t) => t.id === id);

const state = { lang: "es", tab: "patient", ctx: {}, calls: 0, avoided: 0, busy: false };

// ---------- i18n ----------
const T = {
  es: {
    tagline: "El registro central y verificado de quién acepta qué plan en Puerto Rico.",
    tabPatient: "Paciente", tabPharmacy: "Farmacia", tabVerify: "Verificación", tabImpact: "Impacto",
    phTitle: "Modo farmacia", phSub: "En el mostrador, el cliente pregunta: “¿quién coge mi plan?”. El farmacéutico responde en segundos y le envía la lista al paciente. Si un médico rechazó al paciente, se reporta con un toque.", phSpec: "Especialidad", phPlan: "Plan", phTown: "Pueblo", phSearch: "Buscar", phCopy: "Copiar lista para WhatsApp del paciente", phCopied: "¡Copiado!", phReport: "Rechazó al paciente", phReported: "Reportado ✓", phNone: "Ningún especialista confirmado en 45 km. Este dato alimenta el mapa de desiertos.", phStatus: "Estado",
    chatTitle: "Coge Mi Plan", chatSub: "Asistente · responde en segundos",
    placeholder: "Ej: dermatólogo que coja Plan Vital en Caguas",
    send: "Enviar",
    behind: "Lo que pasa detrás", understood: "Entendí", funnel: "Directorio vs. realidad",
    listed: "Listados en el directorio", confirmed: "Confirmados que lo aceptan", ghost: "Ya NO lo aceptan (fantasmas)", unverified: "Sin verificar (+90 días)",
    callLog: "Respaldo: llamada de verificación (IA)", callIdle: "Si un listado no tiene ninguna verificación reciente (reclamaciones, consultorio o pacientes), el agente de voz llama como último recurso y actualiza el registro para todos.",
    callForMe: "Llamar por mí", reportWrong: "No me aceptaron", verified: "Verificado", daysAgo: (d) => d === 0 ? "hoy" : `hace ${d} días`,
    viaAi: "llamada IA", viaClaims: "reclamación pagada por el plan", viaPortal: "confirmado por el consultorio", viaPatient: "reporte de paciente", viaDir: "solo directorio del plan",
    newPatients: "Acepta pacientes nuevos", nextAppt: "Próxima cita", tele: "Telemedicina", unconf: "El plan dice que sí — sin confirmar",
    statsCalls: "llamadas hechas por la IA", statsAvoided: "llamadas que te ahorraste",
    vTitle: "Registro central: cómo se mantiene verificado", vSub: "Cada listado se confirma con la mejor evidencia disponible: reclamaciones pagadas por el plan, confirmación del consultorio (un toque por WhatsApp al mes) y reportes de pacientes. Abajo: lo que lleva más de 90 días sin evidencia, ordenado por demanda — ahí entra la llamada IA como respaldo. La ley federal No Surprises Act exige verificar cada 90 días.",
    vRun: "Verificar pendientes", vRunning: "Llamando…", vCompliance: "del registro verificado en ≤ 90 días", vSources: "Fuentes de verificación (últimos 90 días)", vQueue: "listados pendientes", vGhost: "fantasmas encontrados en esta sesión",
    colProvider: "Proveedor", colPlan: "Plan", colLast: "Última verificación", colDemand: "Búsquedas/mes", colResult: "Resultado",
    never: "nunca", pending: "pendiente", yes: "Lo acepta", no: "No lo acepta",
    iTitle: "Mapa de acceso real", iSub: "Especialistas que de verdad aceptan el plan y pacientes nuevos, por región. Rojo = desierto: nadie disponible.",
    iGhost: "Tasa de listados fantasma por plan", iGhostSub: "% de especialistas listados que en realidad no aceptan el plan.",
    iExport: "Exportar reporte (CSV) para OCS / ASES", iPlan: "Plan",
    iK1: "listados de especialistas analizados", iK2: "son fantasmas", iK3: "combinaciones especialidad-región sin ningún especialista disponible",
    disclaimer: "Prototipo con datos 100% sintéticos. Nombres de proveedores ficticios. Ningún dato de paciente se guarda: las búsquedas son anónimas.",
    suggestions: ["Necesito un dermatólogo que coja Plan Vital en Caguas", "Endocrinólogo con MMM cerca de Ponce", "Psiquiatra que acepte Triple-S en Mayagüez"],
  },
  en: {
    tagline: "Puerto Rico's central, verified registry of who accepts which plan.",
    tabPatient: "Patient", tabPharmacy: "Pharmacy", tabVerify: "Verification", tabImpact: "Impact",
    phTitle: "Pharmacy mode", phSub: "At the counter, the customer asks: “who takes my plan?”. The pharmacist answers in seconds and sends the list to the patient. If a doctor turned the patient away, it is reported with one tap.", phSpec: "Specialty", phPlan: "Plan", phTown: "Town", phSearch: "Search", phCopy: "Copy list for patient's WhatsApp", phCopied: "Copied!", phReport: "Turned patient away", phReported: "Reported ✓", phNone: "No confirmed specialist within 45 km. This feeds the desert map.", phStatus: "Status",
    chatTitle: "Coge Mi Plan", chatSub: "Assistant · replies in seconds",
    placeholder: "e.g. dermatologist that takes Plan Vital in Caguas",
    send: "Send",
    behind: "Behind the scenes", understood: "Understood", funnel: "Directory vs. reality",
    listed: "Listed in the plan directory", confirmed: "Confirmed accepting", ghost: "No longer accept it (ghosts)", unverified: "Unverified (90+ days)",
    callLog: "Fallback: AI verification call", callIdle: "If a listing has no recent verification (claims, office or patients), the voice agent calls as a last resort and updates the registry for everyone.",
    callForMe: "Call for me", reportWrong: "They turned me away", verified: "Verified", daysAgo: (d) => d === 0 ? "today" : `${d} days ago`,
    viaAi: "AI call", viaClaims: "paid claim from the plan", viaPortal: "confirmed by the office", viaPatient: "patient report", viaDir: "plan directory only",
    newPatients: "Accepting new patients", nextAppt: "Next opening", tele: "Telehealth", unconf: "Plan says yes — unconfirmed",
    statsCalls: "calls made by the AI", statsAvoided: "calls you didn't have to make",
    vTitle: "Central registry: how it stays verified", vSub: "Every listing is confirmed with the best evidence available: paid claims from the plan, a one-tap monthly WhatsApp confirmation from the office, and patient reports. Below: listings with no evidence in 90+ days, ranked by demand — that is where the AI call steps in as a fallback. The federal No Surprises Act requires verification every 90 days.",
    vRun: "Verify pending", vRunning: "Calling…", vCompliance: "of registry verified within 90 days", vSources: "Verification sources (last 90 days)", vQueue: "listings pending", vGhost: "ghosts found this session",
    colProvider: "Provider", colPlan: "Plan", colLast: "Last verified", colDemand: "Searches/mo", colResult: "Result",
    never: "never", pending: "pending", yes: "Accepts", no: "Does not accept",
    iTitle: "Real access map", iSub: "Specialists who truly accept the plan and new patients, by region. Red = desert: nobody available.",
    iGhost: "Ghost listing rate by plan", iGhostSub: "% of listed specialists who don't actually accept the plan.",
    iExport: "Export report (CSV) for regulators", iPlan: "Plan",
    iK1: "specialist listings analyzed", iK2: "are ghosts", iK3: "specialty-region combinations with no available specialist",
    disclaimer: "Prototype using 100% synthetic data. Provider names are fictional. No patient data is stored: searches are anonymous.",
    suggestions: ["I need a dermatologist that takes Plan Vital in Caguas", "Endocrinologist with MMM near Ponce", "Psychiatrist that accepts Triple-S in Mayagüez"],
  },
};
const t = (k) => T[state.lang][k];

// ---------- helpers ----------
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const $ = (sel) => document.querySelector(sel);
const el = (html) => { const d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstElementChild; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function km(a, b) {
  const R = 6371, toR = Math.PI / 180;
  const dLat = (b.lat - a.lat) * toR, dLon = (b.lon - a.lon) * toR;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * toR) * Math.cos(b.lat * toR) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}
function fmtDate(days) {
  return dateFromDays(days).toLocaleDateString(state.lang === "es" ? "es-PR" : "en-US", { weekday: "short", month: "short", day: "numeric" });
}

// ---------- natural-language intent parsing (ES/EN) ----------
// Deterministic so the demo never fails offline; in production an LLM fills the same slots.
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

// ---------- search ----------
function status(pr, planId) {
  const s = pr.plans[planId];
  if (s.verifiedDaysAgo < 90) return s.accepts && pr.acceptsNew ? "confirmed" : "ghost";
  return "unverified";
}
function search({ specialty, plan: planId, town: townId }) {
  const origin = town(townId);
  const listed = providers
    .filter((p) => p.specialty === specialty && p.plans[planId].listed)
    .map((p) => ({ p, d: km(origin, town(p.town)) }))
    .filter((x) => x.d <= 45)
    .sort((a, b) => a.d + a.p.nextDays / 8 - (b.d + b.p.nextDays / 8));
  const groups = { confirmed: [], ghost: [], unverified: [] };
  for (const x of listed) groups[status(x.p, planId)].push(x);
  return { listed, ...groups };
}

// ---------- chat ----------
function addMsg(who, html) {
  const box = $("#chat");
  const m = el(`<div class="msg ${who}"><div class="bubble">${html}</div></div>`);
  box.appendChild(m);
  box.scrollTop = box.scrollHeight;
  return m;
}
async function botTyping() {
  const m = addMsg("bot", `<span class="typing"><i></i><i></i><i></i></span>`);
  await sleep(650);
  m.remove();
}

function card(x, planId, kind) {
  const { p, d } = x;
  const s = p.plans[planId];
  const via = { claims: t("viaClaims"), ai_call: t("viaAi"), office_portal: t("viaPortal"), patient_report: t("viaPatient"), directory: t("viaDir") }[s.source];
  const badge = kind === "confirmed"
    ? `<span class="badge ok">✓ ${t("verified")} ${t("daysAgo")(s.verifiedDaysAgo)} · ${via}</span>`
    : `<span class="badge warn">? ${t("unconf")}</span>`;
  const actions = kind === "confirmed"
    ? `<button class="link" data-report="${p.id}">${t("reportWrong")}</button>`
    : `<button class="pill" data-call="${p.id}">📞 ${t("callForMe")}</button>`;
  return `<div class="card" id="card-${p.id}">
    <div class="card-top"><b>${p.name}</b><span class="dist">${Math.round(d)} km</span></div>
    <div class="muted">${spec(p.specialty)[state.lang]} · ${town(p.town).name} · ${p.phone}</div>
    ${badge}
    ${kind === "confirmed" ? `<div class="muted small">${t("nextAppt")}: <b>${fmtDate(p.nextDays)}</b>${p.telehealth ? ` · ${t("tele")}` : ""}</div>` : ""}
    <div class="card-actions">${actions}</div>
  </div>`;
}

function botReply(q, r) {
  const sp = spec(q.specialty), pl = plan(q.plan), tw = town(q.town);
  const doc = sp.doc[state.lang];
  const L = state.lang === "es";
  const head = L
    ? `De <b>${r.listed.length}</b> ${doc}s que el directorio de <b>${pl.name}</b> lista cerca de ${tw.name}, <b>${r.confirmed.length}</b> están confirmados aceptándolo hoy. <b>${r.ghost.length}</b> ya no lo aceptan — te ahorré esas llamadas.`
    : `Of <b>${r.listed.length}</b> ${doc}s the <b>${pl.name}</b> directory lists near ${tw.name}, <b>${r.confirmed.length}</b> are confirmed accepting it today. <b>${r.ghost.length}</b> no longer take it — I saved you those calls.`;
  const cards = r.confirmed.slice(0, 3).map((x) => card(x, q.plan, "confirmed")).join("")
    + r.unverified.slice(0, 2).map((x) => card(x, q.plan, "unverified")).join("");
  const none = r.confirmed.length === 0
    ? (L ? `<p class="small">No hay confirmados todavía. Puedo llamar a los que no están verificados:</p>` : `<p class="small">No confirmed options yet. I can call the unverified ones:</p>`)
    : "";
  return `<p>${head}</p>${none}${cards}`;
}

function missingPrompt(q) {
  const L = state.lang === "es";
  if (!q.specialty) return L ? "¿Qué tipo de especialista necesitas? (ej: dermatólogo, cardiólogo, psiquiatra)" : "What kind of specialist do you need? (e.g. dermatologist, cardiologist, psychiatrist)";
  if (!q.plan) return L ? "¿Qué plan médico tienes? (Plan Vital, Triple-S, MMM, MCS, First Medical, Humana)" : "Which health plan do you have? (Plan Vital, Triple-S, MMM, MCS, First Medical, Humana)";
  return L ? "¿En qué pueblo estás o cerca de dónde te queda bien ir?" : "Which town are you in, or near where works for you?";
}

async function handleUser(text) {
  if (!text.trim() || state.busy) return;
  addMsg("user", text.replace(/</g, "&lt;"));
  const parsed = parseQuery(text);
  state.ctx = { ...state.ctx, ...parsed };
  renderIntent(state.ctx);
  await botTyping();
  const q = state.ctx;
  if (!q.specialty || !q.plan || !q.town) { addMsg("bot", missingPrompt(q)); return; }
  const r = search(q);
  state.last = { q, r };
  state.avoided += r.ghost.length;
  addMsg("bot", botReply(q, r));
  renderFunnel(r);
  renderStats();
}

function renderIntent(q) {
  const chip = (label, v) => `<span class="chip ${v ? "" : "empty"}">${label}: <b>${v || "—"}</b></span>`;
  $("#intent").innerHTML =
    chip(state.lang === "es" ? "Especialidad" : "Specialty", q.specialty && spec(q.specialty)[state.lang]) +
    chip("Plan", q.plan && plan(q.plan).name) +
    chip(state.lang === "es" ? "Pueblo" : "Town", q.town && town(q.town).name);
}

function renderFunnel(r) {
  const max = Math.max(1, r.listed.length);
  const row = (label, n, cls) => `<div class="frow"><div class="flabel">${label}</div><div class="fbar"><span class="${cls}" style="width:${(n / max) * 100}%"></span></div><div class="fnum">${n}</div></div>`;
  $("#funnel").innerHTML = row(t("listed"), r.listed.length, "b-listed") + row(t("confirmed"), r.confirmed.length, "b-ok") + row(t("ghost"), r.ghost.length, "b-bad") + row(t("unverified"), r.unverified.length, "b-warn");
}

function renderStats() {
  $("#stat-calls").textContent = state.calls;
  $("#stat-avoided").textContent = state.avoided;
}

// ---------- simulated AI verification call ----------
function callScript(p, planId) {
  const pl = plan(planId).name;
  const s = p.plans[planId];
  const ok = s.accepts && p.acceptsNew;
  const agent = (es, en) => ["agent", state.lang === "es" ? es : en];
  const office = (es, en) => ["office", state.lang === "es" ? es : en];
  const lines = [
    agent(`Buenas, le habla el asistente automatizado de Coge Mi Plan, verificando el directorio de planes médicos. ¿${p.name} está aceptando pacientes nuevos con ${pl}?`,
      `Hi, this is the Coge Mi Plan automated assistant verifying health-plan directories. Is ${p.name} accepting new patients with ${pl}?`),
  ];
  if (ok) {
    lines.push(office(`Sí, con ${pl} sí. La próxima cita disponible sería el ${fmtDate(p.nextDays)}.`, `Yes, we take ${pl}. The next opening is ${fmtDate(p.nextDays)}.`));
  } else if (p.cashOnly) {
    lines.push(office(`No, ya no cogemos planes. Es privado, $${p.cashPrice} la consulta.`, `No, we don't take any plans anymore. It's private pay, $${p.cashPrice} per visit.`));
  } else if (!p.acceptsNew) {
    lines.push(office(`Lo aceptamos, pero no estamos cogiendo pacientes nuevos ahora mismo.`, `We take it, but we're not accepting new patients right now.`));
  } else {
    lines.push(office(`No, dejamos ${pl} hace unos meses. Nos tardaban mucho en pagar.`, `No, we dropped ${pl} a few months ago. They were very slow to pay.`));
  }
  lines.push(agent(`Gracias. Actualizo el directorio. ¡Que tenga buen día!`, `Thank you. I'll update the directory. Have a good day!`));
  return { lines, ok };
}

async function runCall(p, planId, { fast = false, log = $("#calllog") } = {}) {
  const { lines, ok } = callScript(p, planId);
  if (!fast) log.innerHTML = "";
  const head = el(`<div class="call-head">📞 ${p.name} · ${p.phone} · ${plan(planId).name}</div>`);
  log.appendChild(head);
  if (!fast) {
    for (const [who, text] of lines) {
      const ln = el(`<div class="cl ${who}"><span>${who === "agent" ? "IA" : state.lang === "es" ? "Consultorio" : "Office"}</span><p></p></div>`);
      log.appendChild(ln);
      const ptag = ln.querySelector("p");
      for (let i = 0; i <= text.length; i += 3) { ptag.textContent = text.slice(0, i); await sleep(12); }
      ptag.textContent = text;
      log.scrollTop = log.scrollHeight;
      await sleep(280);
    }
  }
  const res = el(`<div class="call-res ${ok ? "ok" : "bad"}">${ok ? "✓ " + t("yes") : "✗ " + t("no")} — ${state.lang === "es" ? "directorio actualizado para todos" : "directory updated for everyone"}</div>`);
  log.appendChild(res);
  log.scrollTop = log.scrollHeight;
  Object.assign(p.plans[planId], { verifiedDaysAgo: 0, source: "ai_call" });
  if (!ok) p.plans[planId].accepts = false;
  state.calls++;
  renderStats();
  return ok;
}

async function callForMe(id) {
  if (state.busy || !state.last) return;
  state.busy = true;
  const p = byId.get(id), { q } = state.last;
  const btn = document.querySelector(`[data-call="${id}"]`);
  if (btn) { btn.disabled = true; btn.textContent = state.lang === "es" ? "Llamando…" : "Calling…"; }
  const ok = await runCall(p, q.plan);
  const L = state.lang === "es";
  if (ok) {
    addMsg("bot", (L ? `¡Buenas noticias! Llamé a <b>${p.name}</b>: sí acepta ${plan(q.plan).name}. Próxima cita: <b>${fmtDate(p.nextDays)}</b>. ¿Quieres su teléfono para separarla? ${p.phone}`
      : `Good news! I called <b>${p.name}</b>: they do accept ${plan(q.plan).name}. Next opening: <b>${fmtDate(p.nextDays)}</b>. Their number: ${p.phone}`));
  } else {
    state.avoided++;
    addMsg("bot", L ? `Llamé a <b>${p.name}</b> y ya <b>no</b> acepta ${plan(q.plan).name}. Lo marqué en el directorio para que nadie más pierda esa llamada.`
      : `I called <b>${p.name}</b> and they <b>no longer</b> accept ${plan(q.plan).name}. I flagged it so nobody else wastes that call.`);
  }
  if (btn) {
    btn.closest(".card").classList.add(ok ? "done-ok" : "done-bad");
    btn.replaceWith(el(`<span class="badge ${ok ? "ok" : "bad"}">${ok ? "✓ " + t("yes") : "✗ " + t("no")} · ${t("verified")} ${t("daysAgo")(0)}</span>`));
  }
  state.last.r = search(q);
  renderFunnel(state.last.r);
  renderStats();
  state.busy = false;
}

function reportWrong(id) {
  const p = byId.get(id), { q } = state.last;
  Object.assign(p.plans[q.plan], { verifiedDaysAgo: 120, source: "patient_report" }); // pushes it back to the verification queue
  document.querySelector(`#card-${id}`)?.classList.add("done-bad");
  addMsg("bot", state.lang === "es"
    ? `Gracias por avisar. Puse a <b>${p.name}</b> primero en la cola de verificación; la IA lo confirma hoy mismo. Tu reporte es anónimo.`
    : `Thanks for letting us know. <b>${p.name}</b> is now first in the verification queue; the AI will re-confirm today. Your report is anonymous.`);
}

// ---------- pharmacy counter ----------
function renderPharmacy() {
  const r = search({ specialty: $("#ph-spec").value, plan: $("#ph-plan").value, town: $("#ph-town").value });
  state.ph = r;
  const rows = r.confirmed.map(({ p, d }) => {
    const s = p.plans[$("#ph-plan").value];
    return `<tr><td><b>${p.name}</b><div class="muted small">${town(p.town).name} · ${Math.round(d)} km</div></td><td>${p.phone}</td><td>${fmtDate(p.nextDays)}</td>
      <td><span class="badge ok">✓ ${t("daysAgo")(s.verifiedDaysAgo)}</span></td><td><button class="link" data-phreport="${p.id}">${t("phReport")}</button></td></tr>`;
  }).join("");
  $("#ph-results").innerHTML = r.confirmed.length
    ? `<table><thead><tr><th>${t("colProvider")}</th><th>Tel.</th><th>${t("nextAppt")}</th><th>${t("verified")}</th><th></th></tr></thead><tbody>${rows}</tbody></table>`
    : `<p class="muted">${t("phNone")}</p>`;
  $("#ph-summary").innerHTML = `<b>${r.listed.length}</b> ${t("listed").toLowerCase()} · <b class="okc">${r.confirmed.length}</b> ${t("confirmed").toLowerCase()} · <b class="bad">${r.ghost.length}</b> ${t("ghost").toLowerCase()}`;
}
function copyPharmacy() {
  const pl = plan($("#ph-plan").value).name, sp = spec($("#ph-spec").value)[state.lang];
  const lines = state.ph.confirmed.slice(0, 5).map(({ p }) => `• ${p.name} — ${p.phone} — ${town(p.town).name}`);
  const txt = `${sp} · ${pl}\n${lines.join("\n")}\n— Coge Mi Plan`;
  navigator.clipboard?.writeText(txt).catch(() => {});
  const b = $("#ph-copy"); b.textContent = t("phCopied"); setTimeout(() => (b.textContent = t("phCopy")), 1500);
}

// ---------- verification tab ----------
function demand(p, planId) { return ((p.id * 37 + planId.length * 11) % 90) + 10; }
function queueRows() {
  const rows = [];
  for (const p of providers) for (const pl of PLANS) {
    const s = p.plans[pl.id];
    if (s.listed && s.verifiedDaysAgo >= 90) rows.push({ p, planId: pl.id, demand: demand(p, pl.id) });
  }
  return rows.sort((a, b) => b.demand - a.demand);
}
function compliance() {
  let total = 0, ok = 0;
  for (const p of providers) for (const pl of PLANS) { const s = p.plans[pl.id]; if (s.listed) { total++; if (s.verifiedDaysAgo < 90) ok++; } }
  return Math.round((ok / total) * 100);
}
state.ghostsFound = 0;
function renderVerify() {
  const rows = queueRows().slice(0, 10);
  state.queue = rows;
  $("#v-compliance").textContent = compliance() + "%";
  $("#v-queue").textContent = queueRows().length.toLocaleString();
  $("#v-ghost").textContent = state.ghostsFound;
  renderSources();
  $("#vtable tbody").innerHTML = rows.map((r, i) => `<tr id="vrow-${i}">
    <td><b>${r.p.name}</b><div class="muted small">${spec(r.p.specialty)[state.lang]} · ${town(r.p.town).name}</div></td>
    <td>${plan(r.planId).name}</td>
    <td>${t("daysAgo")(r.p.plans[r.planId].verifiedDaysAgo)}</td>
    <td>${r.demand}</td>
    <td class="res">${t("pending")}</td></tr>`).join("");
}
function renderSources() {
  const counts = { claims: 0, office_portal: 0, patient_report: 0, ai_call: 0 };
  for (const p of providers) for (const pl of PLANS) { const s = p.plans[pl.id]; if (s.listed && s.verifiedDaysAgo < 90 && s.source in counts) counts[s.source]++; }
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  const label = { claims: t("viaClaims"), office_portal: t("viaPortal"), patient_report: t("viaPatient"), ai_call: t("viaAi") };
  $("#v-sources").innerHTML = `<div class="label">${t("vSources")}</div><div class="srcbar">${Object.entries(counts).map(([k, n]) => `<span class="src-${k}" style="flex:${n}"></span>`).join("")}</div><div class="srclegend">${Object.entries(counts).map(([k, n]) => `<span><i class="src-${k}"></i>${label[k]} · <b>${Math.round((n / total) * 100)}%</b></span>`).join("")}</div>`;
}
async function runRound() {
  if (state.busy) return;
  state.busy = true;
  const btn = $("#v-run");
  btn.disabled = true; btn.textContent = t("vRunning");
  const log = $("#vlog");
  log.innerHTML = "";
  for (let i = 0; i < state.queue.length; i++) {
    const r = state.queue[i];
    const row = $(`#vrow-${i}`);
    row.classList.add("active");
    const ok = await runCall(r.p, r.planId, { fast: i > 0, log });
    if (i > 0) await sleep(350);
    if (!ok) state.ghostsFound++;
    row.classList.remove("active");
    row.querySelector(".res").innerHTML = ok ? `<span class="badge ok">✓ ${t("yes")}</span>` : `<span class="badge bad">✗ ${t("no")}</span>`;
    $("#v-ghost").textContent = state.ghostsFound;
  }
  // A nightly batch also ingests new paid claims and office confirmations; AI calls only cover what those miss.
  queueRows().slice(0, 400).forEach((r, i) => Object.assign(r.p.plans[r.planId], { verifiedDaysAgo: 0, source: i % 3 === 2 ? "office_portal" : "claims" }));
  $("#v-compliance").textContent = compliance() + "%";
  $("#v-queue").textContent = queueRows().length.toLocaleString();
  renderSources();
  btn.disabled = false; btn.textContent = t("vRun");
  state.busy = false;
}

// ---------- impact tab ----------
function renderImpact() {
  const planId = $("#i-plan").value;
  const cell = (sid, region) => providers.filter((p) => p.specialty === sid && town(p.town).region === region && p.plans[planId].accepts && p.acceptsNew).length;
  let deserts = 0;
  const head = `<tr><th></th>${REGIONS.map((r) => `<th>${r}</th>`).join("")}</tr>`;
  const body = SPECIALTIES.map((s) => `<tr><th>${s[state.lang]}</th>${REGIONS.map((r) => {
    const n = cell(s.id, r);
    if (n === 0) deserts++;
    const cls = n === 0 ? "h0" : n <= 2 ? "h1" : n <= 5 ? "h2" : "h3";
    return `<td class="${cls}">${n}</td>`;
  }).join("")}</tr>`).join("");
  $("#heat").innerHTML = head + body;

  let total = 0, ghosts = 0;
  const bars = PLANS.map((pl) => {
    const listed = providers.filter((p) => p.plans[pl.id].listed);
    const g = listed.filter((p) => !p.plans[pl.id].accepts || !p.acceptsNew).length;
    total += listed.length; ghosts += g;
    const pct = Math.round((g / listed.length) * 100);
    return `<div class="frow"><div class="flabel">${pl.name}</div><div class="fbar"><span class="b-bad" style="width:${pct}%"></span></div><div class="fnum">${pct}%</div></div>`;
  }).join("");
  $("#ghostbars").innerHTML = bars;
  $("#k1").textContent = total.toLocaleString();
  $("#k2").textContent = Math.round((ghosts / total) * 100) + "%";
  $("#k3").textContent = deserts;
}
function exportCsv() {
  const lines = [["plan", "specialty", "region", "listed", "truly_accepting", "ghost_rate_pct"].join(",")];
  for (const pl of PLANS) for (const s of SPECIALTIES) for (const r of REGIONS) {
    const listed = providers.filter((p) => p.specialty === s.id && town(p.town).region === r && p.plans[pl.id].listed);
    const real = listed.filter((p) => p.plans[pl.id].accepts && p.acceptsNew).length;
    lines.push([pl.name, s.en, r, listed.length, real, listed.length ? Math.round((1 - real / listed.length) * 100) : ""].join(","));
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv" }));
  a.download = "coge-mi-plan-network-report-SYNTHETIC.csv";
  a.click();
}

// ---------- shell ----------
function applyLang() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll("[data-t]").forEach((n) => (n.textContent = t(n.dataset.t)));
  $("#msg").placeholder = t("placeholder");
  $("#suggest").innerHTML = t("suggestions").map((s) => `<button class="sugg">${s}</button>`).join("");
  $("#lang").textContent = state.lang === "es" ? "EN" : "ES";
  const keep = ["ph-spec", "ph-plan", "ph-town"].map((id) => $("#" + id).value);
  $("#ph-spec").innerHTML = SPECIALTIES.map((s) => `<option value="${s.id}">${s[state.lang]}</option>`).join("");
  $("#ph-plan").innerHTML = PLANS.map((p) => `<option value="${p.id}">${p.name}</option>`).join("");
  $("#ph-town").innerHTML = TOWNS.map((tw) => `<option value="${tw.id}">${tw.name}</option>`).join("");
  ["ph-spec", "ph-plan", "ph-town"].forEach((id, i) => ($("#" + id).value = keep[i] || { "ph-spec": "derm", "ph-plan": "vital", "ph-town": "caguas" }[id]));
  renderPharmacy();
  $("#i-plan").innerHTML = PLANS.map((p) => `<option value="${p.id}">${p.name} · ${p.kind}</option>`).join("");
  if (!$("#calllog").children.length || $("#calllog .idle")) $("#calllog").innerHTML = `<p class="idle muted">${t("callIdle")}</p>`;
  renderIntent(state.ctx);
  renderVerify();
  renderImpact();
}
function setTab(tab) {
  state.tab = tab;
  document.querySelectorAll(".tab").forEach((b) => b.classList.toggle("on", b.dataset.tab === tab));
  document.querySelectorAll(".view").forEach((v) => (v.hidden = v.id !== `view-${tab}`));
  if (tab === "impact") renderImpact();
  if (tab === "pharmacy") renderPharmacy();
  if (tab === "verify") renderVerify();
}

function init() {
  document.querySelectorAll(".tab").forEach((b) => b.addEventListener("click", () => setTab(b.dataset.tab)));
  $("#lang").addEventListener("click", () => { state.lang = state.lang === "es" ? "en" : "es"; applyLang(); });
  $("#composer").addEventListener("submit", (e) => { e.preventDefault(); const v = $("#msg").value; $("#msg").value = ""; handleUser(v); });
  $("#suggest").addEventListener("click", (e) => { if (e.target.matches(".sugg")) handleUser(e.target.textContent); });
  $("#chat").addEventListener("click", (e) => {
    const c = e.target.closest("[data-call]"); if (c) return callForMe(+c.dataset.call);
    const r = e.target.closest("[data-report]"); if (r) return reportWrong(+r.dataset.report);
  });
  $("#v-run").addEventListener("click", runRound);
  ["ph-spec", "ph-plan", "ph-town"].forEach((id) => $("#" + id).addEventListener("change", renderPharmacy));
  $("#ph-copy").addEventListener("click", copyPharmacy);
  $("#ph-results").addEventListener("click", (e) => {
    const b = e.target.closest("[data-phreport]"); if (!b) return;
    Object.assign(byId.get(+b.dataset.phreport).plans[$("#ph-plan").value], { verifiedDaysAgo: 120, source: "patient_report" });
    b.replaceWith(el(`<span class="badge warn">${t("phReported")}</span>`));
  });
  $("#i-plan").addEventListener("change", renderImpact);
  $("#i-export").addEventListener("click", exportCsv);
  applyLang();
  addMsg("bot", state.lang === "es"
    ? "¡Hola! 👋 Dime qué especialista necesitas, tu plan médico y tu pueblo. Te digo quién <b>de verdad</b> lo acepta hoy — sin que tengas que llamar a nadie."
    : "Hi! 👋 Tell me the specialist you need, your health plan and your town. I'll tell you who <b>actually</b> accepts it today — no calls needed.");
  renderStats();
}
init();
