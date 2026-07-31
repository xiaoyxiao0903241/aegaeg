import { authStatus } from '~/core/auth/auth-status'
import type { StoredAuthSession, StoredLoginSignature } from '~/core/auth/types'

/** Matches SIWE default TTL when JWT omits `exp`. */
export const FALLBACK_SESSION_TTL_MS = 60 * 60 * 1000

/**
 * The authentication state is fully derived from two facts: the connected
 * wallet address and the `address → jwt` cache. There is no independent
 * "current session" to keep in sync — switching wallets simply changes which
 * cache entry the state points at.
 */
export type AuthState =
  | { kind: 'disconnected' }
  | { kind: 'sessionReady'; session: StoredAuthSession }
  | { kind: 'needsLogin' }

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
 * Fingerprint of the inputs that justify a fresh silent-login attempt. While
 * the fingerprint is unchanged the executor must not re-fire login, which both
 * dedupes renders and prevents a 401 → purge → re-login loop from spinning: a
 * second 401 yields the same `(address, no-token, signature)` fingerprint, so
 * the second attempt is suppressed.
 */
export function loginAttemptKey(
  address: string,
  session: StoredAuthSession | null,
  signature: StoredLoginSignature | null,
): string {
  return [address.toLowerCase(), session?.token ?? 'none', signature?.savedAt ?? 'nosig'].join(':')
}

export type AuthAction = { type: 'idle' } | { type: 'login' } | { type: 'renewAt'; at: number }

function sessionRenewAtMs(session: StoredAuthSession, renewThresholdMs: number): number {
  const expiresAt =
    typeof session.expiresAt === 'number'
      ? session.expiresAt
      : session.savedAt + FALLBACK_SESSION_TTL_MS
  return expiresAt - renewThresholdMs
}

/** Transient failures may retry; user rejection / ban / bad signature may not. */
export function isPermanentLoginErrorMessage(loginError: string | null): boolean {
  if (!loginError) return false
  if (loginError === 'ACCOUNT_BANNED') return true
  if (loginError === 'LOGIN_USER_REJECTED') return true
  if (loginError === 'LOGIN_SIGNATURE_REJECTED') return true
  if (loginError === 'LOGIN_FAILED') return true
  // WALLET_NOT_CONNECTED is transient (account may appear on next tick) — do not latch.
  // Legacy raw English latches (pre-sentinel) — keep classifying until purged.
  if (/rejected|denied|cancel/i.test(loginError)) return true
  if (/nonce|signature|expired|invalid/i.test(loginError)) return true
  return false
}

/**
 * Given the derived state plus the runtime guards, decide the single side
 * effect the provider should perform. Auto-login fires once per attempt key:
 * with a usable cached SIWE signature it is fully silent, without one it
 * prompts the wallet a single time — the loop guard (attempt key) and the
 * error latch prevent repeated prompts.
 */
export function deriveAuthAction({
  state,
  isLoggingIn,
  loginError,
  lastAttemptKey,
  attemptKey,
  renewThresholdMs,
}: {
  state: AuthState
  isLoggingIn: boolean
  loginError: string | null
  lastAttemptKey: string | null
  attemptKey: string
  renewThresholdMs: number
}): AuthAction {
  if (state.kind === 'disconnected') return { type: 'idle' }

  if (state.kind === 'needsLogin') {
    if (isLoggingIn || lastAttemptKey === attemptKey) {
      return { type: 'idle' }
    }
    if (isPermanentLoginErrorMessage(loginError)) {
      return { type: 'idle' }
    }
    return { type: 'login' }
  }

  return { type: 'renewAt', at: sessionRenewAtMs(state.session, renewThresholdMs) }
}

/** 静默登录失败后是否清除 attempt 闩锁，允许下一轮输入变化后重试。 */
export function shouldClearLoginAttemptAfterFailure(loginError: string | null): boolean {
  return !isPermanentLoginErrorMessage(loginError)
}
