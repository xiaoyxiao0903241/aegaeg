import { type QueryKey, useQuery } from '@tanstack/react-query'

import { normalizeAuthAddress } from '~/core/auth/types'
import { useAuth } from '~/hooks/use-auth'
import { useI18n } from '~/i18n/use-i18n'
import type { ApiUserFacingErrorMessages } from '~/shared/api/api-user-facing-error'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import {
  canRunAuthenticatedQuery,
  requestWithSession,
  toQueryErrorMessage,
} from '~/shared/api/query/session-request'
import { useAuthStore } from '~/stores/auth-store'

/**
 * 带会话的 API 查询（本模块核心）
 *
 * 缓存键追加规范化钱包地址：JWT 续期不丢缓存，切换钱包自动隔离账号数据。
 * token 优先取状态仓库中的最新值，静默续期可立即用于下一次拉取。
 * 未登录、未水合或会话未就绪时不发起查询，避免匿名请求。
 */
export function useAuthenticatedQuery<T>(
  queryKey: QueryKey,
  fetcher: (token: string) => Promise<T>,
  enabled = true,
  options?: { keepPreviousData?: boolean },
) {
  const { token, invalidateSession, sessionReady, hasHydrated, session } = useAuth()
  const { messages: t } = useI18n()
  // 缓存键带钱包地址：JWT 续期不清缓存，切换钱包隔离数据
  const scopeKey = session?.address ? normalizeAuthAddress(session.address) : undefined

  const query = useQuery({
    queryKey: scopeKey ? [...queryKey, scopeKey] : queryKey,
    queryFn: () => {
      // 优先取状态仓库里的最新 token，静默续期后无需等重渲染即可用于拉取
      const latestToken = scopeKey
        ? (useAuthStore.getState().sessionsByAddress[scopeKey]?.token ?? token)
        : token
      if (!latestToken) {
        throw new Error('Authenticated query ran without a session token')
      }
      return requestWithSession(fetcher, latestToken, invalidateSession)
    },
    enabled: canRunAuthenticatedQuery({
      enabled,
      hasHydrated,
      sessionReady,
      hasToken: Boolean(token),
    }),
    staleTime: QUERY_STALE_TIME.api,
    placeholderData: options?.keepPreviousData
      ? (previousData, previousQuery) => {
          if (previousData == null || !scopeKey) return undefined
          if (previousQuery == null) return undefined
          const previousScope = previousQuery.queryKey.at(-1)
          if (previousScope !== scopeKey) return undefined
          return previousData
        }
      : undefined,
  })

  return toApiQueryView(query, t.errors.api)
}

/**
 * 把 react-query 结果归一化为面向视图的查询视图
 *
 * 未加载/未知统一映射为 null，错误转为面向用户的文案，另暴露 refresh 重新拉取。
 *
 * @param query 原始 react-query 结果
 * @param apiErrorMessages 各错误码对应的文案表
 * @returns 归一化视图：data/error/isLoading/refresh
 */
export function toApiQueryView<T>(
  query: {
    data: T | undefined
    error: unknown
    isLoading: boolean
    refetch: () => Promise<unknown>
  },
  apiErrorMessages: ApiUserFacingErrorMessages,
) {
  return {
    data: query.data ?? null,
    error: toQueryErrorMessage(query.error, apiErrorMessages),
    isLoading: query.isLoading,
    refresh: async () => {
      await query.refetch()
    },
  }
}
