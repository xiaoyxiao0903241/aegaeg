import { useEffect, useEffectEvent } from 'react'

import { useI18n } from '~/i18n/use-i18n'
import { presentUserFacingError } from '~/web3/present-user-facing-error'

/**
 * 当 error 变为真值时弹出用户可见的错误提示
 *
 * 用于报价/页面查询/绑定等非链上写场景；链上写请走 useChainMutation。
 * 默认文案取 getErrorMessage；仅在 API/页面需要定制时传 messageFor。
 *
 * @param error 待提示的错误对象
 * @param options.id 提示唯一标识，避免重复弹窗
 * @param options.trigger 变化时重新触发提示的依赖值
 * @param options.onPresented 提示展示后的回调
 * @param options.messageFor 自定义错误文案；返回空时用默认文案
 */
export function usePresentUserFacingError(
  error: unknown,
  options?: {
    id?: string
    trigger?: unknown
    onPresented?: () => void
    messageFor?: (error: unknown) => string | null | undefined
  },
): void {
  const { messages: t } = useI18n()
  const present = useEffectEvent((next: unknown) => {
    presentUserFacingError(next, t, {
      id: options?.id,
      messageFor: options?.messageFor,
    })
    options?.onPresented?.()
  })

  useEffect(() => {
    if (!error) return
    present(error)
  }, [error, options?.trigger])
}
