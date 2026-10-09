# ¿Coge Mi Plan? (Takes My Plan?): who *actually* accepts your health plan

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

**Live:** https://coge-mi-plan.netlify.app

## How it's built
- `site/` is a static app with no build step: `index.html`, `styles.css`, `app.js` (UI), `core.js` (parsing and search shared with the server) and `data.js` (seeded synthetic registry).
- `netlify/functions/understand.mjs` is `POST /api/understand`. **Claude (Opus 5.5)** turns free-form Spanish or English, including voice-note transcripts, symptoms ("me pica la piel"), slang ("la reforma") and towns not in the list (Toa Baja → Bayamón), into structured slots using JSON-schema structured output. It flags emergencies (911/988) and keeps a per-visitor rate limit. If Claude is unavailable, the app falls back to the deterministic parser in `core.js`, so the demo never breaks.
- `netlify/functions/whatsapp.mjs` is `POST /api/whatsapp`, a Twilio WhatsApp webhook backed by the same Claude layer and registry. It keeps only the three search slots, keyed by a hash of the phone number, for 30 minutes. "BORRAR" deletes them immediately. It validates Twilio's request signature when `TWILIO_AUTH_TOKEN` is set.

## Run it
```bash
npm install
npx netlify dev          # site + functions on http://localhost:8888 (set ANTHROPIC_API_KEY for the Claude layer)
# or static only, using the local parser:
cd site && python3 -m http.server 5178
```

## Connect WhatsApp (Twilio sandbox, about 10 minutes)
1. In the Twilio Console, open Messaging → Try it out → Send a WhatsApp message and join the sandbox from your phone.
2. In the sandbox settings, set "When a message comes in" to `https://coge-mi-plan.netlify.app/api/whatsapp` (POST).
3. In Netlify, set `TWILIO_AUTH_TOKEN` (and `PUBLIC_WHATSAPP_URL` to that same URL) so every request's signature is verified. Redeploy.
4. Message the sandbox number: "Necesito un dermatólogo que coja Plan Vital en Caguas".

## Data, privacy and limitations
- **100% synthetic data.** Provider names are fictional and generated with a seeded PRNG (`data.js`). Plan names are used only for realism; the acceptance numbers are **not** real plan data.
- The AI calls are **simulated** in the prototype. Production would use a voice agent (LLM + telephony) that announces it is automated, asks only about office business information (plans accepted, new patients, next opening), and never handles patient PHI.
- Patient searches are anonymous; nothing is stored.
- Claude fills the search slots; the deterministic parser is the offline fallback. Claude never gives medical advice. It only routes, and it points to 911/988 for emergencies.
- Limitation: office answers can change daily, so we show the verification age and source on every result.

## Context
- Problem source: a voice memo from a former hospital nurse in Puerto Rico, anonymized in `docs/voice-memo-insights.md` (the raw recording is not published).
- Research and sources: `docs/research.md`.

## Guided demo
Press **▶ Demo** in the header for a ~50-second captioned walkthrough of all four views. Use it for the live demo or the screen-recorded video.
