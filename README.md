# ¿Coge Mi Plan? — Who *actually* takes your health plan?

**Caribbean AI Summit Healthcare Hackathon 2026 · Track: Access to care**

In Puerto Rico, finding a specialist who accepts your *plan médico* means calling office after office, because plan directories are full of "ghost" listings: doctors who dropped the plan, went cash-only, or aren't taking new patients. **¿Coge Mi Plan?** is a **central, verified registry of who accepts which plan across the island**. Patients, pharmacies, plans and regulators all read from the same source of truth.

Each listing is verified with the best evidence available:
1. **Paid claims** from plans (a plan paid Dr. X for a Plan Vital visit in the last 60 days, so Dr. X accepts Plan Vital)
2. **Office confirmation**: one tap on WhatsApp each month
3. **Patient and pharmacy reports** ("they turned me away")
4. **AI voice call** as a fallback, only when nothing recent exists

## What the prototype shows
1. **Patient:** tap-first and voice-first (big start buttons, quick replies, voice notes, A+ large text). A bilingual (ES/EN) chat. "Dermatólogo que coja Plan Vital en Caguas" returns verified specialists with the verification date, source and next opening, plus how many listings are ghosts. "Llamar por mí" runs the AI fallback call.
2. **Pharmacy:** a counter mode for community pharmacies. The pharmacist answers "¿quién coge mi plan?" in seconds, copies the list for the patient's WhatsApp, and reports turn-aways with one tap.
3. **Verification:** the registry's verification-source mix and 90-day compliance (No Surprises Act §116), plus the queue of stale listings ranked by patient demand.
4. **Impact:** a "real access" heatmap (specialty × region, red = specialist desert) and ghost-listing rates by plan, with a CSV export for regulators (OCS / ASES) and plans.

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

## Guided demo
Press **▶ Demo** in the header for a ~50-second captioned walkthrough of all four views. Use it for the live demo or the screen-recorded video.
