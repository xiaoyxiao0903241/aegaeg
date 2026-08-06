import { ApiError } from '~/shared/api/client'

/** 稳定的传输/客户端 `ApiError.error` 值——绝不把 `message` 直接展示给用户。 */
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

/** 判断错误是否为请求超时或被主动中止（AbortController / AbortSignal.timeout）。 */
export function isTimeoutError(error: unknown): boolean {
  if (typeof DOMException !== 'undefined' && error instanceof DOMException) {
    return error.name === 'TimeoutError' || error.name === 'AbortError'
  }
  if (error instanceof Error) {
    return error.name === 'TimeoutError' || error.name === 'AbortError'
  }
  return false
}

/** 把 fetch 失败包装为 ApiError，让 toast 路径只认 `ApiError.error` 码。 */
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

/**
 * 把 HTTP 状态与响应解析失败映射为稳定的传输错误码。
 *
 * 5xx 或 unavailable 归为不可用；其余按坏响应处理，避免把原始响应体上屏。
 *
 * @param status HTTP 状态码
 * @param kind 响应解析失败类型，默认 invalid_json
 * @returns 稳定的 ApiError
 */
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
 * 把 API / 传输失败映射为 i18n 文案，绝不返回 `ApiError.message`。
 * 当 `error` 不属于 API/传输失败时返回 null（链上错误由链上解析处理）。
 *
 * @param error 待映射的错误对象
 * @param messages 各场景文案表
 * @returns 面向用户的错误文案
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
