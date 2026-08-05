/**
 * 登录失败分类：将钱包 / 后端抛出的异常归类为稳定种类。
 *
 * 永久类（封禁、用户拒绝、签名被拒）用于锁定静默重试，transient 允许
 * 下一轮再试。分类只依赖错误对象本身，不依赖 React 或 API 客户端类型，
 * AuthProvider 再映射到 LOGIN_ERROR / ACCOUNT_BANNED 哨兵值。
 *
 * @see 手册 §19 常见错误与前端提示
 */
export type LoginFailureKind =
  'banned' | 'user_rejected' | 'signature_rejected' | 'failed' | 'transient'

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
  // 仅当文案 / 业务码指向封禁时视为 banned；裸 403 走 transient，避免误锁定。
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

/**
 * 登录失败归类入口。
 *
 * 按 封禁 → 用户拒绝 → 签名被拒 顺序判断，未命中走 transient。
 * 传输层错误或无稳定语义的错误归为 transient，允许重试。
 *
 * @param error 登录抛出的异常
 * @returns 稳定的失败种类
 */
export function classifyLoginFailure(error: unknown): LoginFailureKind {
  if (isBannedShape(error)) return 'banned'
  if (isUserRejectedShape(error)) return 'user_rejected'
  if (isSignatureRejectedShape(error)) return 'signature_rejected'
  // 传输层 / 无稳定语义 → transient，允许重试
  return 'transient'
}

/**
 * 签名被拒（业务 4xx）时是否应清除本地 SIWE 签名缓存。
 *
 * 后端已消费 nonce 等一次性值，缓存签名不可复用，需清除以便重新生成。
 *
 * @param error 登录抛出的异常
 * @returns 需要清除时返回 true
 */
export function shouldClearCachedLoginSignature(error: unknown): boolean {
  return classifyLoginFailure(error) === 'signature_rejected'
}
