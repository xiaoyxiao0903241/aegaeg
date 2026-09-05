/** 链上读取作用域：public 公共数据；wallet 需要钱包地址。 */
export type ChainQueryScope = 'public' | 'wallet'

/**
 * 水合 / AutoConnect / 正在签名——此时不发请求、不刷未登录空态。
 */
export function isDappSessionPending(args: {
  hasHydrated: boolean
  isWalletConnecting: boolean
  isLoggingIn: boolean
}): boolean {
  return !args.hasHydrated || args.isWalletConnecting || args.isLoggingIn
}

/**
 * 链上读取的最终 enabled 判定。
 *
 * DApp 全 scope 都要业务已登录且 auth 已水合；wallet 另外要地址。
 *
 * @param args.scope 读取作用域
 * @param args.enabled 调用方领域开关；缺省视为开启
 * @param args.address 钱包地址；wallet 作用域要求已连接
 * @param args.sessionReady 业务已登录
 * @param args.hasHydrated auth 持久化已水合
 * @returns 是否允许发起链上读取
 */
export function chainQueryEnabled(args: {
  scope: ChainQueryScope
  enabled?: boolean
  address: string | undefined
  sessionReady: boolean
  hasHydrated: boolean
}): boolean {
  if (!(args.enabled ?? true)) return false
  if (!args.hasHydrated || !args.sessionReady) return false
  if (args.scope === 'wallet') return Boolean(args.address)
  return true
}
