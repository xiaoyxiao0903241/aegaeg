/**
 * 资产页数据源是否回退到链上全表。
 *
 * 已登录且 API 可用时优先用会话 API（持仓分布 / 持仓汇总 / 奖励概览）；
 * 仅未登录或 API 尚未就绪时才回退到链上全量读取，保证未登录用户仍能
 * 看到仓位。钱包未连接时直接返回 false（无数据可展示）。
 *
 * @param args.walletReady 钱包已连接
 * @param args.hasAddress 已获得钱包地址
 * @param args.sessionReady 登录会话可用（API 数据源的前提）
 * @param args.apiPending API 请求进行中
 * @param args.apiReady API 数据已就绪
 * @returns 需要回退到链上全表时返回 true
 * @see docs/backend-api/api.md #assets/holdings-summary
 */
export function assetsHubNeedsChainFallback(args: {
  walletReady: boolean
  hasAddress: boolean
  sessionReady: boolean
  apiPending: boolean
  apiReady: boolean
}): boolean {
  const enabled = args.walletReady && args.hasAddress
  if (!enabled) return false
  if (!args.sessionReady) return true
  if (args.apiPending || args.apiReady) return false
  return true
}
