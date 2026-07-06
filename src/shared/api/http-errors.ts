import { ApiError } from '~/shared/api/client'

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof ApiError && error.code === 401
}
