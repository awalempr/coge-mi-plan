# ¿Coge Mi Plan? — Who *actually* takes your health plan?

**Caribbean AI Summit Healthcare Hackathon 2026 · Track: Access to care**

In Puerto Rico, finding a specialist who accepts your *plan médico* means calling office after office, because plan directories are full of "ghost" listings: doctors who dropped the plan, went cash-only, or aren't taking new patients. **¿Coge Mi Plan?** is a bilingual (ES/EN) chat assistant that tells patients which specialists are *verified* to accept their plan today. When a listing is stale, an AI voice agent calls the office for them, and every answer updates the directory for everyone.

## What the prototype shows
1. **Patient:** natural-language request in Spanish or English ("dermatólogo que coja Plan Vital en Caguas"). Returns verified results ranked by distance and wait, how many listings are ghosts, and a **"Llamar por mí"** button that runs an AI verification call.
2. **Verification:** queue of listings not verified in 90+ days, ranked by patient demand. One click runs a round of AI calls and shows the effect on 90-day compliance (No Surprises Act §116).
3. **Impact:** a "real access" heatmap (specialty × region) and ghost-listing rates by plan, with a CSV export for regulators (OCS / ASES) and plans.

## Run it
No build step. Any static server works:
```bash
python3 -m http.server 5178   # then open http://localhost:5178
```
To deploy on Vercel, import the repo with no framework preset, no build command, and output directory `.`. GitHub Pages also works.

## Data, privacy and limitations
- **100% synthetic data.** Provider names are fictional and generated with a seeded PRNG (`data.js`). Plan names are used only for realism; the acceptance numbers are **not** real plan data.
- The AI calls are **simulated** in the prototype. Production would use a voice agent (LLM + telephony) that announces it is automated, asks only about office business information (plans accepted, new patients, next opening), and never handles patient PHI.
- Patient searches are anonymous; nothing is stored.
- The intent parser is deterministic (regex/alias based) so the demo works offline. In production an LLM would fill the same slots.
- Limitation: office answers can change daily, so we show the verification age and source on every result.

## Context
- Problem source: a voice memo from a former hospital nurse in PR (see `docs/voice-memo-insights.md`).
- Research and sources: `docs/research.md`.
