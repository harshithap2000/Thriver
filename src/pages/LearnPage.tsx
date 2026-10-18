import { PickedForYou } from '@/features/ai-picks'
import { LearnHub } from '@/features/learn'

export default function LearnPage() {
  return <LearnHub picks={<PickedForYou kind="learn" />} />
}
