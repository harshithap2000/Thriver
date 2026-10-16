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

  await mainNav.getByRole('link', { name: 'Journal' }).click()
  await page.getByRole('button', { name: 'Write freely' }).click()
  await page.getByRole('textbox').fill('Felt calm after my walk.')
  await page.getByRole('button', { name: 'Save entry' }).click()
  await expect(page.getByRole('region', { name: 'Today' })).toContainText(
    'Felt calm after my walk.',
  )

  await mainNav.getByRole('link', { name: 'Home' }).click()
  await page.getByRole('link', { name: 'Play 5-Minute Mindful Breathing' }).click()
  await expect(page.getByText('Breathe in')).toBeVisible()
  await expect(page.getByText('Breathe out')).toBeVisible({ timeout: 6000 })
  await page.getByRole('button', { name: 'End' }).click()
  await expect(page.getByRole('heading', { name: 'Sessions' })).toBeVisible()

  await mainNav.getByRole('link', { name: 'Home' }).click()
  await page.getByRole('link', { name: 'Games' }).click()
  await expect(page.getByRole('link', { name: /^Wordle:/ })).toHaveAttribute(
    'href',
    'https://www.nytimes.com/games/wordle/index.html',
  )

  // Move: log a walk
  await mainNav.getByRole('link', { name: 'Home' }).click()
  await page.getByRole('link', { name: 'Move' }).click()
  await page.getByRole('button', { name: '30 min' }).click()
  await page.getByRole('button', { name: 'Log activity' }).click()
  await expect(page.getByText('Goal reached!')).toBeVisible()

  // Family: write a note as a relative, then open its link as the user
  await page.goto('/family/write?for=Sam')
  await page.getByLabel('Your name').fill('Mum')
  await page.getByLabel('Your message for Sam').fill('Proud of you! 🌻')
  await page.getByRole('button', { name: 'Create link to send' }).click()
  const noteUrl = await page.getByRole('textbox', { name: 'Link' }).inputValue()
  await page.goto(noteUrl)
  await page.getByRole('button', { name: 'Save to my notes' }).click()
  await page.getByRole('link', { name: 'See all notes' }).click()
  await expect(page.getByText('Proud of you! 🌻')).toBeVisible()
  await mainNav.getByRole('link', { name: 'Home' }).click()
  await expect(page.getByRole('link', { name: /^Note from Mum/ })).toBeVisible()

  await page.goto('/posts')
  await expect(page.getByRole('heading', { name: 'mocked post' })).toBeVisible()
})
