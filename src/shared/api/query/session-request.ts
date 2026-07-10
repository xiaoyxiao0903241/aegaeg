import { ApiError } from '~/shared/api/client'
import {
  resolveApiUserFacingError,
  type ApiUserFacingErrorMessages,
} from '~/shared/api/resolve-api-user-facing-error'

export function isUnauthorizedError(error: unknown): boolean {
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
  return resolveApiUserFacingError(error, messages) ?? messages.fallback
}

/** Authenticated React Query `enabled` gate — fail-closed until hydrated + session + token. */
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
