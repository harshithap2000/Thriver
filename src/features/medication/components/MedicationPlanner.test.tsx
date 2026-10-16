import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { useMedicationStore } from '../useMedicationStore'
import { MedicationPlanner } from './MedicationPlanner'

describe('MedicationPlanner', () => {
  beforeEach(() => useMedicationStore.setState({ medications: [], taken: {} }))
  afterEach(() => vi.restoreAllMocks())

  it('adds a medication with two daily times and tracks doses taken', async () => {
    const user = userEvent.setup()
    render(<MedicationPlanner />)

    await user.click(screen.getByRole('button', { name: 'Add' }))
    const form = screen.getByRole('form', { name: 'New medication' })
    await user.type(within(form).getByLabelText('Medication name'), 'Vitamin D')
    await user.type(within(form).getByLabelText('Dose'), '1000 IU')
    await user.click(within(form).getByRole('button', { name: 'Add another time' }))
    await user.click(within(form).getByRole('button', { name: 'Save medication' }))

    expect(screen.getByText('0 of 2 doses taken')).toBeInTheDocument()
    const doses = screen.getAllByRole('button', { name: /^Vitamin D at .*: not taken$/ })
    expect(doses).toHaveLength(2)

    await user.click(doses[0]!)
    expect(screen.getByText('1 of 2 doses taken')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1')

    await user.click(screen.getAllByRole('button', { name: /: not taken$/ })[0]!)
    expect(screen.getByText(/All done for today/)).toBeInTheDocument()

    // Tapping again un-marks the dose.
    await user.click(screen.getAllByRole('button', { name: /: taken$/ })[0]!)
    expect(screen.getByText('1 of 2 doses taken')).toBeInTheDocument()
  })

  it('removes a medication after confirmation', async () => {
    const user = userEvent.setup()
    useMedicationStore
      .getState()
      .addMedication({ name: 'Ibuprofen', dosage: '200 mg', times: ['09:00'], notes: '' })
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<MedicationPlanner />)

    await user.click(screen.getByRole('button', { name: 'Remove Ibuprofen' }))

    expect(screen.queryByText('Ibuprofen')).not.toBeInTheDocument()
    expect(screen.getByText(/Add a medication to see/)).toBeInTheDocument()
  })

  it('de-duplicates and sorts dose times', () => {
    useMedicationStore
      .getState()
      .addMedication({ name: 'X', dosage: '', times: ['20:00', '08:00', '20:00'], notes: '' })
    expect(useMedicationStore.getState().medications[0]?.times).toEqual(['08:00', '20:00'])
  })
})
