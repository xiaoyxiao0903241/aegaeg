import { readErrorCode, readErrorText } from '~/web3/errors/error-text'
import { WALLET_BLOCKED, WALLET_WRITE_ERROR } from '~/web3/errors/sentinels'
import { WalletTransactionWaitError } from '~/web3/wallet/wait-wallet-transaction'
import { WalletSubmitUnknownError } from '~/web3/wallet/wallet-submit-unknown-error'

const USER_REJECTED_PATTERN =
  /user rejected|action_rejected|request rejected|user denied|rejected the request|denied transaction signature/i

/** 钱包发送 / 模拟失败：即使错误码是 4001 也必须展示给用户。 */
const WALLET_SEND_FAILURE_PATTERN =
  /transaction failed|interaction failed|likely to fail|execution reverted|cannot estimate gas|intrinsic gas too low|insufficient funds|not broadcast|reverted on-chain|wallet may have failed/i

export interface WalletTransactionErrorMessages {
  gasLimitTooLow: string
  gasEstimateFailed: string
  insufficientFunds: string
  transactionFailed: string
  /** pending 交易超时无收据——确认前不得重提。 */
  transactionUnknown?: string
}

/**
 * 仅处理「实例型」钱包结果
 *
 * 覆盖未知收据 / 提交超时 / 写阻断哨兵；
 * gas 与余额不足等字符串规则在 `error-messages.ts` 的 revert 表，
 * 不在本函数重复。
 *
 * @param error 待判断的错误
 * @param messages 钱包交易文案包
 * @returns 对应文案；无法归为实例型结果时返回 null
 * @see 手册 §19 常见错误与前端提示
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
  return null
}

/**
 * 判断钱包错误是否表示用户主动拒绝交易。
 *
 * 部分钱包会把发送失败错误码也设为 4001，因此出现失败文案时优先按失败处理，
 * 只有明确拒绝文案才算用户拒绝。
 *
 * @param error 待判断的错误
 * @returns 用户拒绝时为 true
 * @see 手册 §19 常见错误与前端提示
 */
export function isUserRejectedWalletError(error: unknown): boolean {
  if (!error) return false

  const text = readErrorText(error)
  if (WALLET_SEND_FAILURE_PATTERN.test(text)) return false

  const code = readErrorCode(error)
  if (code === 4001 || code === '4001' || code === 'ACTION_REJECTED') {
    if (!text.trim()) return true
    if (USER_REJECTED_PATTERN.test(text)) return true
    // 部分钱包把发送失败也复用作 4001；仅明确的取消文案才算拒绝
    return false
  }

  if (typeof error === 'object' && error !== null && 'cause' in error) {
    const cause = (error as { cause?: unknown }).cause
    if (cause && isUserRejectedWalletError(cause)) return true
  }

  return USER_REJECTED_PATTERN.test(text)
}

/**
 * 兜底的钱包 toast 文案
 *
 * 绝不返回原始 RPC / 后端英文——调用方必须传入 i18n 兜底文案
 * （如 `errors.chain.fallback`）。
 *
 * @param error 待处理错误
 * @param fallback 兜底文案
 * @returns 文案；用户拒绝或错误为空时返回 null
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
