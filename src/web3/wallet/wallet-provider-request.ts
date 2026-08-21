import type { EIP1193Provider } from 'viem'

import { normalizeWalletRpcError } from '~/web3/wallet/wallet-write-error'

/**
 * EIP-1193 请求：一直等到钱包返回或拒绝
 *
 * 不设墙钟超时。`eth_sendTransaction` 在底层仍可能已广播；超时假装失败会诱导再点。
 * 错误统一经 `normalizeWalletRpcError` 规整。
 *
 * @param args.provider EIP-1193 provider
 * @param args.method 请求方法名
 * @param args.params 请求参数
 * @returns 请求结果
 */
export async function walletProviderRequest<T>({
  provider,
  method,
  params,
}: {
  provider: EIP1193Provider
  method: string
  params?: unknown[]
}): Promise<T> {
  try {
    const request = provider.request as (args: { method: string; params?: unknown[] }) => Promise<T>
    return await request({ method, params })
  } catch (error) {
    throw normalizeWalletRpcError(error)
  }
}
