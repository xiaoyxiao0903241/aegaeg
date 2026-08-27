import type { Wallet } from 'thirdweb/wallets'
import { createPublicClient, custom, fallback, http, type PublicClient } from 'viem'
import { bsc } from 'viem/chains'

import { appEnv } from '~/shared/config/env'
import { defaultChain } from '~/web3/thirdweb'
import { walletEip1193Provider } from '~/web3/wallet/wallet-eip1193-provider'

/** 主 RPC 之外的公共种子（去重后接在 env fallback 之后）。 */
const BSC_PUBLIC_RPC_FALLBACKS = [
  'https://bsc-dataseed1.binance.org',
  'https://bsc-dataseed2.binance.org',
  'https://bsc-dataseed3.binance.org',
] as const

/** 保序去重。 */
function uniqueRpcUrls(urls: readonly string[]): string[] {
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

const publicBscReadClient = createPublicClient({
  chain: bsc,
  transport: fallback(
    bscReadRpcUrls(appEnv.bscRpcUrl, appEnv.bscRpcFallbackUrls).map((url) => http(url)),
  ),
})

const walletReadClients = new WeakMap<Wallet, PublicClient>()

/** 当前连接钱包；是否走钱包 RPC 看 `shouldUseWalletReadRpc`。 */
let connectedReadWallet: Wallet | null = null

export function setConnectedReadWallet(wallet: Wallet | null): void {
  connectedReadWallet = wallet
}

/** OKX 注入钱包 id（EIP-6963 rdns）；其节点不适合当 BSC 只读 RPC。 */
const OKX_WALLET_ID = 'com.okex.wallet'

function isOkxWallet(wallet: Wallet): boolean {
  const id = typeof wallet.id === 'string' ? wallet.id.toLowerCase() : ''
  return id === OKX_WALLET_ID
}

/**
 * 读请求是否走钱包 EIP-1193。
 *
 * 未连接、没有账户、或当前链不是 BSC → 否（公共 HTTP）。
 * OKX → 否（钱包节点不可靠，读走公共 RPC）。
 * 其余已连接 BSC → 是。异网钱包节点会把 eth_call 打到别的链，不能当 BSC 读。
 *
 * @param wallet 显式钱包；`undefined` 表示用已绑定的连接态
 */
export function shouldUseWalletReadRpc(wallet?: Wallet | null): boolean {
  const live = wallet === undefined ? connectedReadWallet : wallet
  if (!live?.getAccount() || live.getChain()?.id !== defaultChain.id) return false
  if (isOkxWallet(live)) return false
  return true
}

/** 钱包节点只读客户端；同一钱包实例复用。 */
export function createWalletReadClient(wallet: Wallet): PublicClient {
  const cached = walletReadClients.get(wallet)
  if (cached) return cached
  const client = createPublicClient({
    chain: bsc,
    transport: custom(walletEip1193Provider(wallet)),
  })
  walletReadClients.set(wallet, client)
  return client
}

/**
 * 当前 BSC 只读客户端。
 *
 * @param wallet 显式钱包；省略则用已绑定的连接
 */
export function chainReadClient(wallet?: Wallet | null): PublicClient {
  const live = wallet === undefined ? connectedReadWallet : wallet
  if (!live || !shouldUseWalletReadRpc(live)) return publicBscReadClient
  return createWalletReadClient(live)
}

/** 仅单测替换默认读客户端；测完必须传回 `null`。 */
let testReadClient: PublicClient | null = null

export function setBscReadClientForTest(client: PublicClient | null): void {
  testReadClient = client
}

/** 默认只读客户端：每次取方法时再选公共节点或钱包节点。 */
export const bscReadClient: PublicClient = new Proxy(publicBscReadClient, {
  get(_target, prop) {
    const client = testReadClient ?? chainReadClient()
    const value = Reflect.get(client, prop, client)
    return typeof value === 'function'
      ? (value as (...args: unknown[]) => unknown).bind(client)
      : value
  },
})
