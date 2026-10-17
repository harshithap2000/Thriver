import { useParams } from 'react-router'

import { GuideView } from '@/features/learn'

export default function GuidePage() {
  const { slug = '' } = useParams()
  return <GuideView key={slug} slug={slug} />
}
