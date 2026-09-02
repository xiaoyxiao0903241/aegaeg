import { readErrorCode, readErrorText } from '~/web3/errors/error-text'

const USER_REJECTED_PATTERN =
  /user rejected|action_rejected|request rejected|user denied|rejected the request|denied transaction signature/i

/** 钱包发送 / 模拟失败：即使错误码是 4001 也必须展示给用户。 */
const WALLET_SEND_FAILURE_PATTERN =
  /transaction failed|interaction failed|likely to fail|execution reverted|cannot estimate gas|intrinsic gas too low|insufficient funds|not broadcast|reverted on-chain|wallet may have failed/i

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
  return fallback
}
