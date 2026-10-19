# 06 – Accounts and log-in: a plan for when Thriver goes online

Planning notes (October 2026). Not legal advice: data protection points need a lawyer's review (see
[04](04-mvp-and-regulation.md#22-data-protection-dpdp-act-2023--rules-2025)). Vendor features and prices
change often; check them before choosing.

## Where the app is today

- Sign-up is **on the device only**: name, cancer type, treatments, surgery date, conditions and the AI
  consent are saved in the browser (localStorage). Records live in IndexedDB.
- There is **no password and no server account**, so nothing to log in to. The welcome screen says
  plainly that sign-in and syncing between phones are coming soon.
- The downside: clearing the browser or changing phones loses everything, and family or doctors can't
  be given access.

## What accounts should add

1. **Keep data across phones**, and recover it after losing a phone.
2. **Back up records** (encrypted) instead of keeping them only on one device.
3. **Real consent records**: who agreed to what and when, with withdrawal (DPDP).
4. Later: **share with a caregiver or care team**, hospital pilots, and ABHA/DigiLocker records import.

## Recommended way to log in (India)

| Option                                    | Fit for Thriver                                                                                                                               |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Phone number + one-time code (OTP)**    | **Recommended first.** Most familiar in India, no password to forget, works for older users and family helpers. SMS costs money per message.  |
| WhatsApp OTP                              | A good second channel where SMS delivery is poor; needs a WhatsApp Business provider.                                                         |
| Google sign-in                            | Easy for people with Android phones; offer it next to OTP.                                                                                    |
| Email + magic link                        | Useful for caregivers abroad; less common among older Indian users.                                                                           |
| Password                                  | Avoid: forgotten passwords are a support burden and a security risk.                                                                          |
| **ABHA (Ayushman Bharat Health Account)** | Later: log in or link ABHA to pull records via ABDM. Needs ABDM sandbox approval (see [04](04-mvp-and-regulation.md#25-abdm-and-digilocker)). |

Add a **device passcode or fingerprint lock** on top (records are sensitive and phones are often
shared within a family).

## Building blocks to choose from

| Approach                                  | Pros                                                                                  | Cons                                                                  |
| ----------------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| **Supabase** (Postgres + auth + storage)  | Phone OTP built in (plugs into an SMS provider); row-level security; open source; SQL | Check that an Indian data region is available for the plan you choose |
| **Firebase** (Auth + Firestore + Storage) | Phone auth is mature and widely used in India; Mumbai region available                | NoSQL rules get complex; strong lock-in                               |
| **Own backend + MSG91 / Twilio for OTP**  | Full control over data and region                                                     | More to build and secure (rate limits, OTP abuse, sessions)           |

**Suggestion:** Supabase or Firebase with data in an Indian region, plus an Indian SMS provider for
OTP. Either works with the planned Netlify hosting; the AI endpoints move to serverless functions.

## How the current app moves over

1. **Keep "use without an account".** Sign-up stays on the device; an account is an optional upgrade
   ("Back up and sync").
2. On first log-in, **upload the local profile** (and, with consent, encrypted records) to the new
   account. On a new phone, download it.
3. The profile store (`useProfileStore`) is the shape to sync: `name`, `health`, `aiPersonalise`,
   `aiConsentAt`. Other stores (medication, appointments, journal) follow the same pattern.
4. **Protect the AI endpoints**: require a signed-in session (or a device token for guests) and rate
   limit `/api/records-assistant` and `/api/ai-picks`. The browser should never hold the Anthropic key
   (it doesn't today).

## Privacy and security checklist

- [ ] Store data in India; encrypt in transit and at rest
- [ ] Records: consider **end-to-end encryption** (keys stay on the user's devices), so the server
      can't read reports
- [ ] Separate, logged consents: account, records backup, AI picks, records assistant, research use
- [ ] Withdraw consent and **delete account** from inside the app; export data
- [ ] Limit OTP attempts per number and device; block disposable or abusive numbers
- [ ] Short sessions with refresh tokens; log out on all devices
- [ ] Caregiver access only by invitation, with read-only by default and easy revoke
- [ ] Data processing agreements with the auth, SMS and AI providers
- [ ] Breach response plan; security review before launch

## Steps

The full design is in [docs/architecture/backend.md](../architecture/backend.md).

1. Pick the provider and region; set up Netlify functions for the two AI endpoints.
2. Phone OTP log-in screen ("Back up and sync" from Profile and the welcome screen).
3. Sync the profile; then medication, appointments and journal.
4. Encrypted records backup.
5. Caregiver sharing; ABHA link (after ABDM sandbox approval).
