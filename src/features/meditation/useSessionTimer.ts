import { useEffect, useRef, useState } from 'react'

/**
 * Counts up to `totalSeconds`, measured from timestamps so it stays accurate even when the
 * browser throttles timers in a background tab. Calls `onComplete` once when time is up.
 */
export function useSessionTimer(totalSeconds: number, onComplete: () => void) {
  const [startedAt, setStartedAt] = useState<number | null>(() => Date.now())
  const [banked, setBanked] = useState(0) // ms elapsed before the latest resume
  const [now, setNow] = useState(() => Date.now())

  const elapsedMs = banked + (startedAt === null ? 0 : now - startedAt)
  const elapsed = Math.min(totalSeconds, Math.floor(elapsedMs / 1000))
  const isDone = elapsed >= totalSeconds
  const isRunning = startedAt !== null && !isDone

  useEffect(() => {
    if (!isRunning) return
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [isRunning])

  const completed = useRef(false)
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  })
  useEffect(() => {
    if (isDone && !completed.current) {
      completed.current = true
      onCompleteRef.current()
    }
  }, [isDone])

  const pause = () => {
    if (startedAt === null) return
    const t = Date.now()
    setBanked((b) => b + t - startedAt)
    setStartedAt(null)
    setNow(t)
  }

  const resume = () => {
    const t = Date.now()
    setStartedAt(t)
    setNow(t)
  }

  return { elapsed, remaining: totalSeconds - elapsed, isRunning, isDone, pause, resume }
}
