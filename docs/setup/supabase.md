# Setting up Supabase (accounts and backup)

Thriver works without Supabase: everything stays on the phone. With Supabase configured, people can
sign in (Google, Apple or phone number) and their data is backed up and synced across their
devices. The design is in [docs/architecture/backend.md](../architecture/backend.md).

## How it works, in short

- **Local first.** Every screen reads from stores saved on the phone (the local cache), so the app
  is instant and works offline. Nothing waits for the network.
- **Sync in the background.** When signed in, changes upload about 1.5 seconds later, and changes
  from the person's other devices download when the app opens, comes back online, or every minute.
- **One table, locked per user.** Synced items live in `public.sync_items`. Row-level security
  means a signed-in person can only read and write their own rows; signed-out visitors get nothing.
  If two devices change the same item, the later edit wins.
- **Not synced yet:** records files, journal entries and family notes. They stay on the phone until
  end-to-end encryption is added.

## 1. Local development (Docker)

You need Docker running. The Supabase CLI is installed with the project (`pnpm install`).

```bash
pnpm db:start          # starts Postgres, Auth and the API in Docker; applies the migrations
pnpm exec supabase status -o env   # shows API_URL and PUBLISHABLE_KEY
```

Put those two values in `.env.local`:

```bash
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Then `pnpm dev`, open Profile → **Sign in or create an account** → **Continue with phone number**.
Local test numbers (no SMS is sent; set in `supabase/config.toml`):

| Number      | Code     |
| ----------- | -------- |
| 99999 00001 | `123456` |
| 99999 00002 | `123456` |

Open a second browser (or a private window), choose **I already have an account**, and sign in with
the same number to see the data restored and synced.

| Command                                                             | What it does                                            |
| ------------------------------------------------------------------- | ------------------------------------------------------- |
| `pnpm db:test`                                                      | Database tests (row-level security, conflict rules)     |
| `pnpm db:reset`                                                     | Rebuilds the local database from the migrations         |
| `pnpm db:stop`                                                      | Stops the containers                                    |
| `SUPABASE_TEST_URL=… SUPABASE_TEST_KEY=… pnpm test`                 | Also runs the integration tests against the local stack |
| `VITE_SUPABASE_URL=… VITE_SUPABASE_PUBLISHABLE_KEY=… pnpm test:e2e` | Also runs the two-phone sync test                       |

Changing the database: `pnpm exec supabase migration new <name>`, write SQL in the new file under
`supabase/migrations/`, add tests in `supabase/tests/database/`, then `pnpm db:reset && pnpm db:test`.
Every new table must enable row-level security and have tests proving one user can't see another's
rows.

## 2. Create the hosted project

1. Sign in at [supabase.com](https://supabase.com) and create an organisation for Thriver.
2. **New project**: name `thriver`, region **South Asia (Mumbai)**, a strong database password
   (save it in a password manager). Free is fine for development; use a paid plan with backups
   before real patients use it.
3. **Project Settings → API keys**: copy the **Project URL** and the **publishable key** into your
   hosting provider's environment variables (and `.env.local` if you want to develop against it):
   `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`. **Never** put the secret (service role) key
   in the app or in git.

## 3. Create the database tables

```bash
pnpm exec supabase login
pnpm exec supabase link --project-ref <your-project-ref>   # the id in your project URL
pnpm exec supabase db push                                  # applies supabase/migrations
```

In the dashboard, **Table Editor → sync_items** should show the table with RLS enabled.

## 4. Sign-in settings

**Authentication → URL Configuration**

- **Site URL:** your production address, e.g. `https://thriver.example.com`.
- **Redirect URLs:** add `http://localhost:5173/auth/callback` and
  `https://<your-domain>/auth/callback` (plus your preview-deploy pattern if you use one).

### Phone number

**Authentication → Sign In / Providers → Phone**: turn it on.

- For testing without SMS costs, add **test phone numbers and codes** there.
- Real SMS to Indian numbers needs **TRAI DLT registration** first (business entity, sender ID and
  an OTP message template), which takes a week or two. Then either pick a supported SMS provider in
  the same screen, or (planned) send codes through MSG91 using Supabase's **Send SMS hook**, which
  the Thriver API will provide.

### Google

1. In [Google Cloud Console](https://console.cloud.google.com), create a project and set up the
   **OAuth consent screen** (app name Thriver, support email, privacy policy link). Ask only for
   `openid`, `email` and `profile`.
2. **Credentials → Create credentials → OAuth client ID → Web application.**
   - Authorized JavaScript origins: `http://localhost:5173` and your production address.
   - Authorized redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`
3. Copy the client ID and secret into **Supabase → Authentication → Sign In / Providers → Google**
   and turn it on. Publish the consent screen when you're ready for real users.

### Apple

1. You need an [Apple Developer Program](https://developer.apple.com/programs/) membership.
2. In **Certificates, Identifiers & Profiles**: create an App ID with _Sign in with Apple_, then a
   **Services ID** (this is the client ID, e.g. `app.thriver.web`). Configure it with the domain
   `<your-project-ref>.supabase.co` and the return URL
   `https://<your-project-ref>.supabase.co/auth/v1/callback`.
3. Create a **key** with _Sign in with Apple_ and download the `.p8` file. Store it safely: Apple
   won't let you download it again.
4. Generate the client secret from the `.p8` key (Supabase's Apple guide links to a generator) and
   enter the Services ID and secret in **Supabase → Sign In / Providers → Apple**.
5. **Put a reminder in the calendar:** for web sign-in, Apple's secret expires after at most 6
   months, and Apple sign-in silently stops working until you generate a new one.

The sign-in screen only shows the methods that are switched on, so you can launch with phone only
and add Google and Apple later.

## 5. Check it

1. Run the app against the hosted project and sign in from Profile.
2. In the dashboard, **Authentication → Users** shows the new user, and **Table Editor → sync_items**
   shows their items (each with their `user_id`).
3. Sign in on a second device and confirm the data appears there.

## Before real patients use it

- [ ] Paid plan with daily backups (and point-in-time recovery if available)
- [ ] DLT registration and a real SMS provider; review Auth rate limits for SMS
- [ ] CAPTCHA on sign-in (Auth → Attack Protection). The app must send the CAPTCHA token first;
      this isn't built yet, so don't switch it on until it is
- [ ] Data processing agreement with Supabase; privacy notice updated for the backup
- [ ] Records, journal and family notes synced only once end-to-end encryption is built
