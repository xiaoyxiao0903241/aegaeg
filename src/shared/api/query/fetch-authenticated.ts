import { ApiError } from '~/shared/api/client'
import { isUnauthorizedError } from '~/shared/api/http-errors'
import {
  resolveApiUserFacingError,
  type ApiUserFacingErrorMessages,
} from '~/shared/api/resolve-api-user-facing-error'

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

    throw new Error('Request failed', { cause: error })
  }
}

/**
 * Resolve authenticated-query failures for UI. Requires i18n `errors.api` messages.
 * Never returns backend `ApiError.message`.
 */
export function toQueryErrorMessage(
  error: unknown,
  messages: ApiUserFacingErrorMessages,
): string | null {
  if (!error) return null
  return resolveApiUserFacingError(error, messages) ?? messages.fallback
}
