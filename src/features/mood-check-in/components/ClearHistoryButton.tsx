import { useMoodStore } from '../useMoodStore'

export function ClearHistoryButton({ className }: { className?: string }) {
  const hasHistory = useMoodStore((s) => Object.keys(s.checkIns).length > 0)
  const clearHistory = useMoodStore((s) => s.clearHistory)

  const handleClick = () => {
    if (window.confirm('Delete all your mood check-ins? This cannot be undone.')) clearHistory()
  }

  return (
    <button type="button" onClick={handleClick} disabled={!hasHistory} className={className}>
      Clear check-in history
    </button>
  )
}
