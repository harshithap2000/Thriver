import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router'

import { emptyHealth, useProfileStore } from '@/features/profile'
import { useRecordsStore, type HealthRecord } from '@/features/records'
import { renderWithProviders } from '@/test/utils'

import { useRecoveryStore } from '../useRecoveryStore'
import { ClearanceForm } from './ClearanceForm'
import { RecoveryPhases } from './RecoveryPhases'

const renderMove = (route = '/move') =>
  renderWithProviders(
    <Routes>
      <Route path="/move" element={<RecoveryPhases />} />
      <Route path="/move/clearance/2" element={<ClearanceForm phase={2} />} />
      <Route path="/move/clearance/3" element={<ClearanceForm phase={3} />} />
    </Routes>,
    { route },
  )

describe('care-team clearance', () => {
  beforeEach(() => {
    useRecoveryStore.setState({ checkIns: {}, clearances: {}, planDone: {} })
    useProfileStore.setState({
      health: { ...emptyHealth, cancerType: 'breast', conditions: ['lymphoedema'] },
    })
  })

  it('unlocks the next phase when the person says their team told them', async () => {
    const user = userEvent.setup()
    renderMove()
    expect(screen.getByRole('listitem', { current: 'step' })).toHaveTextContent('Early recovery')
    await user.click(screen.getByRole('link', { name: 'Get cleared for Phase 2' }))

    await user.click(screen.getByRole('button', { name: /They told me in person/ }))
    await user.click(screen.getByRole('button', { name: 'Unlock Phase 2' }))
    expect(screen.getByRole('alert')).toHaveTextContent('who cleared you')

    await user.type(screen.getByLabelText('Who cleared you?'), 'Dr Rao')
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Unlock Phase 2' }))

    const current = screen.getByRole('listitem', { current: 'step' })
    expect(current).toHaveTextContent('Return to activity')
    expect(current).toHaveTextContent('lymphoedema-safe')
    expect(screen.getByText(/Cleared by Dr Rao/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Get cleared for Phase 3' })).toBeInTheDocument()
  })

  it('saves an uploaded signed note to Records', async () => {
    const user = userEvent.setup()
    const addRecord = vi.fn(async () => ({ id: 'rec-1' }) as HealthRecord)
    useRecordsStore.setState({ addRecord })
    useRecoveryStore.setState({
      clearances: { 2: { method: 'told', at: '2026-10-01T09:00:00Z', by: 'Dr Rao' } },
    })
    renderMove('/move/clearance/3')

    await user.click(screen.getByRole('button', { name: /Upload a signed note/ }))
    await user.type(screen.getByLabelText('Who cleared you?'), 'Asha, physio')
    await user.upload(
      screen.getByLabelText('Signed note'),
      new File(['%PDF'], 'note.pdf', { type: 'application/pdf' }),
    )
    await user.click(screen.getByRole('button', { name: 'Unlock Phase 3' }))

    expect(await screen.findByText(/Cleared by Asha, physio/)).toBeInTheDocument()
    expect(addRecord).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Clearance for recovery phase 3', category: 'letter' }),
      expect.any(File),
    )
    expect(useRecoveryStore.getState().clearances[3]).toMatchObject({
      method: 'note',
      recordId: 'rec-1',
    })
  })
})
