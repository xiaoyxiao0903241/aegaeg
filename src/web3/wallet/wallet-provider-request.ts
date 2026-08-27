import type { EIP1193Provider } from 'viem'

import { normalizeWalletRpcError } from '~/web3/wallet/wallet-write-error'

/**
 * EIP-1193 请求：一直等到钱包返回或拒绝
 *
 * 必须 `bind(provider)` 再调。TokenPocket 等内置浏览器的 `request` 是旧 `sendAsync` 的壳，
 * 抽出未绑定函数会使 `this` 丢失，变成 `Cannot read properties of undefined (reading 'sendAsync')`。
 * 不设墙钟超时：`eth_sendTransaction` 底层仍可能已广播，超时假装失败会诱导再点。
 *
 * @param args.provider EIP-1193 provider
 * @param args.method 请求方法名
 * @param args.params 请求参数
 * @returns 请求结果
 * @see EIP-1193 Provider.request
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
    const request = provider.request.bind(provider) as (args: {
      method: string
      params?: unknown[]
    }) => Promise<T>
    return await request({ method, params })
  } catch (error) {
    throw normalizeWalletRpcError(error)
  }
}
