import { cn } from '@/shared/utils/cn'

/** Marks placeholder clinical content until Thriver's clinical advisers approve it. */
export function PendingReview({ label = 'Pending clinical review', className = '' }) {
  return (
    <span
      className={cn(
        'bg-reflect inline-block rounded-full px-2.5 py-1 text-xs font-bold text-[#8a5a00]',
        className,
      )}
    >
      ⚠ {label}
    </span>
  )
}

/** The reminder shown wherever health guidance appears. */
export function CareDisclaimer({ className = '' }) {
  return (
    <p className={cn('bg-mint text-ink rounded-2xl px-4 py-3 text-sm', className)}>
      ℹ️ <strong>Thriver supports your care; it doesn’t replace your doctor.</strong>
    </p>
  )
}
