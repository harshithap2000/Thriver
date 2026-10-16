import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { addDays, dateKey } from '@/shared/utils/date'

import { useAppointmentsStore } from '../useAppointmentsStore'
import { AppointmentsPlanner } from './AppointmentsPlanner'

describe('AppointmentsPlanner', () => {
  beforeEach(() => useAppointmentsStore.setState({ appointments: [] }))
  afterEach(() => vi.restoreAllMocks())

  it('adds an appointment to the selected day and marks it on the calendar', async () => {
    const user = userEvent.setup()
    render(<AppointmentsPlanner />)

    expect(screen.getByText('Nothing planned.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add' }))
    const form = screen.getByRole('form', { name: 'New appointment' })
    await user.type(within(form).getByLabelText('What is it?'), 'Therapy session')
    await user.type(within(form).getByLabelText('With'), 'Dr. Patel')
    await user.click(within(form).getByRole('button', { name: 'Save appointment' }))

    expect(screen.queryByRole('form')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Therapy session' })).toBeInTheDocument()
    expect(screen.getByText('Dr. Patel')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /, 1 appointment$/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('shows other days in Upcoming and deletes after confirmation', async () => {
    const user = userEvent.setup()
    const tomorrow = dateKey(addDays(new Date(), 1))
    useAppointmentsStore.getState().addAppointment({
      title: 'Blood test',
      withWhom: '',
      date: tomorrow,
      time: '08:30',
      location: 'City Lab',
      notes: '',
    })
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<AppointmentsPlanner />)

    const upcoming = screen.getByRole('region', { name: 'Upcoming' })
    expect(within(upcoming).getByText('City Lab')).toBeInTheDocument()

    await user.click(within(upcoming).getByRole('button', { name: 'Delete Blood test' }))

    expect(screen.queryByText('Blood test')).not.toBeInTheDocument()
    expect(useAppointmentsStore.getState().appointments).toEqual([])
  })

  it('navigates between months', async () => {
    const user = userEvent.setup()
    render(<AppointmentsPlanner />)
    const title = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' })
    const now = new Date()

    await user.click(screen.getByRole('button', { name: 'Next month' }))

    expect(
      screen.getByRole('heading', {
        name: title.format(new Date(now.getFullYear(), now.getMonth() + 1, 1)),
      }),
    ).toBeInTheDocument()
  })
})
