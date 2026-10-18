import { screen } from '@testing-library/react'

import { emptyHealth, useProfileStore, type HealthProfile } from '@/features/profile'
import { renderWithProviders } from '@/test/utils'

import { useAiPicksStore } from '../useAiPicksStore'
import { PickedForYou } from './PickedForYou'

const breast: HealthProfile = {
  cancerType: 'breast',
  treatments: ['surgery'],
  surgeryDate: '2026-09-23',
  conditions: ['lymphoedema'],
}
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

describe('PickedForYou', () => {
  beforeEach(() => {
    useAiPicksStore.setState({ key: null, picks: null })
    useProfileStore.setState({ health: breast, aiPersonalise: false })
  })
  afterEach(() => vi.restoreAllMocks())

  it('invites people without a profile to add one', () => {
    useProfileStore.setState({ health: emptyHealth })
    renderWithProviders(<PickedForYou kind="learn" />)
    expect(screen.getByRole('link', { name: /Get picks for your recovery/ })).toHaveAttribute(
      'href',
      '/profile/health',
    )
  })

  it('uses profile-based picks when AI is off, without calling the AI', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    renderWithProviders(<PickedForYou kind="learn" />)

    expect(screen.getByText('Based on your profile')).toBeInTheDocument()
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveTextContent('Lymphoedema: signs to watch for')
    expect(screen.getAllByText('Chosen for your breast cancer recovery.').length).toBeGreaterThan(0)
    expect(screen.queryByText(/Living with a stoma/)).not.toBeInTheDocument()
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('shows AI picks with reasons when AI is on, sending no name', async () => {
    useProfileStore.setState({ aiPersonalise: true, name: 'Asha' })
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      json({
        learn: [
          { id: 'why-movement-helps', reason: 'Gentle movement can ease tiredness as you heal.' },
        ],
        shop: [{ id: 'post-surgery-bra', reason: 'Soft support for your healing scar.' }],
      }),
    )
    renderWithProviders(<PickedForYou kind="shop" />)

    expect(screen.getByRole('status')).toHaveTextContent('Finding the most useful picks')
    expect(await screen.findByText('Soft support for your healing scar.')).toBeInTheDocument()
    expect(screen.getByText('By Thriver AI')).toBeInTheDocument()

    const sent = JSON.parse(fetchSpy.mock.calls[0]![1]!.body as string)
    expect(sent.health).toMatchObject({ cancerType: 'breast', conditions: ['lymphoedema'] })
    expect(JSON.stringify(sent)).not.toContain('Asha')
    expect(sent.candidates.some((c: { id: string }) => c.id === 'ostomy')).toBe(false)
  })

  it('falls back to profile picks if the AI is unavailable', async () => {
    useProfileStore.setState({ aiPersonalise: true })
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(json({ error: 'not configured' }, 503))
    renderWithProviders(<PickedForYou kind="learn" />)

    expect(await screen.findByText('Based on your profile')).toBeInTheDocument()
  })
})
