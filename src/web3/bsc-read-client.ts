import { createPublicClient, fallback, http } from 'viem'
import { bsc } from 'viem/chains'

import { appEnv } from '~/shared/config/env'

/** 主 RPC 之外的公共种子（去重后接在 env fallback 之后）。 */
const BSC_PUBLIC_RPC_FALLBACKS = [
  'https://bsc-dataseed1.binance.org',
  'https://bsc-dataseed2.binance.org',
  'https://bsc-dataseed3.binance.org',
] as const

/** 保序去重；单元测可直接调用。 */
export function uniqueRpcUrls(urls: readonly string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const url of urls) {
    const trimmed = url.trim()
    if (!trimmed) continue
    const key = trimmed.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(trimmed)
  }
  return out
}

/** 读链 HTTP 列表：主 URL → 可选 env fallback → 公共种子。 */
export function bscReadRpcUrls(
  primary: string,
  envFallbacks: readonly string[] = [],
  publicFallbacks: readonly string[] = BSC_PUBLIC_RPC_FALLBACKS,
): string[] {
  return uniqueRpcUrls([primary, ...envFallbacks, ...publicFallbacks])
}

/** 只读 BSC client — `fallback` 多 URL；写路径仍走钱包 EIP-1193。 */
export const bscReadClient = createPublicClient({
  chain: bsc,
  transport: fallback(
    bscReadRpcUrls(appEnv.bscRpcUrl, appEnv.bscRpcFallbackUrls).map((url) => http(url)),
  ),
})
