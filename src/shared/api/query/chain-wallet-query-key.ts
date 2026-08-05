import type { QueryKey } from '@tanstack/react-query'

/** 追加小写钱包地址——钱包作用域链上查询缓存键的统一实现。 */
export function chainWalletQueryKey(prefix: QueryKey, address: string): QueryKey {
  return [...prefix, address.toLowerCase()]
}
