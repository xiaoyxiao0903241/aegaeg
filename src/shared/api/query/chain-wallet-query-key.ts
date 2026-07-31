import type { QueryKey } from '@tanstack/react-query'

/** Append lowercased wallet address — SSOT for wallet-scoped chain query keys. */
export function chainWalletQueryKey(prefix: QueryKey, address: string): QueryKey {
  return [...prefix, address.toLowerCase()]
}
