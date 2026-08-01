import type { AppMessagesBundle } from '~/i18n/messages/app/types'
import { matchRevertMessage, matchSentinelMessage } from '~/web3/errors/error-messages'
import { readErrorText } from '~/web3/errors/error-text'
import { isUserRejectedWalletError, walletTransactionError } from '~/web3/errors/wallet-error'

/**
 * 链上写错误 → 用户文案（或 null 跳过 toast）。
 * 对照表 SSOT：`error-messages.ts`；调用方传入当前 i18n 包，禁自建各轨文案袋。
 */
export function getErrorMessage(error: unknown, t: AppMessagesBundle): string | null {
  if (error == null) return null
  if (isUserRejectedWalletError(error)) return null

  const raw = readErrorText(error)

  const fromSentinel = matchSentinelMessage(raw, t)
  if (fromSentinel) return fromSentinel

  const fromRevert = matchRevertMessage(error, raw, t)
  if (fromRevert) return fromRevert

  // 实例型钱包结果（unknown 收据 / 提交超时）。
  const fromWallet = walletTransactionError(error, t.wallet.transactionErrors)
  if (fromWallet) return fromWallet

  return t.errors.chain.fallback
}
