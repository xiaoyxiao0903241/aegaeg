import { resolveAuthStatus } from '~/lib/api/auth/resolve-auth-status'
import type { StoredLoginSignature } from '~/lib/api/auth/login-signature-cache'
import type { StoredAuthSession } from '~/lib/api/auth/session'

/**
 * The authentication state is fully derived from two facts: the connected
 * wallet address and the `address → jwt` cache. There is no independent
 * "current session" to keep in sync — switching wallets simply changes which
 * cache entry the state points at.
 */
export type AuthState =
  | { kind: 'disconnected' }
  | { kind: 'authenticated'; session: StoredAuthSession }
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
  const status = resolveAuthStatus({ session, walletAddress, now })

  if (status.isAuthenticated && session) {
    return { kind: 'authenticated', session }
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
export function buildLoginAttemptKey(
  address: string,
  session: StoredAuthSession | null,
  signature: StoredLoginSignature | null,
): string {
  return [
    address.toLowerCase(),
    session?.token ?? 'none',
    signature?.savedAt ?? 'nosig',
  ].join(':')
}

export type AuthAction =
  | { type: 'idle' }
  | { type: 'login' }
  | { type: 'renewAt'; at: number }

/**
 * Given the derived state plus the runtime guards, decide the single side
 * effect the provider should perform. Silent login fires only when a usable
 * cached SIWE signature exists — a wallet with no signature stays idle and
 * waits for the user to press the sign-in button instead of being ambushed by
 * a signature prompt.
 */
export function deriveAuthAction({
  state,
  hasUsableSignature,
  isLoggingIn,
  loginError,
  lastAttemptKey,
  attemptKey,
  renewThresholdMs,
}: {
  state: AuthState
  hasUsableSignature: boolean
  isLoggingIn: boolean
  loginError: string | null
  lastAttemptKey: string | null
  attemptKey: string
  now?: number
  renewThresholdMs: number
}): AuthAction {
  if (state.kind === 'disconnected') return { type: 'idle' }

  if (state.kind === 'needsLogin') {
    if (!hasUsableSignature || isLoggingIn || loginError || lastAttemptKey === attemptKey) {
      return { type: 'idle' }
    }
    return { type: 'login' }
  }

  const expiresAt = state.session.expiresAt
  if (typeof expiresAt !== 'number') return { type: 'idle' }
  return { type: 'renewAt', at: expiresAt - renewThresholdMs }
}
