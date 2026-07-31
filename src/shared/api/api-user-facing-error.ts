import { ApiError } from '~/shared/api/client'

/** Stable transport / client `ApiError.error` values — never show `message` to users. */
export const API_TRANSPORT_ERROR = {
  NETWORK: 'NETWORK',
  TIMEOUT: 'TIMEOUT',
  INVALID_JSON: 'INVALID_JSON',
  UNAVAILABLE: 'UNAVAILABLE',
  MISSING_DATA: 'MISSING_DATA',
} as const

export interface ApiUserFacingErrorMessages {
  network: string
  timeout: string
  unavailable: string
  badResponse: string
  fallback: string
}

export function isTimeoutError(error: unknown): boolean {
  if (typeof DOMException !== 'undefined' && error instanceof DOMException) {
    return error.name === 'TimeoutError' || error.name === 'AbortError'
  }
  if (error instanceof Error) {
    return error.name === 'TimeoutError' || error.name === 'AbortError'
  }
  return false
}

/** Wrap fetch failures so toast paths only see `ApiError.error` codes. */
export function toTransportApiError(error: unknown): ApiError {
  if (isTimeoutError(error)) {
    return new ApiError({
      code: 0,
      error: API_TRANSPORT_ERROR.TIMEOUT,
      message: 'Request timed out',
    })
  }
  return new ApiError({
    code: 0,
    error: API_TRANSPORT_ERROR.NETWORK,
    message: 'Network request failed',
  })
}

export function apiErrorFromHttpStatus(
  status: number,
  kind: 'invalid_json' | 'unavailable' = 'invalid_json',
): ApiError {
  if (status >= 500 || kind === 'unavailable') {
    return new ApiError({
      code: status,
      error: API_TRANSPORT_ERROR.UNAVAILABLE,
      message: `API unavailable (${status})`,
    })
  }
  return new ApiError({
    code: status,
    error: API_TRANSPORT_ERROR.INVALID_JSON,
    message: `API returned non-JSON response (${status})`,
  })
}

function asApiError(error: unknown): ApiError | null {
  if (error instanceof ApiError) return error
  if (
    error instanceof Error &&
    error.name === 'ApiError' &&
    'error' in error &&
    typeof (error as ApiError).error === 'string'
  ) {
    return error as ApiError
  }
  return null
}

function mapTransportCode(
  code: string,
  httpStatus: number,
  messages: ApiUserFacingErrorMessages,
): string {
  switch (code) {
    case API_TRANSPORT_ERROR.NETWORK:
      return messages.network
    case API_TRANSPORT_ERROR.TIMEOUT:
      return messages.timeout
    case API_TRANSPORT_ERROR.UNAVAILABLE:
      return messages.unavailable
    case API_TRANSPORT_ERROR.INVALID_JSON:
      return httpStatus >= 500 ? messages.unavailable : messages.badResponse
    case API_TRANSPORT_ERROR.MISSING_DATA:
      return messages.badResponse
    default:
      if (httpStatus >= 500) return messages.unavailable
      return messages.fallback
  }
}

/**
 * Map API / transport failures to i18n. Never returns `ApiError.message`.
 * Returns null when `error` is not an API/transport failure (chain resolvers handle those).
 */
export function apiUserFacingError(
  error: unknown,
  messages: ApiUserFacingErrorMessages,
): string | null {
  if (!error) return null

  if (isTimeoutError(error) && !(error instanceof ApiError)) {
    return messages.timeout
  }

  const apiError = asApiError(error)
  if (!apiError) {
    if (error instanceof TypeError) return messages.network
    return null
  }

  return mapTransportCode(apiError.error, apiError.code, messages)
}
