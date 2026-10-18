import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { emptyHealth, useProfileStore } from '@/features/profile'
import { renderWithProviders } from '@/test/utils'

import { LearnHub } from './LearnHub'

describe('Learn personalisation', () => {
  afterEach(() => useProfileStore.setState({ health: emptyHealth }))

  it('puts guides for my cancer first and hides ones for other cancers until asked', async () => {
    const user = userEvent.setup()
    useProfileStore.setState({
      health: {
        cancerType: 'colorectal',
        treatments: ['surgery'],
        surgeryDate: null,
        conditions: ['stoma'],
      },
    })
    renderWithProviders(<LearnHub />)

    expect(
      screen.getByText(/Personalised for your bowel \(colorectal\) cancer recovery/),
    ).toBeInTheDocument()
    const guides = screen.getAllByRole('listitem')
    expect(guides[0]).toHaveTextContent('Living with a stoma')
    expect(guides[0]).toHaveTextContent('For you')
    expect(screen.queryByText(/Recovering after breast surgery/)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /more guides? for other cancers/ }))
    expect(screen.getByText(/Recovering after breast surgery/)).toBeInTheDocument()
  })
})
