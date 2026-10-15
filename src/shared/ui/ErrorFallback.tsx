import { Button } from './Button'

interface ErrorFallbackProps {
  message: string
  onReset?: () => void
}

export function ErrorFallback({ message, onReset }: ErrorFallbackProps) {
  return (
    <div role="alert" className="mx-auto max-w-md p-8 text-center">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-slate-500">{message}</p>
      {onReset && (
        <Button className="mt-4" onClick={onReset}>
          Try again
        </Button>
      )}
    </div>
  )
}
