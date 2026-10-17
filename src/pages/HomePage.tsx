import { FamilyHomeCard } from '@/features/family'
import {
  DailyQuoteCard,
  FocusCard,
  HomeHeader,
  QuickActions,
  RecommendedSection,
} from '@/features/home'
import { MoodCheckIn } from '@/features/mood-check-in'

export default function HomePage() {
  return (
    <div className="space-y-7">
      <HomeHeader />
      <DailyQuoteCard />
      <QuickActions />
      <FocusCard />
      <MoodCheckIn />
      <FamilyHomeCard />
      <RecommendedSection />
    </div>
  )
}
