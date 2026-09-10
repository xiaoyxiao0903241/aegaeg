import type { Wallet } from 'thirdweb/wallets'
import {
  createPublicClient,
  custom,
  type EIP1193Provider,
  fallback,
  http,
  type PublicClient,
  shouldThrow as viemFallbackShouldThrow,
} from 'viem'
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

/** 钱包 EIP-1193 无 timeout；挂死不会触发 viem fallback。 */
const WALLET_READ_RPC_TIMEOUT_MS = 8_000
export const WALLET_RPC_TIMEOUT_ERROR = 'WALLET_RPC_TIMEOUT'

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

/**
 * 给 EIP-1193 `request` 加墙钟。
 *
 * viem `custom()` 没有 timeout；钱包节点挂死时 Promise 永不 settle，fallback 不会切下一跳。
 * 超时错误不能带用户拒签 / revert 的 RPC code，否则 viem `shouldThrow` 会拦住、不切公共节点。
 */
export function eip1193WithTimeout(
  provider: EIP1193Provider,
  timeoutMs: number = WALLET_READ_RPC_TIMEOUT_MS,
): EIP1193Provider {
  const request = (args: { method: string; params?: unknown }) =>
    new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(WALLET_RPC_TIMEOUT_ERROR))
      }, timeoutMs)
      Promise.resolve(provider.request(args as never)).then(
        (value) => {
          clearTimeout(timer)
          resolve(value)
        },
        (err: unknown) => {
          clearTimeout(timer)
          reject(err)
        },
      )
    })
  return { request } as unknown as EIP1193Provider
}

function bscHttpReadTransports() {
  return bscReadRpcUrls(appEnv.bscRpcUrl, appEnv.bscRpcFallbackUrls).map((url) => http(url))
}

/**
 * 钱包读切公共节点时，哪些错误必须停在当前跳。
 *
 * viem 默认 `shouldThrow` 要求错误带数字 `code` 才认 revert；钱包插件常只丢 `execution reverted` 文案。
 * 无 code 的 revert 若放行，会把同一笔 eth_call 再打到公共节点。
 */
export function walletReadShouldThrow(error: Error): boolean {
  const message = typeof error.message === 'string' ? error.message : ''
  if (/execution reverted|gas required exceeds allowance/i.test(message)) return true
  return viemFallbackShouldThrow(error)
}

const publicBscReadClient = createPublicClient({
  chain: bsc,
  transport: fallback(bscHttpReadTransports()),
})

const walletReadClients = new WeakMap<Wallet, PublicClient>()

/** 当前连接钱包；是否走钱包 RPC 看 `shouldUseWalletReadRpc`。 */
let connectedReadWallet: Wallet | null = null

export function setConnectedReadWallet(wallet: Wallet | null): void {
  connectedReadWallet = wallet
}

/** OKX 注入钱包 id（EIP-6963 rdns）。 */
const OKX_WALLET_ID = 'com.okex.wallet'
/** OKX App 内置浏览器 UA（tronwallet-adapter / 各 DApp 通行写法）。 */
const OKX_IN_APP_UA = /OKApp/i
const MOBILE_UA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i

/**
 * OKX 是否改走公共 HTTP 读链。
 *
 * 桌面插件自带节点不可靠，运维打开开关后才改打 `VITE_BSC_RPC_URL`。
 * App 内置浏览器的注入就是钱包节点，不能当插件处理。
 *
 * @param args.enabled `VITE_OKX_DESKTOP_EXTENSION_PUBLIC_RPC`
 * @param args.walletId 钱包 id
 * @param args.userAgent 当前页 UA
 */
export function shouldForceOkxPublicReadRpc(args: {
  walletId: string | undefined
  enabled: boolean
  userAgent: string
}): boolean {
  if (!args.enabled) return false
  if (typeof args.walletId !== 'string' || args.walletId.toLowerCase() !== OKX_WALLET_ID) {
    return false
  }
  const ua = args.userAgent.trim()
  if (!ua || OKX_IN_APP_UA.test(ua) || MOBILE_UA.test(ua)) return false
  return true
}

/**
 * 读请求是否走钱包 EIP-1193。
 *
 * 未连接、没有账户、或当前链不是 BSC → 否（公共 HTTP）。
 * 仅当环境变量打开且当前是 PC 上的 OKX 插件 → 否（插件节点不可靠）。
 * 其余已连接 BSC（含 OKX App 内置浏览器）→ 是。异网钱包节点会把 eth_call 打到别的链，不能当 BSC 读。
 *
 * @param wallet 显式钱包；`undefined` 表示用已绑定的连接态
 */
export function shouldUseWalletReadRpc(wallet?: Wallet | null): boolean {
  const live = wallet === undefined ? connectedReadWallet : wallet
  if (!live?.getAccount() || live.getChain()?.id !== defaultChain.id) return false
  const userAgent =
    typeof navigator !== 'undefined' && typeof navigator.userAgent === 'string'
      ? navigator.userAgent
      : ''
  if (
    shouldForceOkxPublicReadRpc({
      walletId: typeof live.id === 'string' ? live.id : undefined,
      enabled: appEnv.okxDesktopExtensionPublicRpc,
      userAgent,
    })
  ) {
    return false
  }
  return true
}

/**
 * 钱包优先的只读客户端；同一钱包实例复用。
 *
 * 已连 BSC 时 eth_call 先打钱包 EIP-1193。超时或网络失败才切公共 HTTP（`VITE_BSC_RPC_URL` → env fallback → Binance dataseed）。
 * 合约 revert / 用户拒签不切下一跳。写交易仍走 `walletEip1193Provider`，不经本客户端。
 */
export function createWalletReadClient(wallet: Wallet): PublicClient {
  const cached = walletReadClients.get(wallet)
  if (cached) return cached
  const client = createPublicClient({
    chain: bsc,
    transport: fallback(
      [
        custom(eip1193WithTimeout(walletEip1193Provider(wallet)), { retryCount: 0 }),
        ...bscHttpReadTransports(),
      ],
      { retryCount: 0, shouldThrow: walletReadShouldThrow },
    ),
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
