import { ApiError } from '~/shared/api/client'

/** 后端以 403 拒绝登录（封禁）时存入 auth `loginError` 的哨兵值。 */
export const ACCOUNT_BANNED_SENTINEL = 'ACCOUNT_BANNED'

/** 稳定的 loginError 哨兵——绝不存储后端/钱包的原始英文文案。 */
export const LOGIN_ERROR = {
  ACCOUNT_BANNED: ACCOUNT_BANNED_SENTINEL,
  WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
  USER_REJECTED: 'LOGIN_USER_REJECTED',
  SIGNATURE_REJECTED: 'LOGIN_SIGNATURE_REJECTED',
  FAILED: 'LOGIN_FAILED',
  /** 钱包 live chain ≠ 期望链（BSC）；须切网后再登。 */
  WRONG_NETWORK: 'LOGIN_WRONG_NETWORK',
} as const

const ACCOUNT_BANNED_TOAST_ID = 'account-banned'

/** 同一波 403 中抑制重复广播的冷却窗口。 */
const REPORT_COOLDOWN_MS = 3_000

type AccountBannedListener = () => void
const listeners = new Set<AccountBannedListener>()
let lastReportedAt = 0

/**
 * 判断错误是否为账号封禁（403 + 业务码/文案指向封禁）
 *
 * 裸 403 不视为封禁，需错误内容包含封禁特征，避免误伤其他 403 场景。
 *
 * @param error 待判断的错误对象
 * @returns 是否判定为封禁
 */
export function isAccountBannedError(error: unknown): boolean {
  if (!(error instanceof ApiError) && !(error instanceof Error && error.name === 'ApiError')) {
    return false
  }
  const apiError = error as ApiError
  if (apiError.code !== 403) return false
  const blob = `${apiError.error ?? ''} ${apiError.message ?? ''}`
  // 裸 403 不视为封禁；需业务码/文案指向封禁。
  return /ban|封|ACCOUNT_BANNED|account.?disabled|forbidden.?account/i.test(blob)
}

/** 订阅封禁事件；返回取消订阅函数。 */
export function subscribeAccountBanned(listener: AccountBannedListener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** 每次突发只广播一次；冷却窗口 + Sonner id 对并行 403 去重。 */
export function reportAccountBanned(): void {
  const now = Date.now()
  if (now - lastReportedAt < REPORT_COOLDOWN_MS) return
  lastReportedAt = now

  for (const listener of listeners) {
    listener()
  }
}

/** 全局 API 响应拦截器——`apiRequest` 抛错前调用。 */
export function interceptApiError(error: unknown): void {
  if (isAccountBannedError(error)) {
    reportAccountBanned()
  }
}

/** 仅测试用：Vite 服务器复用时，模块级通知状态在 ssrLoadModule 间残留，需重置冷却。 */
export function resetAccountBannedReportCooldownForTests(): void {
  lastReportedAt = 0
}

/** 返回封禁提示的固定 toast id，供弹窗去重。 */
export function getAccountBannedToastId(): string {
  return ACCOUNT_BANNED_TOAST_ID
}

/**
 * 把 loginError 哨兵映射为面向用户的登录文案
 *
 * USER_REJECTED（用户主动拒绝）无需提示，返回 null；
 * 其余未知哨兵一律按通用登录失败处理，避免旧原始字符串直接上屏。
 *
 * @param error loginError 哨兵值
 * @param messages 各场景的文案表
 * @returns 面向用户的登录文案
 */
export function authLoginErrorMessage(
  error: string | null,
  messages: {
    accountBanned: string
    walletNotConnected: string
    loginFailed: string
    loginSignatureRejected: string
    loginWrongNetwork: string
  },
): string | null {
  if (!error) return null
  if (error === ACCOUNT_BANNED_SENTINEL || error === LOGIN_ERROR.ACCOUNT_BANNED) {
    return messages.accountBanned
  }
  if (error === LOGIN_ERROR.WALLET_NOT_CONNECTED) return messages.walletNotConnected
  if (error === LOGIN_ERROR.USER_REJECTED) return null
  if (error === LOGIN_ERROR.SIGNATURE_REJECTED) return messages.loginSignatureRejected
  if (error === LOGIN_ERROR.WRONG_NETWORK) return messages.loginWrongNetwork
  if (error === LOGIN_ERROR.FAILED) return messages.loginFailed
  // 旧原始字符串不得上屏——一律按通用登录失败处理
  return messages.loginFailed
}
