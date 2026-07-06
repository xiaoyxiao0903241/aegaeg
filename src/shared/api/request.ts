import { interceptApiError } from '~/shared/api/account-banned'
import {
  ApiError,
  buildApiClientUrl,
  createAuthHeader,
  parseApiResponse,
  type ApiEnvelope,
} from '~/shared/api/client'

export { ApiError }

/** Abort hung requests so callers (and react-query retries) never wait forever. */
const REQUEST_TIMEOUT_MS = 20_000

/** Wallet in-app WebViews often ship Chrome < 124 — no AbortSignal.timeout(). */
function createRequestAbortSignal(timeoutMs: number): AbortSignal {
  if (typeof AbortSignal.timeout === 'function') {
    return AbortSignal.timeout(timeoutMs)
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  controller.signal.addEventListener('abort', () => clearTimeout(timer), { once: true })
  return controller.signal
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST'
  body?: unknown
  token?: string | null
  searchParams?: Record<string, string | number | undefined>
}

export function buildApiUrl(
  path: string,
  searchParams?: Record<string, string | number | undefined>,
): string {
  const url = new URL(buildApiClientUrl(path))

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    }
  }

  return url.toString()
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (options.token) {
    Object.assign(headers, createAuthHeader(options.token))
  }

  const response = await fetch(buildApiUrl(path, options.searchParams), {
    method: options.method ?? 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: createRequestAbortSignal(REQUEST_TIMEOUT_MS),
  })

  let payload: ApiEnvelope<T>

  try {
    payload = (await response.json()) as ApiEnvelope<T>
  } catch {
    throw new ApiError({
      code: response.status,
      error: 'INVALID_JSON',
      message: `API returned non-JSON response (${response.status})`,
    })
  }

  try {
    return parseApiResponse(payload)
  } catch (error) {
    interceptApiError(error)
    throw error
  }
}
