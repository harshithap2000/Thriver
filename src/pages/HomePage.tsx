import { FamilyHomeCard } from '@/features/family'
import { DailyQuoteCard, HomeHeader, QuickActions, RecommendedSection } from '@/features/home'
import { CheckInPrompt, RecoveryCard, TodaysPlan } from '@/features/recovery'

export default function HomePage() {
  return (
    <div className="space-y-7">
      <HomeHeader />
      <div className="space-y-4">
        <RecoveryCard />
        <CheckInPrompt />
      </div>
      <TodaysPlan />
      <DailyQuoteCard />
      <QuickActions />
      <FamilyHomeCard />
      <RecommendedSection />
    </div>
  )
}
