import type { ReactNode } from 'react'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'

export function SwapWidgetBody({
  bodyClassName,
  children,
  footer,
}: {
  bodyClassName?: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <DappWidgetStack className={bodyClassName}>
      {children}
      {footer ? <div className="mt-auto w-full shrink-0">{footer}</div> : null}
    </DappWidgetStack>
  )
}
