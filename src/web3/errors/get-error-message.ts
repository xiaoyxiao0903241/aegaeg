import type { AppMessagesBundle } from '~/i18n/messages/app/types'
import { matchRevertMessage, matchSentinelMessage } from '~/web3/errors/error-messages'
import { readErrorText } from '~/web3/errors/error-text'
import {
  isUserRejectedWalletError,
  resolveWalletTransactionError,
} from '~/web3/errors/wallet-error'

/**
 * Universal chain-write error → user message (or null to skip toast).
 * Table SSOT: `error-messages.ts` (sentinels + handbook∩legacy revert rules).
 * Call sites pass the active i18n bundle; do not rebuild per-rail message bags.
 */
export function getErrorMessage(error: unknown, t: AppMessagesBundle): string | null {
  if (error == null) return null
  if (isUserRejectedWalletError(error)) return null

  const raw = readErrorText(error)

  const fromSentinel = matchSentinelMessage(raw, t)
  if (fromSentinel) return fromSentinel

  const fromRevert = matchRevertMessage(error, raw, t)
  if (fromRevert) return fromRevert

  // Instance-typed wallet outcomes (unknown receipt / submit timeout).
  const fromWallet = resolveWalletTransactionError(error, t.wallet.transactionErrors)
  if (fromWallet) return fromWallet

  return t.errors.chain.fallback
}
