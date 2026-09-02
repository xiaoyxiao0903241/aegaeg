import { isHex } from 'viem'

/** 规整 MetaMask / viem 的 provider 错误为普通 Error（供 UI 展示）。 */
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

/**
 * 校验钱包返回的交易 hash
 *
 * 非 66 位 hex 一律视为钱包异常并抛错——hash 不可信时不能继续等回执。
 *
 * @param hash 钱包返回的 hash 值
 */
export function assertWalletTransactionHash(hash: unknown): asserts hash is `0x${string}` {
  if (typeof hash !== 'string' || !isHex(hash) || hash.length !== 66) {
    throw new Error('Wallet returned an invalid transaction hash')
  }
}
