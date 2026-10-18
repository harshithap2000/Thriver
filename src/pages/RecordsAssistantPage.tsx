import { cancerLabel, conditions, useProfileStore } from '@/features/profile'
import { AssistantChat } from '@/features/records'
import { daysSince, phaseInfo, useCurrentPhase } from '@/features/recovery'

export default function RecordsAssistantPage() {
  const health = useProfileStore((s) => s.health)
  const phase = phaseInfo(useCurrentPhase())
  const cancer = cancerLabel(health.cancerType)
  const days = daysSince(health.surgeryDate)

  const label = [
    cancer && `${cancer} cancer`,
    days !== null && `Day ${days} after surgery`,
    `Phase ${phase.id}`,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <AssistantChat
      profile={{
        label,
        context: {
          cancerType: cancer,
          treatments: health.treatments,
          conditions: conditions
            .filter((c) => health.conditions.includes(c.id))
            .map((c) => c.label),
          daysSinceSurgery: days,
          phase: `${phase.id} · ${phase.name}`,
        },
      }}
    />
  )
}
