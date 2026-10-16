import { useParams } from 'react-router'

import { RecordDetail } from '@/features/records'

export default function RecordDetailPage() {
  const { id = '' } = useParams()
  return <RecordDetail key={id} id={id} />
}
