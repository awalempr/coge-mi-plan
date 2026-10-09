// Turns a free-form Spanish/English message (typed, or a messy voice transcript) into search slots.
// Claude fills the slots; the deterministic parser in core.js is the fallback whenever Claude is unavailable.
import Anthropic from "@anthropic-ai/sdk";
import { PLANS, SPECIALTIES, TOWNS } from "../../site/data.js";
import { parseQuery } from "../../site/core.js";

const MODEL = "claude-opus-5-5";
const MAX_INPUT_CHARS = 600;

const SPEC_IDS = SPECIALTIES.map((s) => s.id);
const PLAN_IDS = PLANS.map((p) => p.id);
const TOWN_IDS = TOWNS.map((t) => t.id);

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["specialty", "plan", "town", "language", "urgent", "note"],
  properties: {
    specialty: { type: "string", enum: [...SPEC_IDS, "unknown"] },
    plan: { type: "string", enum: [...PLAN_IDS, "unknown"] },
    town: { type: "string", enum: [...TOWN_IDS, "unknown"] },
    language: { type: "string", enum: ["es", "en"] },
    urgent: { type: "boolean" },
    note: { type: "string" },
  },
};

// Stable system prompt (kept byte-identical across requests so it can be cached).
const SYSTEM = `You read one message from a patient in Puerto Rico who is looking for a medical specialist that accepts their health plan. Messages are usually Puerto Rican Spanish, sometimes English or Spanglish, and may be voice-note transcripts with errors. Latency-sensitive; answer immediately.

Fill the slots:
- specialty: the specialist they need. Map symptoms or body parts to the right specialty (skin rash → derm; thyroid or diabetes → endo; chest pain follow-up or heart → cardio; seizures, migraines → neuro; joint pain, lupus, arthritis → reuma; stomach → gastro; depression, anxiety → psiq; eyes → oftal; prostate, kidney stones → uro; asthma, lungs → neumo). Ids: ${SPECIALTIES.map((s) => `${s.id} (${s.en})`).join(", ")}.
- plan: their health plan. Ids: ${PLANS.map((p) => `${p.id} (${p.name}; also called ${p.aliases.join(", ")})`).join("; ")}. "La reforma", "el plan del gobierno" and Medicaid mean vital. If they name an insurer's Medicare Advantage or commercial product, pick that insurer.
- town: where they want to be seen. Ids: ${TOWNS.map((t) => `${t.id} (${t.name})`).join(", ")}. If they name a Puerto Rico town that is not in the list, choose the nearest listed town (for example Toa Baja → bayamon, Trujillo Alto → carolina, Juana Díaz → ponce, Cabo Rojo → mayaguez, Isabela → aguadilla, Vega Baja → manati, Gurabo → caguas).
Use "unknown" for any slot the message (together with the already-known slots provided) does not establish. Never guess a plan or town that was not stated.
- language: the language the patient wrote in.
- urgent: true only if the message describes a possible emergency right now (for example chest pain now, trouble breathing, stroke signs, suicidal thoughts, heavy bleeding).
- note: empty string, except: if urgent, one short sentence in the patient's language telling them to call 911 now (and 988 for a mental health crisis); if the message is not about finding a specialist, one short sentence in the patient's language explaining what you can help with. Never give medical advice.`;

let client;
export function aiEnabled() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export async function understand(text, known = {}) {
  const clean = String(text || "").slice(0, MAX_INPUT_CHARS);
  const fallback = () => ({ ...known, ...parseQuery(clean), source: "local", urgent: false, note: "" });
  if (!aiEnabled() || !clean.trim()) return fallback();

  client ??= new Anthropic({ timeout: 15_000, maxRetries: 1 });
  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 2048,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
      system: SYSTEM,
      messages: [{
        role: "user",
        content: `Already known: ${JSON.stringify(known)}\nPatient message: ${clean}`,
      }],
    });
    if (response.stop_reason === "refusal") return fallback();
    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock) return fallback();
    const out = JSON.parse(textBlock.text);
    const merged = { ...known };
    for (const k of ["specialty", "plan", "town"]) if (out[k] && out[k] !== "unknown") merged[k] = out[k];
    return { ...merged, language: out.language, urgent: Boolean(out.urgent), note: out.note || "", source: "claude" };
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) console.warn("understand: rate limited, using local parser");
    else if (error instanceof Anthropic.APIError) console.error(`understand: API error ${error.status}`);
    else console.error("understand: failed", error?.name);
    return fallback();
  }
}
