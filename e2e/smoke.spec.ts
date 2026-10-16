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

  await page
    .getByRole('navigation', { name: 'Main' })
    .getByRole('link', { name: 'Explore' })
    .click()
  await page.getByRole('link', { name: /example data feature/ }).click()
  await expect(page.getByRole('heading', { name: 'mocked post' })).toBeVisible()
})
