import { authStatus } from '~/core/auth/auth-status'
import type { StoredAuthSession, StoredLoginSignature } from '~/core/auth/types'

/** JWT 缺省 exp 时沿用 SIWE 默认会话时长（1 小时）。 */
export const FALLBACK_SESSION_TTL_MS = 60 * 60 * 1000

/**
 * 认证状态完全由两个事实推导：当前连接的钱包地址与「地址 → JWT」缓存。
 *
 * 不存在独立的「当前会话」需要同步——切换钱包只是改变了状态指向的缓存条目。
 */
export type AuthState =
  | { kind: 'disconnected' }
  | { kind: 'sessionReady'; session: StoredAuthSession }
  | { kind: 'needsLogin' }

/**
 * 根据连接地址与会话缓存推导认证状态。
 *
 * 会话归属地址须与当前钱包一致，且 JWT 未过期才算 sessionReady；
 * 地址不一致或会话缺失时回到 needsLogin。
 *
 * @param walletAddress 当前连接的钱包地址；未连接时为 undefined
 * @param sessionsByAddress 按地址（小写）索引的会话缓存
 * @param now 当前时间（毫秒），用于过期判定
 * @returns 认证状态
 * @see 手册 §1.3 前端全局状态
 */
export function deriveAuthState({
  walletAddress,
  sessionsByAddress,
  now = Date.now(),
}: {
  walletAddress: string | undefined
  sessionsByAddress: Record<string, StoredAuthSession>
  now?: number
}): AuthState {
  if (!walletAddress) return { kind: 'disconnected' }

  const session = sessionsByAddress[walletAddress.toLowerCase()] ?? null
  const status = authStatus({ session, walletAddress, now })

  if (status.sessionReady && session) {
    return { kind: 'sessionReady', session }
  }
  return { kind: 'needsLogin' }
}

/**
 * 触发一次静默登录的输入指纹。
 *
 * 指纹不变时执行器不得重复触发登录：既能去重渲染，也能阻止
 * 401 → 清会话 → 重新登录的循环——第二次 401 产生的
 * `(address, no-token, signature)` 指纹相同，第二次尝试会被抑制。
 *
 * @param address 钱包地址
 * @param session 当前会话；无会话传 null
 * @param signature 缓存的登录签名；无签名传 null
 * @returns 指纹字符串
 */
export function loginAttemptKey(
  address: string,
  session: StoredAuthSession | null,
  signature: StoredLoginSignature | null,
): string {
  return [address.toLowerCase(), session?.token ?? 'none', signature?.savedAt ?? 'nosig'].join(':')
}

export type AuthAction = { type: 'idle' } | { type: 'login' } | { type: 'renewAt'; at: number }

/**
 * 登录链是否就绪：仅当 live 已知且等于期望链（BSC）才允许 SIWE / 续期调度。
 *
 * `null`/`undefined` 视为未知（等 hydrate），与异网同为「未就绪」——调度层 idle，
 * 不写 permanent loginError。
 */
export function isLoginChainReady(
  liveChainId: number | null | undefined,
  expectedChainId: number,
): boolean {
  return liveChainId != null && liveChainId === expectedChainId
}

function sessionRenewAtMs(session: StoredAuthSession, renewThresholdMs: number): number {
  const expiresAt =
    typeof session.expiresAt === 'number'
      ? session.expiresAt
      : session.savedAt + FALLBACK_SESSION_TTL_MS
  return expiresAt - renewThresholdMs
}

/** 瞬时失败可重试；用户拒绝 / 封禁 / 签名无效等永久失败不可重试。异网是环境谓词，不在此列。 */
export function isPermanentLoginErrorMessage(loginError: string | null): boolean {
  if (!loginError) return false
  if (loginError === 'ACCOUNT_BANNED') return true
  if (loginError === 'LOGIN_USER_REJECTED') return true
  if (loginError === 'LOGIN_SIGNATURE_REJECTED') return true
  if (loginError === 'LOGIN_FAILED') return true
  // WALLET_NOT_CONNECTED 属于瞬时失败（账户可能下一秒出现），不锁定。
  // 旧版英文错误文案（哨兵引入前）保留分类，直到被清理。
  if (/rejected|denied|cancel/i.test(loginError)) return true
  if (/nonce|signature|expired|invalid/i.test(loginError)) return true
  return false
}

/**
 * 续期是否因用户明确拒签 / 封禁而停摆。
 *
 * 比 {@link isPermanentLoginErrorMessage} 更窄：不含 LOGIN_FAILED 与宽泛
 * nonce/expired 匹配，避免瞬时文案把 sessionReady 续期永久掐死。
 */
export function isSessionRenewHaltError(loginError: string | null): boolean {
  if (!loginError) return false
  if (loginError === 'ACCOUNT_BANNED') return true
  if (loginError === 'LOGIN_USER_REJECTED') return true
  if (loginError === 'LOGIN_SIGNATURE_REJECTED') return true
  if (/rejected|denied|cancel/i.test(loginError)) return true
  return false
}

/**
 * 根据推导出的状态与运行时守卫，决定 Provider 应执行的唯一副作用。
 *
 * 自动登录按尝试指纹只触发一次：有可用的缓存 SIWE 签名时完全静默，
 * 没有时只弹一次钱包；循环守卫（尝试指纹）与失败锁定防止重复弹窗。
 * 链未就绪（未知或异网）一律 idle——异网是环境，不是 permanent loginError。
 *
 * @param state 推导出的认证状态
 * @param isLoggingIn 是否正在登录
 * @param loginError 上一次登录错误；null 表示无
 * @param lastAttemptKey 上一次触发的指纹
 * @param attemptKey 当前指纹
 * @param renewThresholdMs 会话到期前的续期提前量
 * @param loginChainReady live 已知且等于期望链
 * @returns 应执行的认证动作
 */
export function deriveAuthAction({
  state,
  isLoggingIn,
  loginError,
  lastAttemptKey,
  attemptKey,
  renewThresholdMs,
  loginChainReady,
}: {
  state: AuthState
  isLoggingIn: boolean
  loginError: string | null
  lastAttemptKey: string | null
  attemptKey: string
  renewThresholdMs: number
  loginChainReady: boolean
}): AuthAction {
  if (state.kind === 'disconnected') return { type: 'idle' }
  if (!loginChainReady) return { type: 'idle' }

  if (state.kind === 'needsLogin') {
    if (isLoggingIn || lastAttemptKey === attemptKey) {
      return { type: 'idle' }
    }
    if (isPermanentLoginErrorMessage(loginError)) {
      return { type: 'idle' }
    }
    return { type: 'login' }
  }

  // sessionReady：仅拒签/封禁停续期，勿用宽泛 permanent 分类掐死瞬时失败
  if (isSessionRenewHaltError(loginError)) {
    return { type: 'idle' }
  }
  return { type: 'renewAt', at: sessionRenewAtMs(state.session, renewThresholdMs) }
}

/** 静默登录失败后是否解除尝试锁定，允许输入变化后开启新一轮重试。 */
export function shouldClearLoginAttemptAfterFailure(loginError: string | null): boolean {
  return !isPermanentLoginErrorMessage(loginError)
}

/** 续期失败后至少再等这么久，避免马上反复弹签名。 */
export const SESSION_RENEW_TRANSIENT_BACKOFF_MS = 5_000

/**
 * 计算实际开始续期的时刻
 *
 * 取「原计划时刻」与「失败后最早可再试时刻」中较晚的一个，
 * 避免计划时间已过却立刻连着重试。
 *
 * @param actionAtMs 状态机给出的计划续期时刻
 * @param notBeforeMs 失败后最早可再试时刻；无限制时为 0
 * @returns 安排定时器的目标时刻
 */
export function clampRenewAtMs(actionAtMs: number, notBeforeMs: number): number {
  return Math.max(actionAtMs, notBeforeMs)
}

/**
 * 瞬时续期失败后，下一次允许再试的最早时刻
 *
 * @param nowMs 当前时间（毫秒）
 * @param backoffMs 最短间隔；默认见 {@link SESSION_RENEW_TRANSIENT_BACKOFF_MS}
 * @returns 最早可再安排续期的时刻
 */
export function renewNotBeforeAfterTransientFailureMs(
  nowMs: number,
  backoffMs: number = SESSION_RENEW_TRANSIENT_BACKOFF_MS,
): number {
  return nowMs + backoffMs
}
