import { useLocation } from 'react-router'

import { ReceivedNote } from '@/features/family'

export default function FamilyNotePage() {
  const { hash } = useLocation()
  return <ReceivedNote payload={hash.replace(/^#/, '')} />
}
