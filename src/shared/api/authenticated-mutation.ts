import { fetchAuthenticated } from '~/shared/api/query/fetch-authenticated'

/**
 * 带 JWT 的写请求统一入口：401 时调用 onUnauthorized（通常为 invalidateSession）。
 * 与 fetchAuthenticated 读路径语义对齐。
 */
export async function authenticatedMutation<T>(
  token: string,
  mutate: (token: string) => Promise<T>,
  onUnauthorized: () => void,
): Promise<T> {
  return fetchAuthenticated(mutate, token, onUnauthorized)
}
