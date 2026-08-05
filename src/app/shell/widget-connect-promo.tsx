import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

import { ConnectPromoCard } from '~/app/shell/connect-promo-card'
import { cn } from '~/shared/lib/utils'

const dappWidgetConnectFooter = tv({
  slots: {
    spacer: 'min-h-3.5 shrink-0 grow basis-3.5 max-dapp:hidden',
    bottom: 'mt-3.5 w-full shrink-0 dapp:mt-auto max-dapp:mt-3',
  },
})

/** 操作区底部预留间距后放置内容（PC 下贴底，H5 下跟随内容）。 */
function WidgetConnectFooter({ children, className }: { children: ReactNode; className?: string }) {
  const styles = dappWidgetConnectFooter()
  return (
    <>
      <div aria-hidden="true" className={styles.spacer()} />
      <div className={cn(styles.bottom(), className)}>{children}</div>
    </>
  )
}

/** 操作区底部贴底的「连接钱包」引导卡容器。 */
export function WidgetConnectPromo({ className }: { className?: string }) {
  return (
    <WidgetConnectFooter className={className}>
      <ConnectPromoCard />
    </WidgetConnectFooter>
  )
}
