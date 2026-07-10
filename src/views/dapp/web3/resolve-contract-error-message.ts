import {
  ContractRevertError,
  decodeContractRevert,
} from '~/views/dapp/web3/decode-contract-revert'
import { WalletTransactionWaitError } from '~/views/dapp/web3/wait-wallet-transaction'

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

/** Local claim expire precheck — maps to claimErrors.expired. */
export const CLAIM_SIGNATURE_EXPIRED = 'ErrorSignatureExpired'

/** On-chain claim succeeded but `/claim/confirm` failed. */
export const CLAIM_CONFIRM_SYNC_FAILED = 'CLAIM_CONFIRM_SYNC_FAILED'

export const WALLET_WRITE_ERROR = {
  GAS_ESTIMATE_FAILED: 'WALLET_GAS_ESTIMATE_FAILED',
} as const

/** Quote RPC / router failure — map via i18n `errors.quoteFailed`. */
export const SWAP_QUOTE_FAILED = 'SWAP_QUOTE_FAILED'

/** Approve 后二次门闸失败（quote 过期等）— 与 quoteFailed 同文案。 */
export const SWAP_SUBMIT_GATE_FAILED = 'SWAP_SUBMIT_GATE_FAILED'

export interface WalletTransactionErrorMessages {
  gasLimitTooLow: string
  gasEstimateFailed: string
  insufficientFunds: string
  transactionFailed: string
  /** Pending tx timed out without receipt — do not resubmit. */
  transactionUnknown?: string
}

const GAS_LIMIT_TOO_LOW_PATTERN =
  /gasLimit is too low|given 0|intrinsic gas too low|gas required exceeds allowance/i
const INSUFFICIENT_FUNDS_PATTERN =
  /insufficient funds for gas|insufficient funds|insufficient balance for transfer/i
const SIGNER_GAS_PATTERN = /signer error.*gas/i

type ErrorText = { raw: string; lower: string }

type ErrorRule<K extends string> = {
  match: (text: ErrorText) => boolean
  messageKey: K
}

function toErrorText(raw: string): ErrorText {
  return { raw, lower: raw.toLowerCase() }
}

function hasSelector(lower: string, ...selectors: string[]): boolean {
  return selectors.some((selector) => lower.includes(selector))
}

function nameOrSelector(
  namePattern: RegExp,
  ...selectors: string[]
): (text: ErrorText) => boolean {
  return ({ raw, lower }) => namePattern.test(raw) || hasSelector(lower, ...selectors)
}

function resolveFirstMatch<M extends object, K extends keyof M & string>(
  text: ErrorText,
  rules: Array<ErrorRule<K>>,
  messages: M,
): string | null {
  for (const rule of rules) {
    if (!rule.match(text)) continue
    const message = messages[rule.messageKey]
    if (typeof message === 'string') return message
    return null
  }
  return null
}

const WALLET_TRANSACTION_ERROR_RULES: Array<
  ErrorRule<keyof WalletTransactionErrorMessages>
> = [
  {
    match: ({ raw }) =>
      raw === WALLET_WRITE_ERROR.GAS_ESTIMATE_FAILED ||
      /Failed to estimate gas for transaction/i.test(raw),
    messageKey: 'gasEstimateFailed',
  },
  {
    match: ({ raw }) =>
      GAS_LIMIT_TOO_LOW_PATTERN.test(raw) ||
      SIGNER_GAS_PATTERN.test(raw) ||
      (/gas/i.test(raw) && /too low|given 0/i.test(raw)),
    messageKey: 'gasLimitTooLow',
  },
  {
    match: ({ raw }) => INSUFFICIENT_FUNDS_PATTERN.test(raw),
    messageKey: 'insufficientFunds',
  },
]

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
  if (
    error instanceof WalletTransactionWaitError &&
    error.outcome === 'unknown' &&
    messages.transactionUnknown
  ) {
    return messages.transactionUnknown
  }
  return resolveFirstMatch(toErrorText(readErrorText(error)), WALLET_TRANSACTION_ERROR_RULES, messages)
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

const PRE_SALE_ERROR_RULES: Array<ErrorRule<keyof GenesisContractErrorMessages>> = [
  {
    match: nameOrSelector(/PreSaleUserPurchaseLimitExceeded/i, '0x43f81a81'),
    messageKey: 'userLimitExceeded',
  },
  {
    match: nameOrSelector(/PreSaleUserNotBound/i, '0x3bdd728c'),
    messageKey: 'notBound',
  },
  {
    match: nameOrSelector(/PreSalePhaseIndexOutOfBounds/i, '0x71c4dee5'),
    messageKey: 'invalidPhase',
  },
  {
    match: nameOrSelector(/PreSalePhaseNotActive/i, '0x9d024615'),
    messageKey: 'phaseInactive',
  },
  {
    match: nameOrSelector(/PreSalePhaseSoldOut/i, '0x9e6594e8'),
    messageKey: 'soldOut',
  },
  {
    match: nameOrSelector(/PreSaleBelowMin/i, '0x9468590f'),
    messageKey: 'belowMin',
  },
  {
    match: nameOrSelector(/PreSaleInvalidAmount/i, '0x52d905be'),
    messageKey: 'invalidAmount',
  },
  {
    match: nameOrSelector(/PreSalePaused/i, '0x307f3ea1'),
    messageKey: 'paused',
  },
  {
    match: ({ raw, lower }) =>
      /PreSale(ZeroAddress|InvalidDiscount|InvalidAirdropValueRatio|InvalidAgxPrice)/i.test(raw) ||
      hasSelector(lower, '0xf367a6ee', '0xfa2d446e', '0x84db0e97', '0x76019f9f'),
    messageKey: 'systemConfig',
  },
]

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

/**
 * Last-resort wallet toast copy. Never returns raw RPC / backend English —
 * callers must pass an i18n fallback (e.g. `errors.chain.fallback`).
 */
export function toWalletUserFacingMessage(error: unknown, fallback: string): string | null {
  if (isUserRejectedWalletError(error)) return null
  if (error == null) return null
  const text = readErrorText(error).trim()
  if (
    text === GENESIS_PURCHASE_ERROR.WALLET_NOT_CONNECTED ||
    /wallet not connected/i.test(text)
  ) {
    return fallback
  }
  return fallback
}

const ERC20_ERROR_RULES: Array<
  ErrorRule<'insufficientUsd1' | 'insufficientAllowance'>
> = [
  {
    match: ({ raw }) =>
      raw.includes(ERC20_INSUFFICIENT_BALANCE) || /ERC20InsufficientBalance/i.test(raw),
    messageKey: 'insufficientUsd1',
  },
  {
    match: ({ raw }) =>
      raw.includes(ERC20_INSUFFICIENT_ALLOWANCE) || /ERC20InsufficientAllowance/i.test(raw),
    messageKey: 'insufficientAllowance',
  },
]

export function resolveContractErrorMessage(
  error: unknown,
  messages: {
    insufficientUsd1: string
    insufficientAllowance: string
  },
): string | null {
  if (isUserRejectedWalletError(error)) return null

  const text = toErrorText(readErrorText(error))
  const mapped = resolveFirstMatch(text, ERC20_ERROR_RULES, messages)
  if (mapped) return mapped

  return null
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

const REFERRAL_BIND_ERROR_RULES: Array<ErrorRule<keyof ReferralBindErrorMessages>> = [
  {
    match: nameOrSelector(/Referral__AlreadyBound|AlreadyBound/i, '0xd242113b'),
    messageKey: 'alreadyBound',
  },
  {
    match: nameOrSelector(/Referral__ParentNotBound|ParentNotBound/i, '0x3d50dfd5'),
    messageKey: 'parentNotBound',
  },
  {
    match: nameOrSelector(/Referral__SelfReferral|SelfReferral/i, '0xa7e9b6d3'),
    messageKey: 'selfReferral',
  },
  {
    match: nameOrSelector(/Referral__MigratedAccount|MigratedAccount/i, '0xc6dbe929'),
    messageKey: 'migratedAccount',
  },
  {
    match: nameOrSelector(/Referral__(ParentZero|UserZero)/i, '0x841bf48a', '0x55bc9184'),
    messageKey: 'invalidParent',
  },
  {
    match: nameOrSelector(/Referral__(RootZero|NotMigrationManager)/i, '0xc77b7954', '0x209f9827'),
    messageKey: 'systemConfig',
  },
]

export function resolveReferralBindError(
  error: unknown,
  messages: ReferralBindErrorMessages,
): string | null {
  if (isUserRejectedWalletError(error)) return null

  const text = toErrorText(readErrorText(error))

  if (text.raw === REFERRAL_BIND_ERROR.INVALID_PARENT) return messages.invalidParent
  if (text.raw === REFERRAL_BIND_ERROR.PARENT_NOT_BOUND) return messages.parentNotBound

  const mapped = resolveFirstMatch(text, REFERRAL_BIND_ERROR_RULES, messages)
  if (mapped) return mapped

  return null
}

/** Friendly i18n messages for the reward-claim flow (RewardClaimer errors + flow). */
export interface TeamClaimErrorMessages {
  zeroAmount: string
  invalidSigner: string
  alreadyUsed: string
  expired: string
  noOrder: string
  failed: string
  /** On-chain claim succeeded; backend confirm failed. */
  confirmSyncFailed?: string
  walletNotConnected?: string
}

const TEAM_CLAIM_ERROR_RULES: Array<ErrorRule<keyof TeamClaimErrorMessages>> = [
  {
    match: nameOrSelector(/ErrorAlreadyUsed|AlreadyUsed|already.?(used|claimed)/i, '0xd7003173'),
    messageKey: 'alreadyUsed',
  },
  {
    match: nameOrSelector(/ErrorSignatureExpired|SignatureExpired|expired/i, '0x66e6698b'),
    messageKey: 'expired',
  },
  {
    match: nameOrSelector(/ErrorInvalidSigner|InvalidSigner|invalid.?sign/i, '0xab3834a6'),
    messageKey: 'invalidSigner',
  },
  {
    match: nameOrSelector(/ErrorZeroAmount|ZeroAmount/i, '0xc91787e4'),
    messageKey: 'zeroAmount',
  },
]

function isNoTeamClaimOrder(error: unknown, raw: string): boolean {
  const code = readErrorCode(error)
  return (
    code === 404 ||
    /no\s*(team\s*)?reward|available\s*to\s*claim|no.?pending|未?待领取|无可领取|not\s*found/i.test(
      raw,
    )
  )
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

  const text = toErrorText(readErrorText(error))

  if (text.raw === CLAIM_CONFIRM_SYNC_FAILED && messages.confirmSyncFailed) {
    return messages.confirmSyncFailed
  }

  const mapped = resolveFirstMatch(text, TEAM_CLAIM_ERROR_RULES, messages)
  if (mapped) return mapped

  if (
    text.raw === GENESIS_PURCHASE_ERROR.WALLET_NOT_CONNECTED ||
    /please connect wallet/i.test(text.raw)
  ) {
    return messages.walletNotConnected ?? messages.failed
  }

  if (isNoTeamClaimOrder(error, text.raw)) return messages.noOrder

  return messages.failed
}

const GENESIS_PURCHASE_SENTINEL_RULES: Array<{
  sentinel: string
  messageKey: keyof GenesisContractErrorMessages | 'insufficientUsd1' | 'insufficientAllowance' | 'purchaseUnavailable' | 'walletNotConnected'
}> = [
  { sentinel: GENESIS_PURCHASE_ERROR.INSUFFICIENT_USD1, messageKey: 'insufficientUsd1' },
  { sentinel: GENESIS_PURCHASE_ERROR.INSUFFICIENT_ALLOWANCE, messageKey: 'insufficientAllowance' },
  { sentinel: GENESIS_PURCHASE_ERROR.UNAVAILABLE, messageKey: 'purchaseUnavailable' },
  { sentinel: GENESIS_PURCHASE_ERROR.WALLET_NOT_CONNECTED, messageKey: 'walletNotConnected' },
  { sentinel: GENESIS_PURCHASE_ERROR.NOT_BOUND, messageKey: 'notBound' },
]

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

  const text = toErrorText(readErrorText(error))

  for (const rule of GENESIS_PURCHASE_SENTINEL_RULES) {
    if (text.raw !== rule.sentinel) continue
    const message = messages[rule.messageKey]
    return message ?? null
  }

  const contractMessage = resolveFirstMatch(text, PRE_SALE_ERROR_RULES, messages)
  if (contractMessage) return contractMessage

  return resolveContractErrorMessage(error, messages)
}

export function resolveSwapUserFacingMessage(
  error: unknown,
  messages: {
    walletNotConnected: string
    insufficientAllowance: string
    insufficientUsd1: string
    purchaseUnavailable: string
    transactionCancelled: string
    quoteFailed?: string
  },
  walletTransactionErrors?: WalletTransactionErrorMessages,
  chainFallback?: string,
): string | null {
  if (isUserRejectedWalletError(error)) {
    return messages.transactionCancelled
  }

  const raw = readErrorText(error)
  if (
    (raw === SWAP_QUOTE_FAILED || raw === SWAP_SUBMIT_GATE_FAILED) &&
    messages.quoteFailed
  ) {
    return messages.quoteFailed
  }
  if (
    raw === GENESIS_PURCHASE_ERROR.WALLET_NOT_CONNECTED ||
    /wallet not connected/i.test(raw)
  ) {
    return messages.walletNotConnected
  }

  const fallback =
    chainFallback ??
    walletTransactionErrors?.transactionFailed ??
    messages.purchaseUnavailable

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
    toWalletUserFacingMessage(error, fallback)
  )
}

/** @deprecated Use `resolveSwapUserFacingMessage` — same Trade/Flash toast chain. */
export const resolveFlashSwapUserMessage = resolveSwapUserFacingMessage
