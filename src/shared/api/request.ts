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

/** 中止挂起的请求，让调用方（以及 react-query 重试）不会无限等待。 */
const REQUEST_TIMEOUT_MS = 20_000

/** 钱包内置 WebView 常带 Chrome < 124——没有 AbortSignal.timeout()。 */
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
   * 默认 POST——与 DApp 业务 API 的约定一致（见 endpoints.ts）。
   * 仅在极少数非信封探测时传 GET；不要省略并默认它是 GET。
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
    // 网关 HTML / 空响应体——按 HTTP 状态映射，保证 401/403 仍触发认证与封禁钩子
    rethrowAfterIntercept(apiErrorFromHttpStatus(response.status))
  }

  try {
    return parseApiResponse(payload)
  } catch (error) {
    rethrowAfterIntercept(error)
  }
}
