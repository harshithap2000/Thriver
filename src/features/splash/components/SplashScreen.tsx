import { cn } from '@/shared/utils/cn'

import { ScooterChick } from './ScooterChick'
import { ThriverLogo } from './ThriverLogo'

interface SplashScreenProps {
  /** When true the splash fades out (and stops intercepting clicks). */
  leaving?: boolean
  onSkip?: () => void
}

export function SplashScreen({ leaving = false, onSkip }: SplashScreenProps) {
  return (
    <div
      role="status"
      aria-label="Loading Thriver"
      className={cn(
        'bg-splash-bg fixed inset-0 z-50 flex flex-col items-center transition-opacity duration-500',
        leaving && 'pointer-events-none opacity-0',
      )}
    >
      {onSkip && (
        <button
          type="button"
          onClick={onSkip}
          aria-label="Skip intro"
          className="absolute inset-0 cursor-default focus:outline-none"
        />
      )}
      <div className="pointer-events-none relative flex flex-1 flex-col items-center justify-center gap-3">
        <ThriverLogo className="size-28 motion-safe:animate-[splash-rise_0.8s_ease-out_both]" />
        <p className="font-splash text-splash-ink text-5xl font-light tracking-wide motion-safe:animate-[splash-rise_0.8s_ease-out_0.15s_both]">
          Thriver
        </p>
      </div>
      <ScooterChick className="pointer-events-none relative mb-6 w-52 motion-safe:animate-[splash-drive-in_1s_ease-out_both]" />
    </div>
  )
}
