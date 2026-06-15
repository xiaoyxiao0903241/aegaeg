const ERC20_INSUFFICIENT_BALANCE = '0xe450d38c'
const ERC20_INSUFFICIENT_ALLOWANCE = '0xfb8f41b2'

const USER_REJECTED_PATTERN =
  /user rejected|action_rejected|request rejected|user denied|rejected the request|transaction was rejected|denied transaction signature/i

export const GENESIS_PURCHASE_ERROR = {
  INSUFFICIENT_USD1: 'GENESIS_INSUFFICIENT_USD1',
  INSUFFICIENT_ALLOWANCE: 'GENESIS_INSUFFICIENT_ALLOWANCE',
  UNAVAILABLE: 'GENESIS_UNAVAILABLE',
  WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
} as const

function readErrorCode(error: unknown): number | string | undefined {
  if (typeof error !== 'object' || error === null) return undefined
  const coded = error as { code?: number | string }
  return coded.code
}

function readErrorText(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  if (typeof error !== 'object' || error === null) return String(error)

  const record = error as {
    message?: string
    shortMessage?: string
    reason?: string
    cause?: unknown
  }

  const parts = [record.message, record.shortMessage, record.reason]
  if (record.cause) parts.push(readErrorText(record.cause))
  return parts.filter(Boolean).join(' ')
}

export function isUserRejectedWalletError(error: unknown): boolean {
  if (!error) return false

  const code = readErrorCode(error)
  if (code === 4001 || code === '4001' || code === 'ACTION_REJECTED') {
    return true
  }

  if (typeof error === 'object' && error !== null && 'cause' in error) {
    const cause = (error as { cause?: unknown }).cause
    if (cause && isUserRejectedWalletError(cause)) return true
  }

  return USER_REJECTED_PATTERN.test(readErrorText(error))
}

export function toWalletUserFacingMessage(error: unknown, fallback = 'Transaction failed'): string | null {
  if (isUserRejectedWalletError(error)) return null
  const text = readErrorText(error).trim()
  return text || fallback
}

export function resolveContractErrorMessage(
  error: unknown,
  messages: {
    insufficientUsd1: string
    insufficientAllowance: string
  },
): string | null {
  if (isUserRejectedWalletError(error)) return null

  const raw = readErrorText(error)

  if (raw.includes(ERC20_INSUFFICIENT_BALANCE) || /ERC20InsufficientBalance/i.test(raw)) {
    return messages.insufficientUsd1
  }

  if (raw.includes(ERC20_INSUFFICIENT_ALLOWANCE) || /ERC20InsufficientAllowance/i.test(raw)) {
    return messages.insufficientAllowance
  }

  return raw || null
}

export function resolveGenesisPurchaseError(
  error: unknown,
  messages: {
    insufficientUsd1: string
    insufficientAllowance: string
    purchaseUnavailable: string
    walletNotConnected: string
  },
): string | null {
  if (isUserRejectedWalletError(error)) return null

  const raw = readErrorText(error)

  if (raw === GENESIS_PURCHASE_ERROR.INSUFFICIENT_USD1) {
    return messages.insufficientUsd1
  }

  if (raw === GENESIS_PURCHASE_ERROR.INSUFFICIENT_ALLOWANCE) {
    return messages.insufficientAllowance
  }

  if (raw === GENESIS_PURCHASE_ERROR.UNAVAILABLE) {
    return messages.purchaseUnavailable
  }

  if (raw === GENESIS_PURCHASE_ERROR.WALLET_NOT_CONNECTED) {
    return messages.walletNotConnected
  }

  return resolveContractErrorMessage(error, messages)
}
