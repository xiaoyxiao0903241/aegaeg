import {
  apiUserFacingError,
  type ApiUserFacingErrorMessages,
} from '~/shared/api/api-user-facing-error'
import { ApiError } from '~/shared/api/client'

function isUnauthorizedError(error: unknown): boolean {
  return error instanceof ApiError && error.code === 401
}

/**
 * 带会话的业务 API 请求：401 时调用 onUnauthorized（通常为 invalidateSession）。
 * 读、写共用此入口。
 */
export async function requestWithSession<T>(
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

/** 解析认证查询失败文案；永不返回后端 ApiError.message。 */
export function toQueryErrorMessage(
  error: unknown,
  messages: ApiUserFacingErrorMessages,
): string | null {
  if (!error) return null
  return apiUserFacingError(error, messages) ?? messages.fallback
}

/** 认证查询的 React Query `enabled` 判断——水合、会话、token 任一未就绪时不发起请求。 */
export function canRunAuthenticatedQuery({
  enabled = true,
  hasHydrated,
  sessionReady,
  hasToken,
}: {
  enabled?: boolean
  hasHydrated: boolean
  sessionReady: boolean
  hasToken: boolean
}): boolean {
  return enabled && hasHydrated && sessionReady && hasToken
}
