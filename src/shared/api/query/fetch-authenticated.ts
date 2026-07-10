import { ApiError } from '~/shared/api/client'
import {
  resolveApiUserFacingError,
  type ApiUserFacingErrorMessages,
} from '~/shared/api/resolve-api-user-facing-error'

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof ApiError && error.code === 401
}

/**
 * 带 JWT 的请求统一入口：401 时调用 onUnauthorized（通常为 invalidateSession）。
 * 读路径用 `fetchAuthenticated`；写路径可用同名语义的 `authenticatedMutation`。
 */
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

/** JWT 写路径别名，与 fetchAuthenticated 同实现。 */
export async function authenticatedMutation<T>(
  token: string,
  mutate: (token: string) => Promise<T>,
  onUnauthorized: () => void,
): Promise<T> {
  return fetchAuthenticated(mutate, token, onUnauthorized)
}

/** 解析认证查询失败文案；永不返回后端 ApiError.message。 */
export function toQueryErrorMessage(
  error: unknown,
  messages: ApiUserFacingErrorMessages,
): string | null {
  if (!error) return null
  return resolveApiUserFacingError(error, messages) ?? messages.fallback
}
