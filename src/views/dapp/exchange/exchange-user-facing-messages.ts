import type { Messages } from '~/i18n/messages'

/** Common i18n bag for `resolveExchangeUserFacingMessage` across exchange rails. */
export function exchangeUserFacingMessages(t: Messages) {
  return {
    walletNotConnected: t.genesis.walletNotConnected,
    insufficientAllowance: t.genesis.insufficientAllowance,
    insufficientUsd1: t.genesis.insufficientUsd1,
    purchaseUnavailable: t.genesis.purchaseUnavailable,
    transactionCancelled: t.exchange.transactionCancelled,
    quoteFailed: t.errors.quoteFailed,
  }
}
