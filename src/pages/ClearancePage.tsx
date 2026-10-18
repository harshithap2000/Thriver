import { useParams } from 'react-router'

import { ClearanceForm, type PhaseId } from '@/features/recovery'

import NotFoundPage from './NotFoundPage'

export default function ClearancePage() {
  const phase = Number(useParams().phase)
  if (![2, 3, 4].includes(phase)) return <NotFoundPage />
  return <ClearanceForm key={phase} phase={phase as PhaseId} />
}
