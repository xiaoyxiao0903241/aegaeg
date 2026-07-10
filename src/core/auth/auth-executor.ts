import { isPermanentLoginErrorMessage } from '~/core/auth/auth-machine'

/**
 * After a silent-login attempt fails, decide whether the loop guard
 * (`lastAttemptKey`) may be cleared so a later input change can retry.
 *
 * Permanent errors keep the guard latched until the user presses Sign-in
 * (which clears `lastAttemptKey`) or the attempt fingerprint changes.
 * Transient errors clear the guard so the next effect cycle can retry.
 *
 * 401 `invalidateSession` deliberately does NOT call this — it keeps the
 * guard so a rejected fresh token cannot spin silent re-login.
 */
export function shouldClearLoginAttemptAfterFailure(
  loginError: string | null,
): boolean {
  return !isPermanentLoginErrorMessage(loginError)
}
