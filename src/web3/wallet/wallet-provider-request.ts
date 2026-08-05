import type { EIP1193Provider } from 'viem'

import { normalizeWalletRpcError } from '~/web3/wallet/wallet-write-error'

const DEFAULT_WALLET_REQUEST_TIMEOUT_MS = 90_000

/**
 * EIP-1193 请求，带硬超时
 *
 * 钱包弹窗被关闭时不能让提交加载圈永远转下去，故设置超时并抛错误；
 * 错误统一经 `normalizeWalletRpcError` 规整。
 *
 * @param args.provider EIP-1193 provider
 * @param args.method 请求方法名
 * @param args.params 请求参数
 * @param args.timeoutMs 超时毫秒，默认 90 秒
 * @param args.timeoutMessage 超时错误文案
 * @returns 请求结果
 */
export async function walletProviderRequest<T>({
  provider,
  method,
  params,
  timeoutMs = DEFAULT_WALLET_REQUEST_TIMEOUT_MS,
  timeoutMessage = 'Wallet did not respond to the transaction request',
}: {
  provider: EIP1193Provider
  method: string
  params?: unknown[]
  timeoutMs?: number
  timeoutMessage?: string
}): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined

  try {
    const request = provider.request.bind(provider) as (args: {
      method: string
      params?: unknown[]
    }) => Promise<T>

    const result = await Promise.race([
      request({ method, params }),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
      }),
    ])

    return result
  } catch (error) {
    throw normalizeWalletRpcError(error)
  } finally {
    if (timer) clearTimeout(timer)
  }
}
