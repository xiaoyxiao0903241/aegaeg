const ERC20_INSUFFICIENT_BALANCE = '0xe450d38c'
const ERC20_INSUFFICIENT_ALLOWANCE = '0xfb8f41b2'

const USER_REJECTED_PATTERN =
  /user rejected|action_rejected|request rejected|user denied|rejected the request|transaction was rejected|denied transaction signature/i

export const GENESIS_PURCHASE_ERROR = {
  INSUFFICIENT_USD1: 'GENESIS_INSUFFICIENT_USD1',
  INSUFFICIENT_ALLOWANCE: 'GENESIS_INSUFFICIENT_ALLOWANCE',
  UNAVAILABLE: 'GENESIS_UNAVAILABLE',
  WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
  NOT_BOUND: 'GENESIS_NOT_BOUND',
} as const

/**
 * Friendly i18n messages for the PreSale contract's custom errors. All optional
 * so callers that don't surface PreSale errors (e.g. swap) can omit them.
 */
export interface GenesisContractErrorMessages {
  notBound?: string
  paused?: string
  invalidAmount?: string
  phaseInactive?: string
  belowMin?: string
  soldOut?: string
  userLimitExceeded?: string
  invalidPhase?: string
  systemConfig?: string
}

/**
 * Map a PreSale custom error (by name, as decoded into the revert text) to a
 * friendly message. Returns null when no documented error name is present or
 * the caller did not provide a message for it.
 */
function matchPreSaleContractError(
  raw: string,
  messages: GenesisContractErrorMessages,
): string | null {
  // Order: most specific names first to avoid prefix collisions.
  if (/PreSaleUserPurchaseLimitExceeded/i.test(raw)) return messages.userLimitExceeded ?? null
  if (/PreSaleUserNotBound/i.test(raw)) return messages.notBound ?? null
  if (/PreSalePhaseIndexOutOfBounds/i.test(raw)) return messages.invalidPhase ?? null
  if (/PreSalePhaseNotActive/i.test(raw)) return messages.phaseInactive ?? null
  if (/PreSalePhaseSoldOut/i.test(raw)) return messages.soldOut ?? null
  if (/PreSaleBelowMin/i.test(raw)) return messages.belowMin ?? null
  if (/PreSaleInvalidAmount/i.test(raw)) return messages.invalidAmount ?? null
  if (/PreSalePaused/i.test(raw)) return messages.paused ?? null
  if (
    /PreSale(ZeroAddress|InvalidDiscount|InvalidAirdropValueRatio|InvalidAgxPrice)/i.test(raw)
  ) {
    return messages.systemConfig ?? null
  }
  return null
}

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
  } & GenesisContractErrorMessages,
): string | null {
  if (isUserRejectedWalletError(error)) return null

  const raw = readErrorText(error)

  // App-level sentinels thrown by the purchase flow before sending the tx.
  if (raw === GENESIS_PURCHASE_ERROR.INSUFFICIENT_USD1) return messages.insufficientUsd1
  if (raw === GENESIS_PURCHASE_ERROR.INSUFFICIENT_ALLOWANCE) return messages.insufficientAllowance
  if (raw === GENESIS_PURCHASE_ERROR.UNAVAILABLE) return messages.purchaseUnavailable
  if (raw === GENESIS_PURCHASE_ERROR.WALLET_NOT_CONNECTED) return messages.walletNotConnected
  if (raw === GENESIS_PURCHASE_ERROR.NOT_BOUND) return messages.notBound ?? null

  // PreSale custom contract errors (when decoded into the revert text).
  const contractMessage = matchPreSaleContractError(raw, messages)
  if (contractMessage) return contractMessage

  return resolveContractErrorMessage(error, messages)
}
