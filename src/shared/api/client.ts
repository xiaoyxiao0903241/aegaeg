import { apiBaseUrl } from '~/shared/api/api-base-url'

export interface ApiEnvelope<T> {
  code: number
  data?: T
  error?: string
  message?: string
}

/** 后端信封或传输层失败的标准错误，供提示与分类逻辑使用。 */
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

/**
 * 解析 API 信封，成功时返回 data
 *
 * code 非 0 抛 ApiError；data 缺失抛 MISSING_DATA，
 * 防止上层误把 undefined 当正常结果。
 *
 * @param payload 后端信封
 * @returns 业务数据
 */
export function parseApiResponse<T>(payload: ApiEnvelope<T>): T {
  if (payload.code !== 0) {
    throw new ApiError(payload)
  }

  if (payload.data === undefined) {
    throw new ApiError({ code: payload.code, error: 'MISSING_DATA', message: 'Missing data' })
  }

  return payload.data
}

/** 构造 Bearer 认证请求头。 */
export function createAuthHeader(token: string): { Authorization: string } {
  return { Authorization: `Bearer ${token}` }
}

export interface ApiClient {
  urlFor: (path: string) => string
}

/** 基于基础地址构造 API 客户端；负责规范化路径与地址拼接。 */
export function createApiClient(options: { baseUrl: string }): ApiClient {
  const normalizedBase = options.baseUrl.replace(/\/$/, '')

  return {
    urlFor(path: string) {
      const normalizedPath = path.startsWith('/') ? path : `/${path}`
      return `${normalizedBase}${normalizedPath}`
    },
  }
}

/** 把 API 路径拼为完整 URL。 */
export function apiClientUrl(path: string): string {
  return createApiClient({ baseUrl: apiBaseUrl() }).urlFor(path)
}
