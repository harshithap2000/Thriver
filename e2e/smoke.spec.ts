import { expect, test } from '@playwright/test'

test('home loads, records a check-in and navigates via the tab bar', async ({ page }) => {
  test.setTimeout(60_000)

  await page.goto('/')
  const splash = page.getByRole('status', { name: 'Loading Thriver' })
  await expect(splash).toBeVisible()
  await expect(splash).toBeHidden({ timeout: 5000 })

  // Sign-up: new users go through onboarding first
  await expect(page).toHaveURL(/\/welcome$/)
  await page.getByRole('button', { name: 'Get started' }).click()
  await page.getByRole('textbox', { name: 'Your name' }).fill('Sam')
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('button', { name: 'Breast' }).click()
  await page.getByRole('button', { name: 'Surgery' }).click()
  await page.getByLabel(/Date of your/).fill('2026-09-23')
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('checkbox', { name: /lymphoedema/ }).check()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('button', { name: 'Finish' }).click()

  await expect(page.getByRole('heading', { name: /You’ve got this/ })).toBeVisible()

  // Home shows the recovery journey; the daily check-in saves symptoms and mood
  await expect(page.getByRole('heading', { name: 'Phase 1 · Early recovery' })).toBeVisible()
  await expect(page.getByText(/^Day \d+ since surgery$/)).toBeVisible()
  await page.getByRole('link', { name: 'Check in' }).click()
  await page.getByText('Great', { exact: true }).click()
  await expect(page.getByRole('radio', { name: 'Great' })).toBeChecked()
  await page.getByRole('button', { name: 'Save check-in' }).click()
  await expect(page.getByText('Thanks for checking in')).toBeVisible()

  const mainNav = page.getByRole('navigation', { name: 'Main' })
  await mainNav.getByRole('link', { name: 'Profile' }).click()
  await expect(page.getByText('Day streak').locator('..')).toContainText('1')
  await expect(page.getByRole('heading', { name: 'Sam' })).toBeVisible()
  await expect(page.getByRole('definition').filter({ hasText: /^Breast$/ })).toBeVisible()

  await mainNav.getByRole('link', { name: 'Home' }).click()
  await expect(page.getByText(/, Sam$/)).toBeVisible()

  await mainNav.getByRole('link', { name: 'Care' }).click()
  await page.getByRole('button', { name: 'Add' }).click()
  await page.getByLabel('What is it?').fill('Therapy session')
  await page.getByRole('button', { name: 'Save appointment' }).click()
  await expect(page.getByRole('heading', { name: 'Therapy session' })).toBeVisible()

  await page
    .getByRole('navigation', { name: 'Care sections' })
    .getByRole('link', { name: 'Medication' })
    .click()
  await page.getByRole('button', { name: 'Add' }).click()
  await page.getByLabel('Medication name').fill('Vitamin D')
  await page.getByRole('button', { name: 'Save medication' }).click()
  await page.getByRole('button', { name: /^Vitamin D at .*: not taken$/ }).click()
  await expect(page.getByText(/All done for today/)).toBeVisible()

  // Reload: everything above is persisted on the device.
  await page.reload()
  await expect(page.getByRole('button', { name: /^Vitamin D at .*: taken$/ })).toBeVisible()

  await mainNav.getByRole('link', { name: 'Home' }).click()
  await page.getByRole('link', { name: 'Reflect' }).click()
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
  // Move: unlock Phase 2 after the care team says so
  await page.getByRole('link', { name: 'Get cleared for Phase 2' }).click()
  await page.getByRole('button', { name: /They told me in person/ }).click()
  await page.getByLabel('Who cleared you?').fill('Dr Rao')
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Unlock Phase 2' }).click()
  await expect(page.getByRole('listitem').filter({ hasText: 'You are here' })).toContainText(
    'Return to activity',
  )
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

  // Care → Shop: medicine refills use the Medication list
  await mainNav.getByRole('link', { name: 'Care' }).click()
  await page
    .getByRole('navigation', { name: 'Care sections' })
    .getByRole('link', { name: 'Shop' })
    .click()
  await expect(page.getByRole('heading', { name: 'Picked for you' })).toBeVisible()
  await expect(
    page.getByRole('region', { name: 'Recovery essentials' }).getByRole('article').first(),
  ).toContainText('For you')
  await page.getByRole('button', { name: 'Medicine refills' }).click()
  await expect(page.getByRole('link', { name: /Vitamin D on Tata 1mg/ })).toBeVisible()

  // Learn: open a guide and save it
  await mainNav.getByRole('link', { name: 'Learn' }).click()
  await page
    .getByRole('link', { name: /^Lymphoedema: signs.*Chosen for your breast cancer/ })
    .click()
  await expect(page.getByRole('heading', { name: 'Questions to ask your doctor' })).toBeVisible()
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByRole('button', { name: 'Saved' })).toBeVisible()

  // Profile: recovery summary and privacy centre
  await mainNav.getByRole('link', { name: 'Profile' }).click()
  await page.getByRole('link', { name: /Recovery summary for your doctor/ }).click()
  await expect(page.getByRole('heading', { name: 'Recovery summary' })).toBeVisible()
  await expect(page.getByText(/Sam · Breast cancer/)).toBeVisible()
  await expect(page.getByRole('link', { name: 'Share on WhatsApp' })).toHaveAttribute(
    'href',
    /^https:\/\/wa\.me\/\?text=/,
  )
  await mainNav.getByRole('link', { name: 'Profile' }).click()
  await page.getByRole('link', { name: /Your privacy/ }).click()
  await expect(page.getByRole('heading', { name: 'Your consents' })).toBeVisible()

  // Records: save a PDF, then ask the assistant (Anthropic response mocked) about it
  await mainNav.getByRole('link', { name: 'Records' }).click()
  await page.getByRole('button', { name: 'Add' }).click()
  await page.getByLabel('Document or photo').setInputFiles({
    name: 'lipid-panel.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4 test document'),
  })
  await page.getByRole('button', { name: 'Save record' }).click()
  await page.getByRole('link', { name: /lipid panel/ }).click()
  await expect(page.getByRole('heading', { name: 'lipid panel' })).toBeVisible()

  let turn = 0
  let sentDocument = ''
  await page.route('**/api/records-assistant', async (route) => {
    const body = route.request().postDataJSON() as {
      messages: { content: unknown }[]
      catalog: { id: string }[]
    }
    turn++
    if (turn === 1) {
      return route.fulfill({
        json: {
          stop_reason: 'tool_use',
          content: [
            {
              type: 'tool_use',
              id: 't1',
              name: 'read_record',
              input: { record_id: body.catalog[0]!.id },
            },
          ],
        },
      })
    }
    const results = body.messages.at(-1)!.content as { content: { source?: { data: string } }[] }[]
    sentDocument = Buffer.from(results[0]!.content[1]!.source!.data, 'base64').toString()
    return route.fulfill({
      json: {
        stop_reason: 'end_turn',
        content: [{ type: 'text', text: 'Your lipid panel looks normal.' }],
      },
    })
  })
  await page.getByRole('link', { name: /Explain this record/ }).click()
  await page.getByRole('button', { name: 'I understand, continue' }).click()
  await page.getByRole('button', { name: 'Send' }).click()
  await expect(page.getByText('Your lipid panel looks normal.')).toBeVisible()
  expect(sentDocument).toBe('%PDF-1.4 test document')
})
