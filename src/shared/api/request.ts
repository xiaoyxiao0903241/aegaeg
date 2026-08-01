import { interceptApiError } from '~/shared/api/account-banned'
import { apiErrorFromHttpStatus, toTransportApiError } from '~/shared/api/api-user-facing-error'
import {
  apiClientUrl,
  type ApiEnvelope,
  ApiError,
  createAuthHeader,
  parseApiResponse,
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
  /**
   * Defaults to POST — matches DApp business API SSOT (see endpoints.ts).
   * Pass GET only for rare non-envelope probes; never omit and expect GET.
   */
  method?: 'GET' | 'POST'
  body?: unknown
  token?: string | null
  searchParams?: Record<string, string | number | undefined>
}

export function apiUrl(
  path: string,
  searchParams?: Record<string, string | number | undefined>,
): string {
  const url = new URL(apiClientUrl(path))

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    }
  }

  return url.toString()
}

function rethrowAfterIntercept(error: unknown): never {
  interceptApiError(error)
  throw error
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (options.token) {
    Object.assign(headers, createAuthHeader(options.token))
  }

  let response: Response
  try {
    response = await fetch(apiUrl(path, options.searchParams), {
      method: options.method ?? 'POST',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: createRequestAbortSignal(REQUEST_TIMEOUT_MS),
    })
  } catch (error) {
    rethrowAfterIntercept(toTransportApiError(error))
  }

  let payload: ApiEnvelope<T>

  try {
    payload = (await response.json()) as ApiEnvelope<T>
  } catch {
    // Gateway HTML / empty body — map HTTP status so 401/403 still hit auth + ban hooks.
    rethrowAfterIntercept(apiErrorFromHttpStatus(response.status))
  }

  try {
    return parseApiResponse(payload)
  } catch (error) {
    rethrowAfterIntercept(error)
  }
}
