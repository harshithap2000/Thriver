import { Component, type ErrorInfo, type ReactNode } from 'react'

import { ErrorFallback } from '@/shared/ui/ErrorFallback'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

/** Last line of defence for errors thrown outside the router (route errors use RouteError). */
export class AppErrorBoundary extends Component<Props, State> {
  override state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    // Hook up an error reporting service (e.g. Sentry) here.
    console.error(error, info.componentStack)
  }

  override render() {
    if (this.state.error) {
      return <ErrorFallback message={this.state.error.message} onReset={() => location.reload()} />
    }
    return this.props.children
  }
}
