import { expect, test } from '@playwright/test'

test('home page loads and navigates to posts', async ({ page }) => {
  await page.route('**/posts?_limit=10', (route) =>
    route.fulfill({ json: [{ id: 1, userId: 1, title: 'mocked post', body: 'From e2e' }] }),
  )

  await page.goto('/')
  const splash = page.getByRole('status', { name: 'Loading Thriver' })
  await expect(splash).toBeVisible()
  await expect(splash).toBeHidden({ timeout: 5000 })

  await expect(page.getByRole('heading', { name: 'Welcome to Thriver' })).toBeVisible()

  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Posts' }).click()
  await expect(page.getByRole('heading', { name: 'mocked post' })).toBeVisible()
})
