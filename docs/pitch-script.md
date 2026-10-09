# 3-minute pitch: script, timing and judge Q&A

Five slides that follow a sales arc: hook → why this problem → product → adoption → ask. That's about 400 words at a natural pace. Rehearse twice with a timer. Speaker notes for each slide are in the deck too.

## Script

**Slide 1: hook + problem (0:00–0:35)**
*(Optional opener: "I'm Jay Awal, and I built this solo.")*
"Yo no sé cuántos dermatólogos llamé. Ninguno coge plan médico. Ninguno."
A former hospital nurse here in Puerto Rico said that in a voice memo. Everyone in this room has lived it: you call office after office, and nobody takes your plan.
This isn't bad luck, it's bad data. About half of Medicare Advantage directory listings have errors. In April, investigative reporters found half the specialists they sampled took no First Medical coverage at all. And we've lost more than 8,000 physicians. Plans pay late and pay little, doctors drop the plans, and the directories never catch up.

**Slide 2: why this problem (0:35–1:05)**
The memo named three problems: specialists who don't take your plan, nurses tracking patients by hand, and lab lines where you lose your day. We scored all three. A nurse tool helps one hospital per sale and needs procurement and an EHR integration. A lab line helps one operator's patients. The registry helps all 3.2 million people on this island who have a plan, including 1.4 million on Plan Vital and 771,000 seniors. Patients share no health data, and it launches on WhatsApp in weeks. Patient first means the most people and the fastest launch.

**Slide 3: product + live demo (1:05–2:00)**
*(Live app or ▶ Demo.)* A patient in Caguas sends a voice note: dermatologist, Plan Vital. The directory lists 14. We've confirmed 1. Eight are ghosts, which is eight calls she never has to make. *(Tap "Llamar por mí".)* When a listing is stale, an AI call checks it and updates the registry for everyone. *(Type a messy message.)* Claude understands how people actually talk: "mi mamá tiene la piel irritada, tiene la reforma, vivimos en Toa Baja" becomes dermatologist, Plan Vital, nearest town Bayamón. Chest pain or suicidal language gets 911 and 988 before anything else. *(Impact tab.)* And for the first time we can see the red cells: specialist deserts, by plan and region.

**Slide 4: adoption (2:00–2:35)**
Patients use it free. Plans are the buyer: federal rules already require every plan to keep its directory accurate, and we do it once for all of them. CUD's pharmacies are the front door, because that's where people already ask "¿quién coge mi plan?". Regulators get evidence on the real cause. No patient records are stored. The demo runs on synthetic data, and the claims feed needs plan agreements, which is what the pilot tests.

**Slide 5: pilot + ask (2:35–3:00)**
Ninety days in Caguas: three specialties, two plans, ten CUD pharmacies. We'll measure ghost rate, days to first appointment, and calls saved. Our ask: fund the pilot, and introduce me to ten pharmacies and one plan partner. Antes de llamar, pregúntale a Coge Mi Plan.

## Likely questions, by judge profile

### Business / community leader (Alan Taveras, CUD)
- **"What do my pharmacies get?"** Customers who come back, because the pharmacist solved their problem. Turn-away reports also give pharmacies a voice in fixing the network. It costs pharmacies nothing.
- **"Who pays long-term?"** Plans, for directory compliance as a shared service. Secondary: aggregated access reports for regulators and medical associations.
- **"Why hasn't someone done this?"** Each plan only fixes its own directory. Nobody owns the cross-plan view the patient actually needs.

### Clinician / health system
- **"Doctors won't fill out another form."** It's one tap on WhatsApp once a month, and paid claims verify most listings with no office effort. Offices also get fewer calls from patients they can't take.
- **"Is the AI giving medical advice?"** No. It only routes people to the right type of specialist. Emergencies are screened on the device before any AI call and shown 911, 988 and Línea PAS.
- **"Referrals and prior authorization?"** The "before you go" tip covers referrals today. Per-plan referral and prior-auth rules are on the roadmap.

### Technologist / AI
- **"Where's the AI?"** Claude (Opus 5.5) turns free-form Spanish, English and voice transcripts into structured slots with JSON-schema output. It maps symptoms to specialties and unlisted towns to the nearest one, and flags emergencies. If Claude is unreachable, a deterministic parser takes over, so the app never breaks. The same layer powers the WhatsApp webhook. The AI fallback call agent is simulated in the prototype.
- **"Accuracy?"** Every answer shows its evidence (claim, office, patient, AI call) and how old it is. Conflicts go to a re-verification queue ranked by patient demand.
- **"Privacy and cost?"** Searches are anonymous. WhatsApp keeps only three search slots, under a hashed number, for 30 minutes. AI calls are rate-limited per visitor.

## Honest limits (say them before you're asked)
- The demo runs on 100% synthetic data, and the verification calls are simulated.
- Claims-based verification depends on plan agreements. The pilot tests exactly that.
- Acceptance changes daily, which is why every answer shows its age.
