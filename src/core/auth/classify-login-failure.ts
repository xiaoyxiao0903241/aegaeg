/**
 * 将登录失败归类为稳定种类（不依赖 React / API 客户端类型）。
 * AuthProvider 再映射到 LOGIN_ERROR / ACCOUNT_BANNED sentinel。
 */
export type LoginFailureKind =
  | 'banned'
  | 'user_rejected'
  | 'signature_rejected'
  | 'failed'
  | 'transient'

const USER_REJECTED = /rejected|denied|cancel/i
const SIGNATURE_REJECTED = /nonce|signature|expired|invalid/i
const WALLET_SEND_FAILURE = /failed to send|send transaction|tx failed|transaction failed/i

function readErrorText(error: unknown): string {
  if (error == null) return ''
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  if (typeof error === 'object') {
    const record = error as { message?: unknown; error?: unknown; shortMessage?: unknown }
    return [record.message, record.error, record.shortMessage].filter(Boolean).join(' ')
  }
  return String(error)
}

function readErrorCode(error: unknown): unknown {
  if (typeof error !== 'object' || error === null) return undefined
  return (error as { code?: unknown }).code
}

function isBannedShape(error: unknown): boolean {
  const code = readErrorCode(error)
  if (code !== 403) return false
  const text = readErrorText(error)
  // 仅当文案/业务码指向封禁时视为 banned；裸 403 走 transient，避免误闩。
  return /ban|封|ACCOUNT_BANNED|account.?disabled|forbidden.?account/i.test(text)
}

function isUserRejectedShape(error: unknown): boolean {
  if (!error) return false
  const text = readErrorText(error)
  if (WALLET_SEND_FAILURE.test(text)) return false
  const code = readErrorCode(error)
  if (code === 4001 || code === '4001' || code === 'ACTION_REJECTED') {
    if (!text.trim()) return true
    return USER_REJECTED.test(text)
  }
  if (typeof error === 'object' && error !== null && 'cause' in error) {
    const cause = (error as { cause?: unknown }).cause
    if (cause && isUserRejectedShape(cause)) return true
  }
  return USER_REJECTED.test(text)
}

function isSignatureRejectedShape(error: unknown): boolean {
  const code = readErrorCode(error)
  // ApiError 形态：优先看 error + message 拼接
  if (typeof error === 'object' && error !== null && 'error' in error) {
    const record = error as { error?: unknown; message?: unknown }
    const blob = `${record.error ?? ''} ${record.message ?? ''}`
    if (SIGNATURE_REJECTED.test(blob)) return true
  }
  if (typeof code === 'number' && code >= 400 && code < 500 && code !== 403) {
    const text = readErrorText(error)
    if (SIGNATURE_REJECTED.test(text)) return true
  }
  return SIGNATURE_REJECTED.test(readErrorText(error))
}

/** 登录失败分类：永久类用于闩锁静默重试；transient 允许下一轮再试。 */
export function classifyLoginFailure(error: unknown): LoginFailureKind {
  if (isBannedShape(error)) return 'banned'
  if (isUserRejectedShape(error)) return 'user_rejected'
  if (isSignatureRejectedShape(error)) return 'signature_rejected'
  // 传输层 / 无稳定语义 → transient，允许重试
  return 'transient'
}

/** 后端已消费 nonce 等业务 4xx：应清除本地 SIWE 签名缓存。 */
export function shouldClearCachedLoginSignature(error: unknown): boolean {
  return classifyLoginFailure(error) === 'signature_rejected'
}
