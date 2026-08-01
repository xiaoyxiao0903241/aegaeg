import type { EIP1193Provider } from 'viem'

import { normalizeWalletRpcError } from '~/web3/wallet/wallet-write-error'

const DEFAULT_WALLET_REQUEST_TIMEOUT_MS = 90_000

/**
 * EIP-1193 request with a hard timeout so a dismissed wallet modal cannot leave
 * the DApp submit spinner running forever.
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
