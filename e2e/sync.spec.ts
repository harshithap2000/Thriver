import { expect, test, type Page } from '@playwright/test'

/**
 * Two "phones" (browser contexts) using one account against a local Supabase stack. Runs only
 * when the app is built with Supabase settings, e.g.
 *   pnpm db:start
 *   VITE_SUPABASE_URL=http://127.0.0.1:54321 VITE_SUPABASE_PUBLISHABLE_KEY=<key> pnpm test:e2e
 * Uses a test phone number from supabase/config.toml (code 123456, no SMS is sent).
 */
test.skip(!process.env.VITE_SUPABASE_URL, 'needs a local Supabase stack')

const PHONE = '9999900002'

async function open(page: Page) {
  await page.goto('/')
  await expect(page.getByRole('status', { name: 'Loading Thriver' })).toBeHidden({ timeout: 8000 })
}

async function signInWithPhone(page: Page) {
  await page.getByRole('button', { name: /Continue with phone number/ }).click()
  await page.getByLabel('Your mobile number').fill(PHONE)
  const codeField = page.getByLabel(/Enter the code sent to/)
  // Codes can't be re-sent to the same number within a few seconds; wait and retry like a person.
  await expect(async () => {
    await page.getByRole('button', { name: 'Send code' }).click()
    await expect(codeField).toBeVisible({ timeout: 2000 })
  }).toPass({ intervals: [3000], timeout: 30_000 })
  await codeField.fill('123456')
  await page.getByRole('button', { name: 'Verify and sign in' }).click()
}

test('backs up on one phone and restores on another', async ({ browser }) => {
  test.setTimeout(90_000)
  const first = `Oncology review ${Date.now()}`
  const second = `Physio ${Date.now()}`
  const mainNav = (page: Page) => page.getByRole('navigation', { name: 'Main' })

  // Phone A: start as a guest, then sign in from Profile.
  const phoneA = await (await browser.newContext()).newPage()
  await open(phoneA)
  await phoneA.getByRole('button', { name: 'Get started' }).click()
  await phoneA.getByRole('textbox', { name: 'Your name' }).fill('Meera')
  await phoneA.getByRole('button', { name: 'Continue' }).click()
  await phoneA.getByRole('button', { name: 'I’d rather not say' }).click()
  await phoneA.getByRole('button', { name: 'Finish' }).click()

  await mainNav(phoneA).getByRole('link', { name: 'Care' }).click()
  await phoneA.getByRole('button', { name: 'Add' }).click()
  await phoneA.getByLabel('What is it?').fill(first)
  await phoneA.getByRole('button', { name: 'Save appointment' }).click()

  await mainNav(phoneA).getByRole('link', { name: 'Profile' }).click()
  await phoneA.getByRole('link', { name: 'Sign in or create an account' }).click()
  await signInWithPhone(phoneA)
  await expect(phoneA.getByText(/Signed in with phone · \+919999900002/)).toBeVisible()
  await phoneA.getByRole('button', { name: 'Back up now' }).click()
  await expect(phoneA.getByText(/^Backed up at/)).toBeVisible()

  // Phone B: a new phone. "I already have an account" restores the backup.
  const phoneB = await (await browser.newContext()).newPage()
  await open(phoneB)
  await phoneB.getByRole('link', { name: 'I already have an account' }).click()
  await signInWithPhone(phoneB)
  await expect(phoneB.getByRole('heading', { name: /You’ve got this/ })).toBeVisible()
  await expect(phoneB.getByText(/, Meera$/)).toBeVisible()
  await mainNav(phoneB).getByRole('link', { name: 'Care' }).click()
  await expect(phoneB.getByRole('heading', { name: first })).toBeVisible()

  // A change on phone B reaches phone A.
  await phoneB.getByRole('button', { name: 'Add' }).click()
  await phoneB.getByLabel('What is it?').fill(second)
  await phoneB.getByRole('button', { name: 'Save appointment' }).click()
  await mainNav(phoneB).getByRole('link', { name: 'Profile' }).click()
  await phoneB.getByRole('button', { name: 'Back up now' }).click()
  await expect(phoneB.getByText(/^Backed up at/)).toBeVisible()

  await phoneA.getByRole('button', { name: 'Back up now' }).click()
  await expect(phoneA.getByText(/^Backed up at/)).toBeVisible()
  await mainNav(phoneA).getByRole('link', { name: 'Care' }).click()
  await expect(phoneA.getByRole('heading', { name: second })).toBeVisible()
})
