import { resolveApiBaseUrl } from '~/lib/api/resolve-api-base-url'

export interface ApiEnvelope<T> {
  code: number
  data?: T
  error?: string
  message?: string
}

export class ApiError extends Error {
  readonly code: number
  readonly error: string

  constructor(payload: Pick<ApiEnvelope<unknown>, 'code' | 'error' | 'message'>) {
    super(payload.message ?? payload.error ?? 'API request failed')
    this.name = 'ApiError'
    this.code = payload.code
    this.error = payload.error ?? 'UNKNOWN_ERROR'
  }
}

export function parseApiResponse<T>(payload: ApiEnvelope<T>): T {
  if (payload.code !== 0) {
    throw new ApiError(payload)
  }

  if (payload.data === undefined) {
    throw new ApiError({ code: payload.code, error: 'MISSING_DATA', message: 'Missing data' })
  }

  return payload.data
}

export function createAuthHeader(token: string): { Authorization: string } {
  return { Authorization: `Bearer ${token}` }
}

export interface ApiClient {
  buildUrl: (path: string) => string
}

export function createApiClient(options: { baseUrl: string }): ApiClient {
  const normalizedBase = options.baseUrl.replace(/\/$/, '')

  return {
    buildUrl(path: string) {
      const normalizedPath = path.startsWith('/') ? path : `/${path}`
      return `${normalizedBase}${normalizedPath}`
    },
  }
}

export function getApiBaseUrl(): string {
  return resolveApiBaseUrl()
}

export function buildApiClientUrl(path: string): string {
  return createApiClient({ baseUrl: getApiBaseUrl() }).buildUrl(path)
}
