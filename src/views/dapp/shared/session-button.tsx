import type { ComponentProps } from 'react'

import { useDappHost } from '~/hooks/use-dapp-host'
import { MainButton } from '~/shared/components/main-button'

/**
 * 登录后才出现的主操作按钮
 *
 * 没有 sessionReady 时不渲染。连钱包引导不走这里。
 */
export function SessionButton(props: ComponentProps<typeof MainButton>) {
  const { sessionReady } = useDappHost()
  if (!sessionReady) return null
  return <MainButton {...props} />
}
