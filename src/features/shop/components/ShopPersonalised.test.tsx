import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { emptyHealth, useProfileStore } from '@/features/profile'
import { renderWithProviders } from '@/test/utils'

import { ShopHub } from './ShopHub'

describe('Shop personalisation', () => {
  afterEach(() => useProfileStore.setState({ health: emptyHealth }))

  it('shows items for my needs first and hides items for other cancers', async () => {
    const user = userEvent.setup()
    useProfileStore.setState({
      health: {
        cancerType: 'head-neck',
        treatments: ['radiotherapy'],
        surgeryDate: null,
        conditions: ['swallowing'],
      },
    })
    renderWithProviders(<ShopHub />)

    const essentials = screen.getByRole('region', { name: 'Recovery essentials' })
    expect(within(essentials).queryByText('Post-surgery bra')).not.toBeInTheDocument()
    const [first, second] = within(essentials).getAllByRole('article')
    // Both match radiotherapy; ties keep catalogue order.
    expect(first).toHaveTextContent('Soft caps, scarves & wigs')
    expect(second).toHaveTextContent('Gentle skin & scar care')
    expect(second).toHaveTextContent('For you')

    await user.click(screen.getByRole('button', { name: 'Food' }))
    const food = screen.getByRole('region', { name: 'Food' })
    expect(within(food).getAllByRole('article')[0]).toHaveTextContent('Soft, easy foods')
    expect(within(food).getAllByRole('article')[0]).toHaveTextContent('For you')

    await user.click(screen.getByRole('button', { name: 'Recovery essentials' }))
    await user.click(screen.getByRole('button', { name: /more for other needs/ }))
    expect(screen.getByText('Post-surgery bra')).toBeInTheDocument()
  })
})
