import { ApiError } from '~/lib/api/client'

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof ApiError && error.code === 401
}
