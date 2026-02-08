export type ActionResponse<T = unknown> = {
  data?: T
  error?: string
  success: boolean
}

export type ActionResult<T = unknown> = ActionResponse<T>
