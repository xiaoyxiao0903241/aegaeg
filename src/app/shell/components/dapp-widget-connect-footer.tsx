import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { cn } from '~/shared/lib/utils'
import { DappConnectPromoCard } from '~/app/components/dapp-connect-promo-card'
import { dappWidgetFooterTopGapClass } from '~/app/dapp-detail-layout'

const dappWidgetConnectFooter = tv({
  slots: {
    spacer: 'max-dapp:hidden min-h-3.5 shrink-0 grow basis-3.5',
    bottom: cn(dappWidgetFooterTopGapClass, 'w-full shrink-0 dapp:mt-auto'),
  },
})

export function DappWidgetConnectFooter({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const styles = dappWidgetConnectFooter()
  return (
    <>
      <div aria-hidden="true" className={styles.spacer()} />
      <div className={cn(styles.bottom(), className)}>{children}</div>
    </>
  )
}

export function DappWidgetConnectPromo({
  className,
}: {
  className?: string
}) {
  return (
    <DappWidgetConnectFooter className={className}>
      <DappConnectPromoCard />
    </DappWidgetConnectFooter>
  )
}
