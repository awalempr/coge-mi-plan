# 3-minute pitch script + judge Q&A

Rule of thumb: about 130 words a minute. The script is about 390 words. Practice it out loud with a timer twice.

## Script

**[Slide 1, cover] 0:00–0:25**
"Yo no sé cuántos dermatólogos llamé. Ninguno coge plan médico. Ninguno."
A former hospital nurse here in Puerto Rico said that in a voice memo. Everyone in this room has lived it: you call office after office, and nobody takes your plan.

**[Slide 2, problem] 0:25–0:55**
This isn't bad luck, it's bad data. CMS found that about half of Medicare Advantage directory locations had errors, and 95% of Medicare patients in Puerto Rico are on Medicare Advantage. In April, investigative reporters found that half the specialists they sampled took no First Medical coverage at all. Plans pay late and pay little, so doctors drop them, but the directories never catch up. The patient pays the price in lost days, missed work and delayed care.

**[Slide 3, solution + live demo] 0:55–2:05**
¿Coge Mi Plan? is one verified registry of who actually accepts which plan, island-wide.
*(Press ▶ Demo, or do it live.)*
A patient in Caguas sends a voice note: dermatologist, Plan Vital. The plan's directory lists 14. We've confirmed 1. 8 are ghosts, which is 8 calls she never has to make.
How do we know? Paid claims from the plans, a monthly one-tap WhatsApp confirmation from the office, patient reports, and only as a last resort an AI call. That call updates the registry for everyone.
An older adult in Yauco needs a psychiatrist. He just taps. Nobody accepts his plan, so instead of a dead end he gets telehealth options, a pre-written request to his plan, and the Procurador del Paciente.
At the community pharmacy, the pharmacist answers "¿quién coge mi plan?" in seconds.
And for the first time we can see real access: the red cells are specialist deserts, by plan and by region.

**[Slide 4, adoption] 2:05–2:35**
We built for the patient first because it reaches the most people and ships fastest: no hospital procurement, no EHR integration, just WhatsApp. One in four residents is 65 or older, so it's voice-first, large text, and family or the pharmacist can search for you. Plans already must verify directories every 90 days under federal law, so they're the buyer. CUD's pharmacies are the front door. No patient health data is ever stored.

**[Slide 5, pilot] 2:35–3:00**
Our ask: a 90-day pilot in Caguas covering three specialties, two plans and ten CUD pharmacies. We'll measure ghost rate, days to first appointment, and calls saved. Then we add booking and virtual lab lines, the next problem in that same voice memo.
Antes de llamar, pregúntale a Coge Mi Plan.

## Likely questions, by judge profile

### Business / community leader (Alan Taveras, CUD)
- **"What do my pharmacies get?"** Customers who come back. The pharmacist becomes the person who solved their problem, and turn-away reports give the pharmacy a voice in fixing the network. Pilot cost to pharmacies: zero.
- **"Who pays long-term?"** Plans, for directory-compliance-as-a-service. They're federally required to verify every 90 days, and today each one does it badly on its own. A secondary line: aggregated network-access reports for regulators and medical associations.
- **"Why hasn't someone done this?"** Each plan only fixes its own directory, and nobody owns the cross-plan view the patient actually needs. A neutral local registry can.

### Clinician / health system
- **"Doctors won't respond to another form."** It's one tap on WhatsApp once a month, and paid claims verify most listings with zero office effort. Offices benefit too: fewer calls from patients they can't take.
- **"Won't this push patients away from doctors who are close to accepting?"** Each listing shows its date and source, and patients can still use "Llamar por mí." We never hide a listing, we label it.
- **"What about referrals and prior authorization?"** The "before you go" tip covers referrals today. Referral and prior-auth status per plan is on the roadmap.

### Technologist / AI
- **"Where's the AI?"** Three places: understanding free Spanish voice and text (in production an LLM fills specialty, plan and town; the demo uses a deterministic parser so it can't fail offline), the voice agent for fallback verification calls, and entity matching across plan directories, which list the same doctor in different ways.
- **"Accuracy?"** Every answer carries its evidence (claims, office, patient, AI call) and its age. Conflicts go to a re-verification queue ranked by patient demand.
- **"Privacy?"** Patient searches are anonymous. The registry holds office business facts only. Claims ingestion needs a data-sharing agreement with plans and would use provider-plan pairs, never patient identities. AI calls say they're automated and only ask business questions.

## Honest limits (say these before they're asked)
- The prototype runs on 100% synthetic data, and the calls are simulated.
- Claims-based verification depends on plan agreements. The pilot tests exactly that.
- Acceptance changes daily, which is why we show how old each answer is.
