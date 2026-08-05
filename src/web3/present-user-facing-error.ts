import { toast } from 'sonner'

import type { AppMessagesBundle } from '~/i18n/messages/app/types'
import { getErrorMessage } from '~/web3/errors/get-error-message'
import { isUserRejectedWalletError } from '~/web3/errors/wallet-error'

/**
 * 展示单条用户可见的错误提示
 *
 * 默认文案取 `getErrorMessage`，可用 `messageFor` 覆盖（如 API / 页面加载场景）。
 * 用户主动拒绝钱包签名时静默返回，不弹提示。
 *
 * @param error 原始错误对象
 * @param t i18n 文案包
 * @param options.id 可选提示 id，相同 id 的错误不会重复弹出
 * @param options.messageFor 自定义错误文案生成器，返回 null 则不弹
 */
export function presentUserFacingError(
  error: unknown,
  t: AppMessagesBundle,
  options?: {
    id?: string
    messageFor?: (error: unknown) => string | null | undefined
  },
): void {
  if (error == null) return
  if (isUserRejectedWalletError(error)) return
  const message = options?.messageFor?.(error) ?? getErrorMessage(error, t)
  if (message) toast.error(message, options?.id ? { id: options.id } : undefined)
}
