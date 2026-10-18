/** An error with an HTTP status to return to the browser. */
export class AssistantRequestError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}
