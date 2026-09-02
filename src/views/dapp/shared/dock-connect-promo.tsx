import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

import { cn } from '~/shared/lib/utils'
import { ConnectPromoCard } from '~/views/dapp/shared/connect-promo-card'

const dappDockConnectFooter = tv({
  slots: {
    spacer: 'min-h-3.5 shrink-0 grow basis-3.5 max-dapp:hidden',
    /** 间距交给 DockStack gap；PC 贴底靠 spacer + mt-auto。 */
    bottom: 'w-full shrink-0 dapp:mt-auto',
  },
})

/** 操作区底部预留间距后放置内容（PC 下贴底，H5 下跟随内容）。 */
function DockConnectFooter({ children, className }: { children: ReactNode; className?: string }) {
  const styles = dappDockConnectFooter()
  return (
    <>
      <div aria-hidden="true" className={styles.spacer()} />
      <div className={cn(styles.bottom(), className)}>{children}</div>
    </>
  )
}

/** 操作区底部贴底的「连接钱包」引导卡容器。 */
export function DockConnectPromo({ className }: { className?: string }) {
  return (
    <DockConnectFooter className={className}>
      <ConnectPromoCard />
    </DockConnectFooter>
  )
}
