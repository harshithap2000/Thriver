import { isRouteErrorResponse, useRouteError } from 'react-router'

import { ErrorFallback } from '@/shared/ui/ErrorFallback'

export function RouteError() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Unknown error'

  return <ErrorFallback message={message} onReset={() => location.reload()} />
}
