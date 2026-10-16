import { FocusCard, HomeHeader, QuickActions, RecommendedSection } from '@/features/home'
import { MoodCheckIn } from '@/features/mood-check-in'

export default function HomePage() {
  return (
    <div className="space-y-7">
      <HomeHeader />
      <QuickActions />
      <FocusCard />
      <MoodCheckIn />
      <RecommendedSection />
    </div>
  )
}
