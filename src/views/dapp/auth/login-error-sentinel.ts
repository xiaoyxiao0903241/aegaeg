import {
  ACCOUNT_BANNED_SENTINEL,
  LOGIN_ERROR,
} from '~/shared/api/account-banned'
import { classifyLoginFailure } from '~/core/auth/classify-login-failure'

/** 将 classifyLoginFailure 结果映射为 AuthStore 可持久化的 sentinel。 */
export function toLoginErrorSentinel(error: unknown): string | null {
  switch (classifyLoginFailure(error)) {
    case 'banned':
      return ACCOUNT_BANNED_SENTINEL
    case 'user_rejected':
      return LOGIN_ERROR.USER_REJECTED
    case 'signature_rejected':
      return LOGIN_ERROR.SIGNATURE_REJECTED
    case 'failed':
      return LOGIN_ERROR.FAILED
    case 'transient':
      return null
  }
}
