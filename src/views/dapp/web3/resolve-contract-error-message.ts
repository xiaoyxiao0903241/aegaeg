import {
  ContractRevertError,
  decodeContractRevert,
} from '~/views/dapp/web3/decode-contract-revert'

const ERC20_INSUFFICIENT_BALANCE = '0xe450d38c'
const ERC20_INSUFFICIENT_ALLOWANCE = '0xfb8f41b2'

const USER_REJECTED_PATTERN =
  /user rejected|action_rejected|request rejected|user denied|rejected the request|denied transaction signature/i

/** Wallet send/simulation failures — must surface in the app even when code is 4001. */
const WALLET_SEND_FAILURE_PATTERN =
  /transaction failed|interaction failed|likely to fail|execution reverted|cannot estimate gas|intrinsic gas too low|insufficient funds|not broadcast|reverted on-chain|wallet may have failed/i

export const GENESIS_PURCHASE_ERROR = {
  INSUFFICIENT_USD1: 'GENESIS_INSUFFICIENT_USD1',
  INSUFFICIENT_ALLOWANCE: 'GENESIS_INSUFFICIENT_ALLOWANCE',
  UNAVAILABLE: 'GENESIS_UNAVAILABLE',
  WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
  NOT_BOUND: 'GENESIS_NOT_BOUND',
} as const

export const REFERRAL_BIND_ERROR = {
  INVALID_PARENT: 'REFERRAL_INVALID_PARENT',
  PARENT_NOT_BOUND: 'REFERRAL_PARENT_NOT_BOUND',
} as const

export const WALLET_WRITE_ERROR = {
  GAS_ESTIMATE_FAILED: 'WALLET_GAS_ESTIMATE_FAILED',
} as const

export interface WalletTransactionErrorMessages {
  gasLimitTooLow: string
  gasEstimateFailed: string
  insufficientFunds: string
  transactionFailed: string
}

const GAS_LIMIT_TOO_LOW_PATTERN =
  /gasLimit is too low|given 0|intrinsic gas too low|gas required exceeds allowance/i
const INSUFFICIENT_FUNDS_PATTERN =
  /insufficient funds for gas|insufficient funds|insufficient balance for transfer/i
const SIGNER_GAS_PATTERN = /signer error.*gas/i

/**
 * Map wallet / signer infrastructure failures (gas limit, estimate, BNB balance)
 * to localized copy. Call before domain-specific resolvers so raw English gas
 * strings are not shown to users.
 */
export function resolveWalletTransactionError(
  error: unknown,
  messages: WalletTransactionErrorMessages,
): string | null {
  if (isUserRejectedWalletError(error)) return null

  const raw = readErrorText(error)

  if (
    raw === WALLET_WRITE_ERROR.GAS_ESTIMATE_FAILED ||
    /Failed to estimate gas for transaction/i.test(raw)
  ) {
    return messages.gasEstimateFailed
  }

  if (
    GAS_LIMIT_TOO_LOW_PATTERN.test(raw) ||
    SIGNER_GAS_PATTERN.test(raw) ||
    (/gas/i.test(raw) && /too low|given 0/i.test(raw))
  ) {
    return messages.gasLimitTooLow
  }

  if (INSUFFICIENT_FUNDS_PATTERN.test(raw)) {
    return messages.insufficientFunds
  }

  return null
}

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
  // Reverts carry a 4-byte selector (ABI has no error defs to decode the name),
  // so match both the decoded name AND the on-chain selector (verified against
  // impl 0xf9f3…65a1). Order: most specific first.
  const s = raw.toLowerCase()
  const has = (sel: string) => s.includes(sel)

  if (/PreSaleUserPurchaseLimitExceeded/i.test(raw) || has('0x43f81a81')) {
    return messages.userLimitExceeded ?? null
  }
  if (/PreSaleUserNotBound/i.test(raw) || has('0x3bdd728c')) return messages.notBound ?? null
  if (/PreSalePhaseIndexOutOfBounds/i.test(raw) || has('0x71c4dee5')) return messages.invalidPhase ?? null
  if (/PreSalePhaseNotActive/i.test(raw) || has('0x9d024615')) return messages.phaseInactive ?? null
  if (/PreSalePhaseSoldOut/i.test(raw) || has('0x9e6594e8')) return messages.soldOut ?? null
  if (/PreSaleBelowMin/i.test(raw) || has('0x9468590f')) return messages.belowMin ?? null
  if (/PreSaleInvalidAmount/i.test(raw) || has('0x52d905be')) return messages.invalidAmount ?? null
  if (/PreSalePaused/i.test(raw) || has('0x307f3ea1')) return messages.paused ?? null
  if (
    /PreSale(ZeroAddress|InvalidDiscount|InvalidAirdropValueRatio|InvalidAgxPrice)/i.test(raw) ||
    has('0xf367a6ee') ||
    has('0xfa2d446e') ||
    has('0x84db0e97') ||
    has('0x76019f9f')
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

/** Walk wallet / viem error trees and collect revert selectors from nested `data` hex. */
function collectErrorFragments(error: unknown, depth = 0, seen = new WeakSet<object>()): string[] {
  if (depth > 8) return []
  if (error instanceof Error) {
    return [error.message, ...collectErrorFragments(error.cause, depth + 1, seen)]
  }
  if (typeof error === 'string') return [error]
  if (error == null) return []
  if (typeof error !== 'object') return [String(error)]
  if (seen.has(error)) return []
  seen.add(error)

  const record = error as Record<string, unknown>
  const parts: string[] = []

  for (const key of ['message', 'shortMessage', 'reason', 'details']) {
    const value = record[key]
    if (typeof value === 'string') parts.push(value)
  }

  if ('data' in record) {
    const data = record.data
    if (typeof data === 'string' && data.startsWith('0x')) {
      parts.push(data)
    } else if (typeof data === 'object' && data !== null) {
      parts.push(...collectErrorFragments(data, depth + 1, seen))
    }
  }

  if ('cause' in record) {
    parts.push(...collectErrorFragments(record.cause, depth + 1, seen))
  }

  return parts
}

function readErrorText(error: unknown): string {
  if (error instanceof ContractRevertError) {
    return [error.errorName, ...collectErrorFragments(error.cause)].filter(Boolean).join(' ')
  }

  const decoded = decodeContractRevert(error)
  const fragments = collectErrorFragments(error).filter(Boolean)
  if (decoded) {
    fragments.unshift(decoded.errorName)
  }
  return fragments.join(' ')
}

export function isUserRejectedWalletError(error: unknown): boolean {
  if (!error) return false

  const text = readErrorText(error)
  if (WALLET_SEND_FAILURE_PATTERN.test(text)) return false

  const code = readErrorCode(error)
  if (code === 4001 || code === '4001' || code === 'ACTION_REJECTED') {
    if (!text.trim()) return true
    if (USER_REJECTED_PATTERN.test(text)) return true
    // Some wallets reuse 4001 for failed sends; only treat explicit cancel copy as rejection.
    return false
  }

  if (typeof error === 'object' && error !== null && 'cause' in error) {
    const cause = (error as { cause?: unknown }).cause
    if (cause && isUserRejectedWalletError(cause)) return true
  }

  return USER_REJECTED_PATTERN.test(text)
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

/** Friendly i18n messages for the referral-bind flow (AegisReferral errors per contract.md §2.4). */
export interface ReferralBindErrorMessages {
  alreadyBound: string
  parentNotBound: string
  selfReferral: string
  invalidParent: string
  migratedAccount: string
  systemConfig: string
  failed: string
}

export function resolveReferralBindError(
  error: unknown,
  messages: ReferralBindErrorMessages,
): string | null {
  if (isUserRejectedWalletError(error)) return null

  const raw = readErrorText(error)
  const s = raw.toLowerCase()
  const has = (sel: string) => s.includes(sel)

  if (raw === REFERRAL_BIND_ERROR.INVALID_PARENT) return messages.invalidParent
  if (raw === REFERRAL_BIND_ERROR.PARENT_NOT_BOUND) return messages.parentNotBound

  // Match by decoded name OR on-chain selector (verified against impl 0xecb7…b629).
  if (/Referral__AlreadyBound|AlreadyBound/i.test(raw) || has('0xd242113b')) return messages.alreadyBound
  if (/Referral__ParentNotBound|ParentNotBound/i.test(raw) || has('0x3d50dfd5')) return messages.parentNotBound
  if (/Referral__SelfReferral|SelfReferral/i.test(raw) || has('0xa7e9b6d3')) return messages.selfReferral
  if (/Referral__MigratedAccount|MigratedAccount/i.test(raw) || has('0xc6dbe929')) return messages.migratedAccount
  if (/Referral__(ParentZero|UserZero)/i.test(raw) || has('0x841bf48a') || has('0x55bc9184')) {
    return messages.invalidParent
  }
  if (/Referral__(RootZero|NotMigrationManager)/i.test(raw) || has('0xc77b7954') || has('0x209f9827')) {
    return messages.systemConfig
  }
  return raw || messages.failed
}

/** Friendly i18n messages for the reward-claim flow (RewardClaimer errors + flow). */
export interface TeamClaimErrorMessages {
  zeroAmount: string
  invalidSigner: string
  alreadyUsed: string
  expired: string
  noOrder: string
  failed: string
}

/**
 * Map a team-reward claim failure (RewardClaimer custom errors per contract.md
 * §4.4, or the no-pending-order API case) to a friendly message.
 */
export function resolveTeamClaimError(
  error: unknown,
  messages: TeamClaimErrorMessages,
): string | null {
  if (isUserRejectedWalletError(error)) return null

  const raw = readErrorText(error)
  const code = readErrorCode(error)
  // RewardClaimer reverts with a 4-byte selector (our ABI has no error defs to
  // decode the name), so match both the decoded name AND the on-chain selector.
  const lower = raw.toLowerCase()

  if (/ErrorAlreadyUsed|AlreadyUsed|already.?(used|claimed)/i.test(raw) || lower.includes('0xd7003173')) {
    return messages.alreadyUsed
  }
  if (/ErrorSignatureExpired|SignatureExpired|expired/i.test(raw) || lower.includes('0x66e6698b')) {
    return messages.expired
  }
  if (/ErrorInvalidSigner|InvalidSigner|invalid.?sign/i.test(raw) || lower.includes('0xab3834a6')) {
    return messages.invalidSigner
  }
  if (/ErrorZeroAmount|ZeroAmount/i.test(raw) || lower.includes('0xc91787e4')) {
    return messages.zeroAmount
  }
  if (
    code === 404 ||
    /no\s*(team\s*)?reward|available\s*to\s*claim|no.?pending|未?待领取|无可领取|not\s*found/i.test(
      raw,
    )
  ) {
    return messages.noOrder
  }

  return raw || messages.failed
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

export function resolveFlashSwapUserMessage(
  error: unknown,
  messages: {
    walletNotConnected: string
    insufficientAllowance: string
    insufficientUsd1: string
    purchaseUnavailable: string
    transactionCancelled: string
  },
  walletTransactionErrors?: WalletTransactionErrorMessages,
): string | null {
  if (isUserRejectedWalletError(error)) {
    return messages.transactionCancelled
  }

  const raw = readErrorText(error)
  if (raw === GENESIS_PURCHASE_ERROR.WALLET_NOT_CONNECTED) return messages.walletNotConnected

  return (
    resolveGenesisPurchaseError(error, {
      insufficientAllowance: messages.insufficientAllowance,
      insufficientUsd1: messages.insufficientUsd1,
      purchaseUnavailable: messages.purchaseUnavailable,
      walletNotConnected: messages.walletNotConnected,
    }) ??
    (walletTransactionErrors
      ? resolveWalletTransactionError(error, walletTransactionErrors)
      : null) ??
    toWalletUserFacingMessage(
      error,
      walletTransactionErrors?.transactionFailed ?? 'Transaction failed',
    )
  )
}
