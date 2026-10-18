import { Link, useSearchParams } from 'react-router'

import { PickedForYou } from '@/features/ai-picks'
import { AppointmentsPlanner } from '@/features/appointments'
import { MedicationPlanner } from '@/features/medication'
import { ShopHub } from '@/features/shop'
import { cn } from '@/shared/utils/cn'

const views = [
  { id: 'appointments', label: 'Appointments' },
  { id: 'medication', label: 'Medication' },
  { id: 'shop', label: 'Shop' },
] as const

type View = (typeof views)[number]['id']

export default function CarePage() {
  const [params] = useSearchParams()
  const view: View = views.find((v) => v.id === params.get('view'))?.id ?? 'appointments'

  return (
    <div className="space-y-6">
      <nav aria-label="Care sections" className="flex rounded-2xl bg-white p-1 shadow-sm">
        {views.map((v) => (
          <Link
            key={v.id}
            to={`/care?view=${v.id}`}
            replace
            aria-current={view === v.id ? 'page' : undefined}
            className={cn(
              'flex-1 rounded-xl py-2.5 text-center text-sm font-bold transition-colors',
              view === v.id ? 'bg-mint text-pine' : 'text-ink-muted hover:text-ink',
            )}
          >
            {v.label}
          </Link>
        ))}
      </nav>
      {view === 'appointments' && <AppointmentsPlanner />}
      {view === 'medication' && <MedicationPlanner />}
      {view === 'shop' && <ShopHub picks={<PickedForYou kind="shop" />} />}
    </div>
  )
}
