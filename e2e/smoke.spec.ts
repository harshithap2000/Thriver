import { expect, test } from '@playwright/test'

test('home loads, records a check-in and navigates via the tab bar', async ({ page }) => {
  await page.route('**/posts?_limit=10', (route) =>
    route.fulfill({ json: [{ id: 1, userId: 1, title: 'mocked post', body: 'From e2e' }] }),
  )

  await page.goto('/')
  const splash = page.getByRole('status', { name: 'Loading Thriver' })
  await expect(splash).toBeVisible()
  await expect(splash).toBeHidden({ timeout: 5000 })

  await expect(page.getByRole('heading', { name: /You’ve got this/ })).toBeVisible()

  await page.getByRole('button', { name: 'Great' }).click()
  await expect(page.getByText(/feeling great today/)).toBeVisible()

  const mainNav = page.getByRole('navigation', { name: 'Main' })
  await mainNav.getByRole('link', { name: 'Profile' }).click()
  await expect(page.getByText('Day streak').locator('..')).toContainText('1')
  await page.getByRole('button', { name: 'Add your name' }).click()
  await page.getByLabel('What should we call you?').fill('Sam')
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByRole('heading', { name: 'Sam' })).toBeVisible()

  await mainNav.getByRole('link', { name: 'Home' }).click()
  await expect(page.getByText(/, Sam$/)).toBeVisible()

  await mainNav.getByRole('link', { name: 'Calendar' }).click()
  await page.getByRole('button', { name: 'Add' }).click()
  await page.getByLabel('What is it?').fill('Therapy session')
  await page.getByRole('button', { name: 'Save appointment' }).click()
  await expect(page.getByRole('heading', { name: 'Therapy session' })).toBeVisible()

  await mainNav.getByRole('link', { name: 'Medication' }).click()
  await page.getByRole('button', { name: 'Add' }).click()
  await page.getByLabel('Medication name').fill('Vitamin D')
  await page.getByRole('button', { name: 'Save medication' }).click()
  await page.getByRole('button', { name: /^Vitamin D at .*: not taken$/ }).click()
  await expect(page.getByText(/All done for today/)).toBeVisible()

  // Reload: everything above is persisted on the device.
  await page.reload()
  await expect(page.getByRole('button', { name: /^Vitamin D at .*: taken$/ })).toBeVisible()

  await mainNav.getByRole('link', { name: 'Home' }).click()
  await page.getByRole('link', { name: 'See all' }).click()
  await page.getByRole('link', { name: /example data feature/ }).click()
  await expect(page.getByRole('heading', { name: 'mocked post' })).toBeVisible()
})
