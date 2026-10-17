import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { useMedicationStore } from '@/features/medication'
import { renderWithProviders } from '@/test/utils'

import { essentials } from '../catalogue'
import { ShopHub } from './ShopHub'

describe('ShopHub', () => {
  beforeEach(() => useMedicationStore.setState({ medications: [], taken: {} }))

  it('lists recovery essentials linking out to stores in new tabs', () => {
    renderWithProviders(<ShopHub />)
    const section = screen.getByRole('region', { name: 'Recovery essentials' })

    expect(within(section).getAllByRole('article')).toHaveLength(essentials.length)
    const bra = within(section).getByRole('link', { name: /Find Post-surgery bra on Amazon/ })
    expect(bra).toHaveAttribute(
      'href',
      'https://www.amazon.in/s?k=post%20mastectomy%20bra%20front%20closure',
    )
    expect(bra).toHaveAttribute('target', '_blank')
    expect(bra).toHaveAttribute('rel', 'noopener noreferrer')
    expect(within(section).getAllByText('Ask your care team first').length).toBeGreaterThan(0)
  })

  it('offers refills for medicines from the Medication list at licensed pharmacies', async () => {
    const user = userEvent.setup()
    const { unmount } = renderWithProviders(<ShopHub />)
    await user.click(screen.getByRole('button', { name: 'Medicine refills' }))
    expect(screen.getByText(/to reorder them here/)).toBeInTheDocument()
    unmount()

    useMedicationStore
      .getState()
      .addMedication({ name: 'Tamoxifen', dosage: '20 mg', times: ['09:00'], notes: '' })
    renderWithProviders(<ShopHub />)
    await user.click(screen.getByRole('button', { name: 'Medicine refills' }))

    const refills = screen.getByRole('region', { name: 'Medicine refills' })
    expect(within(refills).getByText('Tamoxifen')).toBeInTheDocument()
    expect(within(refills).getByRole('link', { name: /Tamoxifen on Tata 1mg/ })).toHaveAttribute(
      'href',
      'https://www.1mg.com/search/all?name=Tamoxifen',
    )
    expect(within(refills).getByText(/valid prescription/)).toBeInTheDocument()
  })

  it('shows services with a mental health helpline', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ShopHub />)
    await user.click(screen.getByRole('button', { name: 'Services' }))

    expect(screen.getByRole('link', { name: 'Call 14416' })).toHaveAttribute('href', 'tel:14416')
    expect(screen.getAllByText('Booking through Thriver coming soon').length).toBeGreaterThan(0)
  })
})
