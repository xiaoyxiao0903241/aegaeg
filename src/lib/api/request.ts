import {
  apiClient,
  ApiError,
  createAuthHeader,
  parseApiResponse,
  type ApiEnvelope,
} from '~/lib/api/client'

export { ApiError }

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
  const url = new URL(apiClient.buildUrl(path))

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

  return parseApiResponse(payload)
}
