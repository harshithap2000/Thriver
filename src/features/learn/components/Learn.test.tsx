import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderWithProviders } from '@/test/utils'

import { guides } from '../guides'
import { useSavedGuides } from '../useSavedGuides'
import { GuideView } from './GuideView'
import { LearnHub } from './LearnHub'

describe('Learn', () => {
  beforeEach(() => useSavedGuides.setState({ saved: [] }))

  it('lists guides, filters by topic and searches', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LearnHub />)

    expect(screen.getAllByRole('link')).toHaveLength(guides.length)

    await user.click(screen.getByRole('button', { name: /Food/ }))
    expect(screen.getByRole('link', { name: /Protein made simple/ })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Lymphoedema/ })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'All' }))
    await user.type(screen.getByRole('searchbox', { name: 'Search guides' }), 'lymph')
    expect(screen.getAllByRole('link')).toHaveLength(1)
    expect(screen.getByRole('link', { name: /Lymphoedema: signs/ })).toHaveAttribute(
      'href',
      '/learn/lymphoedema-signs',
    )

    expect(screen.getByText('Real stories, coming soon')).toBeInTheDocument()
  })

  it('shows a guide with review status, questions and sources, and saves it', async () => {
    const user = userEvent.setup()
    const { unmount } = renderWithProviders(<GuideView slug="lymphoedema-signs" />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Lymphoedema: signs to watch for' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Pending clinical review')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Questions to ask your doctor' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'NHS: Lymphoedema' })).toHaveAttribute(
      'target',
      '_blank',
    )

    await user.click(screen.getByRole('button', { name: 'Save' }))
    expect(screen.getByRole('button', { name: 'Saved' })).toHaveAttribute('aria-pressed', 'true')
    unmount()

    renderWithProviders(<LearnHub />)
    await user.click(screen.getByRole('button', { name: /Saved \(1\)/ }))
    expect(screen.getAllByRole('link')).toHaveLength(1)
  })

  it('handles unknown guides', () => {
    renderWithProviders(<GuideView slug="nope" />)
    expect(screen.getByText('Guide not found')).toBeInTheDocument()
  })
})
