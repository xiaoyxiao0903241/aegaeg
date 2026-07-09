import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { cn } from '~/shared/lib/utils'
import { DappConnectPromoCard } from '~/app/shell/dapp-connect-promo-card'

const dappWidgetConnectFooter = tv({
  slots: {
    spacer: 'max-dapp:hidden min-h-3.5 shrink-0 grow basis-3.5',
    bottom: 'mt-3.5 w-full shrink-0 max-dapp:mt-3 dapp:mt-auto',
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
