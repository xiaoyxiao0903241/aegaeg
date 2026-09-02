/** 链上读取作用域：public 公共数据；wallet 需要钱包地址。 */
export type ChainQueryScope = 'public' | 'wallet'

/**
 * 链上读取的最终 enabled 判定。
 *
 * 调用方领域 enabled 与钱包作用域同时满足才开启读取。
 *
 * @param args.scope 读取作用域
 * @param args.enabled 调用方领域开关；缺省视为开启
 * @param args.address 钱包地址；wallet 作用域要求已连接
 * @returns 是否允许发起链上读取
 */
export function chainQueryEnabled(args: {
  scope: ChainQueryScope
  enabled?: boolean
  address: string | undefined
}): boolean {
  if (!(args.enabled ?? true)) return false
  if (args.scope === 'wallet') return Boolean(args.address)
  return true
}
