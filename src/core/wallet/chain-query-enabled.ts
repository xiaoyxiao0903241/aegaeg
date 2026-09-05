/** 链上读取作用域：public 不注入地址；wallet 要地址。两者都要已登录且在 BSC。 */
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
 * 能写才读：业务已登录、auth 已水合、且当前链可写（BSC）。
 * wallet 作用域另外要地址。
 *
 * @param args.scope 读取作用域
 * @param args.enabled 调用方领域开关；缺省视为开启
 * @param args.address 钱包地址；wallet 作用域要求已连接
 * @param args.sessionReady 业务已登录（JWT；不含链）
 * @param args.hasHydrated auth 持久化已水合
 * @param args.writeReady 账户在 BSC，可发起写
 * @returns 是否允许发起链上读取
 * @see docs/ubiquitous-language.md
 */
export function chainQueryEnabled(args: {
  scope: ChainQueryScope
  enabled?: boolean
  address: string | undefined
  sessionReady: boolean
  hasHydrated: boolean
  writeReady: boolean
}): boolean {
  if (!(args.enabled ?? true)) return false
  if (!args.hasHydrated || !args.sessionReady || !args.writeReady) return false
  if (args.scope === 'wallet') return Boolean(args.address)
  return true
}
