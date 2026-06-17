import { ApiError } from '~/lib/api/client'
import { isUnauthorizedError } from '~/lib/api/auth/login-with-wallet'

export async function fetchAuthenticated<T>(
  fetcher: (token: string) => Promise<T>,
  token: string,
  onUnauthorized: () => void,
): Promise<T> {
  try {
    return await fetcher(token)
  } catch (error) {
    if (isUnauthorizedError(error)) {
      onUnauthorized()
    }

    if (error instanceof ApiError) {
      throw error
    }

    if (error instanceof Error) {
      throw error
    }

    throw new Error('Request failed')
  }
}

export function toQueryErrorMessage(error: unknown): string | null {
  if (!error) return null
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return 'Request failed'
}
