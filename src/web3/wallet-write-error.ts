import { isHex } from 'viem'

/** Flatten MetaMask / viem provider errors for UI. */
export function normalizeWalletRpcError(error: unknown): Error {
  if (error instanceof Error) {
    return error
  }

  if (typeof error === 'object' && error !== null) {
    const record = error as {
      code?: number | string
      message?: string
      data?: unknown
    }

    const nested =
      typeof record.data === 'object' && record.data !== null
        ? (record.data as { message?: string; originalError?: { message?: string } })
        : undefined

    const genericRpcMessage = /internal json-rpc error/i.test(record.message ?? '')
    const message =
      (!genericRpcMessage && record.message) ||
      nested?.message ||
      nested?.originalError?.message ||
      record.message ||
      'Wallet transaction failed'

    return Object.assign(new Error(message), {
      code: record.code,
      cause: error,
    })
  }

  return new Error(String(error))
}

export function assertWalletTransactionHash(hash: unknown): asserts hash is `0x${string}` {
  if (typeof hash !== 'string' || !isHex(hash) || hash.length !== 66) {
    throw new Error('Wallet returned an invalid transaction hash')
  }
}
