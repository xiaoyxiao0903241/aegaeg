import {
  SWAP_QUOTE_FAILED,
  SWAP_SUBMIT_GATE_FAILED,
  WALLET_GATE_ERROR,
} from '~/web3/errors/sentinels'
import { readErrorText } from '~/web3/errors/error-text'
import { resolveGenesisPurchaseError } from '~/web3/errors/genesis-purchase-error'
import {
  isUserRejectedWalletError,
  resolveWalletTransactionError,
  toWalletUserFacingMessage,
  type WalletTransactionErrorMessages,
} from '~/web3/errors/wallet-error'

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
    raw === WALLET_GATE_ERROR.NOT_CONNECTED ||
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
