# 04 – MVP & regulation

> Not legal advice. Health apps in India sit across several overlapping regimes. Get a review from
> a healthcare regulatory lawyer before launch, especially before adding AI-generated exercise
> plans or anything presented as treatment.

## 1. MVP scope

### What the current Thriver app already has

| Area                         | Status in the repo                                                  | Gap for a cancer-survivor MVP                                             |
| ---------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Records vault + AI assistant | Built: on-device storage, Claude-based explanations, consent screen | Indian-language answers; ABDM/DigiLocker import (later)                   |
| Appointments, medication     | Built                                                               | Link to treatment timeline; medication list from discharge summary        |
| Move                         | Generic routines and activity log                                   | **Cancer-specific, clinician-gated protocol library** (the core product)  |
| Meditate, Journal, mood      | Built                                                               | Fear-of-recurrence and anxiety content; symptom tracking                  |
| Family notes                 | Built (link-based)                                                  | —                                                                         |
| Profile                      | Name and stats                                                      | **Clinical profile**: cancer type, surgery, dates, treatments, clearance  |
| Community                    | Not built                                                           | Moderated groups by cancer type, language and city                        |
| Specialist access            | Not built                                                           | Book sessions with onco-physios and dietitians (registered practitioners) |
| Nutrition                    | Not built                                                           | Indian onco-dietitian-approved plans                                      |

### Recommended MVP (pilot with one hospital, breast cancer first)

**Must have**

1. **Onboarding + clinical profile:** cancer type, surgery type and date, treatments, known risks
   (lymphoedema, bone metastases, neuropathy, ostomy), and treating hospital.
2. **Clinician clearance flow:** a phase only unlocks when the care team approves it (QR or link from
   the hospital, or an upload of a signed form). See the phase model in
   [01](01-clinical-evidence.md#4-what-this-means-for-thrivers-personalisation-promise).
3. **Protocol library v1:** breast cancer phases 1–4, written and signed off by the advisory board.
   Video demos with Hindi and English voice-over.
4. **Daily check-in + red flags:** fatigue, pain, swelling, fever, mood. Red flags pause exercise and
   show "contact your care team" or emergency guidance.
5. **Indian nutrition basics:** protein-forward vegetarian and non-vegetarian plate guides, approved
   by a dietitian. No supplement selling.
6. **Records + AI assistant** (already built), with an Indian privacy notice.
7. **Hospital dashboard (simple):** enrolled patients, adherence, red-flag alerts.

**Should have**

- Specialist video sessions with registered practitioners.
- Reminders (medication, exercise, appointments) via push or WhatsApp.
- More Indian languages (Hindi first, then Tamil, Telugu, Bengali, Marathi).

**Later**

- Moderated community. Moderation is a safety-critical cost: medical misinformation, distress and crises.
- ABDM / DigiLocker records import.
- Head and neck, colorectal and other cancer types.
- Nearby healthy food around cancer hospitals (wiki idea, in the backlog).

### Success metrics for the pilot

Enrolment rate at discharge, 12-week adherence, change in fatigue and quality-of-life scores, red-flag
escalations handled, patient and clinician satisfaction, safety events (target zero serious).

## 2. Regulatory landscape (India)

### 2.1 Medical-device software (CDSCO)

- Under the **Medical Devices Rules, 2017**, software with a medical purpose is already a medical device.
  **CDSCO issued a draft Guidance Document on Medical Device Software on 21 October 2025**, setting out
  risk-based classification and licensing for standalone software. It is a **draft**.
  ([India Briefing](https://india-briefing.com/news/cdsco-draft-guidance-medical-software-40691.html), [Nishith Desai](https://www.nishithdesai.com/research-and-articles/hotline/pharma-healthcare-update/the-next-frontier-in-medtech-regulation-dissecting-cdscos-draft-guidance-on-medical-device-software-15465))
- General fitness and wellness apps have been outside the device definition. The line is blurry for
  **monitoring and decision-support features**.
  ([Conventus Law](https://conventuslaw.com/report/india-medical-device-as-software-has-cdsco-guidance-changed-the-rules/))

**What this means for Thriver** (needs legal confirmation):

| Feature                                                                                                          | Likely position                                                                                        |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| General wellness, meditation, journal, family notes                                                              | Wellness, not a device                                                                                 |
| Records storage and plain-language explanation                                                                   | Probably not a device if it explains rather than diagnoses or recommends treatment                     |
| **AI-generated exercise "prescription" by cancer type and days since surgery**, marketed as clinically validated | **Higher risk of being a medical device.** It sounds like software that informs treatment of a disease |
| Clinician-approved protocol library that AI only selects from, with clinician clearance                          | Lower risk, and stronger clinically                                                                    |

**Recommendations:** avoid words like "treat", "prescribe" and "diagnose" in claims; keep clinicians in
the loop; document intended use; monitor the final CDSCO guidance.

### 2.2 Data protection: DPDP Act 2023 + Rules 2025

- The **Digital Personal Data Protection Rules, 2025** were notified on **13/14 November 2025**, with a
  staggered rollout. Data Protection Board provisions applied immediately. Consent-manager and some
  notice and consent provisions take effect around **one year later (about 13 November 2026, which is
  close)**. Most obligations (notice, verifiable consent, security safeguards, breach reporting) apply
  after **18 months (about May 2027)**. Sources disagree on which rule falls in which phase; check the
  gazette text.
  ([Hogan Lovells](https://ca.hoganlovells.com/en/publications/indias-digital-personal-data-protection-act-2023-brought-into-force-), [Mondaq](https://webiis10.mondaq.com/india/data-protection/1706722/legal-update-digital-personal-data-protection-rules-2025), [AZB](https://www.azbpartners.com/bank/update-indias-digital-personal-data-protection-framework-comes-into-effect/))
- No health-specific provisions were found in this round, but health data is among the most sensitive
  data a company can hold.

**What Thriver already does well:** records stay on the device by default; explicit consent before the
AI sees anything; the API key is server-side; family notes travel in the link fragment, not through a
server.
**What's needed before launch:** a privacy notice in plain language (and Indian languages);
purpose-specific consent records; a way to withdraw consent and delete data; a breach-response plan; a
data processing agreement with the AI provider (Anthropic) covering health data and retention; and a
decision on where data is stored once there is a backend.

### 2.3 Telemedicine (if adding specialist access)

- The **Telemedicine Practice Guidelines, 2020** allow only **registered medical practitioners (RMPs)**
  to practise telemedicine. Normal professional and ethical norms apply, and the RMP's registration
  number must appear on prescriptions and communications.
  ([Mondaq](https://www.mondaq.com/india/healthcare/921874/telemedicine-practice-guidelines), [PSA Legal FAQ](https://psalegal.com/telemedicine-guidelines-2020-faq/))
- The guidelines don't address AI. Treat the AI assistant as **information and explanation only**: no
  prescribing and no diagnosis. It already does this.
- Physiotherapists and dietitians have their own regulators and rules (for example the National
  Commission for Allied and Healthcare Professions). To research.

### 2.4 AI ethics: ICMR guidelines 2023

- The **ICMR Ethical Guidelines for AI in Biomedical Research and Healthcare (2023)** cover
  accountability, patient autonomy (including the right to refuse AI), data representative of Indian
  populations, and **clinical and field validation before use**.
  ([ICMR PDF](https://www.icmr.gov.in/icmrobject/custom_data/pdf/Ethical-guidelines/Ethical_Guidelines_AI_Healthcare_2023.pdf))
- **For Thriver:** keep the consent screen and a non-AI path; validate AI explanations with clinicians
  on real Indian reports; log and review AI answers in the pilot (with consent).

### 2.5 ABDM and DigiLocker

- DigiLocker is an ABDM-integrated **Personal Health Records (PHR) app**. Users can create an ABHA,
  link records from ABDM-registered hospitals and labs, upload old records, and share them with
  ABDM-registered professionals.
  ([BioVoice, Nov 2022](https://biovoicenews.com/digilocker-users-can-now-store-health-records-link-them-with-ayushman-bharat-health-account/))
- Private PHR apps can integrate with ABDM through the NHA sandbox (milestone details not verified in
  this round). This would let Thriver **pull lab reports and discharge summaries automatically** into
  the records vault, directly matching the wiki's "DigiLocker with AI" idea.
- **Recommendation:** after the MVP, apply for ABDM sandbox access and integrate as a PHR app.

## 3. Pre-launch checklist (regulatory and safety)

- [ ] Healthcare regulatory lawyer reviews intended use, claims and the CDSCO position
- [ ] Clinical advisory board signs off protocols and red-flag rules
- [ ] Trademark search for "Thriver" (see [02](02-market-and-competitors.md#4-name-check-thrivors))
- [ ] DPDP-ready privacy notice, consent logging, deletion, breach plan
- [ ] Data processing agreement with the AI provider; health data retention settings
- [ ] Terms of use: not a substitute for medical care; emergency guidance
- [ ] Practitioner verification process (if offering specialist sessions)
- [ ] Ethics committee approval for the hospital pilot study
- [ ] Security review (authentication, encryption, backups) once a backend exists
