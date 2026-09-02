import type { AppMessagesBundle } from '~/i18n/messages/app/types'
import { apiUserFacingError } from '~/shared/api/api-user-facing-error'
import {
  type ErrorMessageContext,
  matchRevertMessage,
  matchSentinelMessage,
} from '~/web3/errors/error-messages'
import { readErrorText } from '~/web3/errors/error-text'
import { isUserRejectedWalletError } from '~/web3/errors/wallet-error'

export type { ErrorMessageContext }

/**
 * 写操作错误 → 用户文案（或 null 跳过 toast）
 *
 * 签名领取先打后端再上链；`ApiError` 走 API 文案，其余走哨兵 / revert，
 * 未识别才落到链上兜底，避免把取签名失败说成链上失败。
 * 文案对照表集中在 `error-messages.ts`；调用方传入当前 i18n 包。
 * 可选 `ctx.path` / `walletAddress` 用于共享 revert 消歧。
 *
 * @param error 待映射的错误
 * @param t 当前 i18n 文案包
 * @param ctx 写路径与钱包上下文
 * @returns 用户可见文案；用户主动拒绝或错误为空时返回 null
 * @see 手册 §19 常见错误与前端提示
 */
export function getErrorMessage(
  error: unknown,
  t: AppMessagesBundle,
  ctx?: ErrorMessageContext,
): string | null {
  if (error == null) return null
  if (isUserRejectedWalletError(error)) return null

  const fromApi = apiUserFacingError(error, t.errors.api)
  if (fromApi) return fromApi

  const raw = readErrorText(error)

  const fromSentinel = matchSentinelMessage(raw, t)
  if (fromSentinel) return fromSentinel

  const fromRevert = matchRevertMessage(error, raw, t, ctx)
  if (fromRevert) return fromRevert

  return t.errors.chain.fallback
}
