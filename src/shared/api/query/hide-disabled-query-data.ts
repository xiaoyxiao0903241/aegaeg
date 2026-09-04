import type { UseQueryResult } from '@tanstack/react-query'

/**
 * 查询未启用时不把缓存或 placeholder 交给视图。
 *
 * TanStack Query 在 `enabled: false` 时仍返回已有 data；`keepPreviousData`
 * 还会在换键时把上一份数带到新键。水合完成后查询已关闭，视图应按没数处理。
 * 水合未完成时原样返回，避免把未登录空态刷进正在恢复的会话。
 *
 * @param query 原始 react-query 结果
 * @param args.enabled 本次是否允许查询
 * @param args.hasHydrated auth 持久化是否已水合
 * @returns 启用或未水合时原样返回；否则 data 为 undefined
 */
export function hideDisabledQueryData<TData, TError = Error>(
  query: UseQueryResult<TData, TError>,
  args: { enabled: boolean; hasHydrated: boolean },
): UseQueryResult<TData, TError> {
  if (!args.hasHydrated || args.enabled) return query
  // 成功态的 data 是 TData；这里故意改成没数，给视图用，不假装改 status。
  return {
    ...query,
    data: undefined,
    isPlaceholderData: false,
  } as UseQueryResult<TData, TError>
}
