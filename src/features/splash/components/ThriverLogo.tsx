import logoUrl from '../assets/thriver-logo.png'

/** The Thriver mark: white cross with leaves, on a transparent background. */
export function ThriverLogo({ className }: { className?: string }) {
  // Decorative: the "Thriver" wordmark next to it carries the name.
  return <img src={logoUrl} alt="" width={254} height={254} className={className} />
}
