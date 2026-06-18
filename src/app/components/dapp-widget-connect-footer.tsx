import type { ReactNode } from 'react'
import { cn } from '~/lib/utils'
import { DappConnectPromoCard } from '~/app/components/dapp-connect-promo-card'

const WIDGET_FOOTER_SPACER = 'min-h-3.5 shrink-0 grow basis-3.5'

export const DAPP_WIDGET_BOTTOM_CARD_CLASS = 'mt-3.5 w-full shrink-0 dapp:mt-auto'

export function DappWidgetConnectFooter({
  children,
  className,
  pager = false,
}: {
  children: ReactNode
  className?: string
  pager?: boolean
}) {
  return (
    <>
      {!pager ? <div aria-hidden="true" className={WIDGET_FOOTER_SPACER} /> : null}
      <div className={cn('w-full', pager ? 'mt-3.5 shrink-0' : DAPP_WIDGET_BOTTOM_CARD_CLASS, className)}>
        {children}
      </div>
    </>
  )
}

export function DappWidgetConnectPromo({
  className,
  pager = false,
}: {
  className?: string
  pager?: boolean
}) {
  return (
    <DappWidgetConnectFooter className={className} pager={pager}>
      <DappConnectPromoCard />
    </DappWidgetConnectFooter>
  )
}
