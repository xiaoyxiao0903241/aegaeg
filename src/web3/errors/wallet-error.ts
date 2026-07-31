import { WalletTransactionWaitError } from '~/web3/wallet/wait-wallet-transaction'
import { WalletSubmitUnknownError } from '~/web3/wallet/wallet-submit-unknown-error'
import { WALLET_BLOCKED, WALLET_WRITE_ERROR } from '~/web3/errors/sentinels'
import {
  type ErrorRule,
  readErrorCode,
  readErrorText,
  firstMatch,
  toErrorText,
} from '~/web3/errors/error-text'

const USER_REJECTED_PATTERN =
  /user rejected|action_rejected|request rejected|user denied|rejected the request|denied transaction signature/i

/** Wallet send/simulation failures — must surface in the app even when code is 4001. */
const WALLET_SEND_FAILURE_PATTERN =
  /transaction failed|interaction failed|likely to fail|execution reverted|cannot estimate gas|intrinsic gas too low|insufficient funds|not broadcast|reverted on-chain|wallet may have failed/i

const GAS_LIMIT_TOO_LOW_PATTERN =
  /gasLimit is too low|given 0|intrinsic gas too low|gas required exceeds allowance/i
const INSUFFICIENT_FUNDS_PATTERN =
  /insufficient funds for gas|insufficient funds|insufficient balance for transfer/i
const SIGNER_GAS_PATTERN = /signer error.*gas/i

export interface WalletTransactionErrorMessages {
  gasLimitTooLow: string
  gasEstimateFailed: string
  insufficientFunds: string
  transactionFailed: string
  /** Pending tx timed out without receipt — do not resubmit. */
  transactionUnknown?: string
}

const WALLET_TRANSACTION_ERROR_RULES: Array<ErrorRule<keyof WalletTransactionErrorMessages>> = [
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
export function walletTransactionError(
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
  if (error instanceof WalletSubmitUnknownError && messages.transactionUnknown) {
    return messages.transactionUnknown
  }
  const rawEarly = readErrorText(error)
  if (
    (rawEarly === WALLET_WRITE_ERROR.WRONG_CHAIN ||
      rawEarly === WALLET_WRITE_ERROR.INTENT_ADDRESS_MISMATCH ||
      rawEarly === WALLET_WRITE_ERROR.SUBMIT_UNKNOWN) &&
    messages.transactionUnknown
  ) {
    return messages.transactionUnknown
  }
  return firstMatch(toErrorText(rawEarly), WALLET_TRANSACTION_ERROR_RULES, messages)
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
  if (text === WALLET_BLOCKED.NOT_CONNECTED || /wallet not connected/i.test(text)) {
    return fallback
  }
  return fallback
}
