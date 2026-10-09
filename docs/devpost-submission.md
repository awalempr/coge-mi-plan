# DevPost submission: copy and paste

## Project name
¿Coge Mi Plan? (Takes My Plan?)

## Elevator pitch / tagline (200 characters max)
Puerto Rico's verified registry of which specialists actually accept your health plan, so patients stop calling office after office.

## Required 2–3 sentence description (problem, users, solution)
In Puerto Rico, patients waste days calling specialists listed in their health plan's directory, only to learn the doctor no longer accepts their plan; about half of Medicare Advantage directory listings contain errors. ¿Coge Mi Plan? is a bilingual, voice-first assistant for patients, caregivers and community pharmacists that answers from a verified registry of who actually accepts each plan. The registry is kept current with paid claims, office confirmations, patient reports and, as a fallback, AI verification calls.

## About the project (the "story" field, Markdown)

### Inspiration
It started with a voice memo from a former hospital nurse in Puerto Rico: *"Yo no sé cuántos dermatólogos llamé. Ninguno coge plan médico. Ninguno."* ("I don't know how many dermatologists I called. None take my plan. None.") Plan directories say yes, offices say no, and patients pay with lost days and delayed care. The root cause is low, late payments from plans, which push doctors out of networks while the directories never catch up.

### Why this problem
The memo named three problems: specialists who don't take your plan, nurses tracking patients by hand, and lab lines where you lose your day. We scored all three:

| | Patient registry (chosen) | Nurse task tool | Lab virtual line |
|---|---|---|---|
| Who it helps | 3.2M residents, including 1.4M on Plan Vital and 771K aged 65+ | Nurses in one hospital per sale | Patients of one lab network |
| Time to launch | Weeks, on WhatsApp | Procurement + EHR integration | One operator partnership |
| Who pays | Health plans (federal 90-day directory rule) | Hospital IT budget | The lab operator |
| Patient records needed | None | Full records | Scheduling data |

Patient first means the most people and the fastest launch.

### What it does
- **Ask in your own words.** Patients type or send a voice note in Spanish or English, such as "mi mamá tiene la piel irritada, tiene la reforma, vivimos en Toa Baja." Claude turns it into dermatology, Plan Vital, and the nearest listed town (Bayamón).
- **See who actually says yes.** Results show confirmed specialists with the date and source of each verification (paid claim, office, patient report, AI call), next openings, and how many directory listings are ghosts.
- **No dead ends.** If nobody accepts the plan, the app shows telehealth options, a pre-written request to the plan, the Oficina del Procurador del Paciente, and the private-pay price.
- **Safety first.** Emergency language is caught on the device, before any AI call, and shows 911, 988 and Línea PAS.
- **Built for seniors.** Tap-first chips, voice notes, large text, and "send to a family member."
- **Pharmacy mode.** Community pharmacists answer "¿quién coge mi plan?" at the counter and report turn-aways with one tap.
- **Verified registry.** Listings with no evidence in 90+ days are queued by patient demand. An AI voice agent calls only as a fallback.
- **Impact map.** Ghost-listing rates by plan and specialist deserts by region, exportable for regulators (OCS, ASES).

### How we built it
- A static web app (HTML/CSS/JS) styled after Apple's design guidelines: an iMessage-style chat in an iPhone frame, with dark mode, reduced motion, and 44pt touch targets.
- **Claude (Opus 5.5)** in a Netlify Function turns free-form messages into structured slots using JSON-schema structured output. It maps symptoms to specialties and unlisted towns to the nearest one, and flags emergencies. A deterministic parser takes over whenever the AI is unavailable, so the app never breaks.
- A Twilio-ready WhatsApp webhook uses the same AI layer. It keeps only three search slots, under a hashed phone number, for 30 minutes.
- Per-visitor rate limiting, and a synthetic registry generated with a seeded PRNG.

### Challenges we ran into
- Keeping the AI helpful without ever giving medical advice. It only routes to a specialty, and an on-device emergency screen runs first.
- Making a demo that can't fail in front of judges: resilient fallbacks, cold-start handling, and a guided demo mode.
- Designing for older adults: voice, taps instead of typing, and large text.

### Accomplishments we're proud of
A working, bilingual, AI-powered prototype that real people in Puerto Rico would understand in ten seconds, with privacy built in from the start.

### What we learned
The data problem is the patient problem. Verifying who accepts which plan, and showing how old every answer is, matters more than any single feature.

### What's next
A 90-day pilot in Caguas: three specialties, two plans, ten CUD community pharmacies. We'll measure ghost-listing rate, days to first appointment, and calls saved. Then booking, lab virtual lines, and nurse task tools on the same platform.

### Data and privacy
The demo uses **100% synthetic data** with fictional providers and the reserved 555 phone range. The verification calls are simulated. No patient records are stored, and searches are anonymous. The claims-based verification feed would require data-sharing agreements with the plans.

## Built with (tags)
claude, anthropic, javascript, html5, css3, netlify, netlify-functions, twilio, whatsapp, remotion, elevenlabs

## Links ("Try it out")
- Live demo: https://coge-mi-plan.netlify.app
- Code: https://github.com/awalempr/coge-mi-plan

## Video demo link
(paste your YouTube Unlisted link here after uploading coge-mi-plan-demo.mp4)

## Team
Jay Awal (solo)
