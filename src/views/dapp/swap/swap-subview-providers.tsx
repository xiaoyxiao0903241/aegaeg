import type { ReactNode } from 'react'
import type { DappTab } from '~/shared/config/dapp-tabs'
import { useDappShell } from '~/app/dapp-shell-context'
import { FlashSwapWidgetProvider } from '~/views/dapp/swap/flash-swap-widget-context'
import { TradeSwapWidgetProvider } from '~/views/dapp/swap/trade-swap-widget-context'
import { useSwapViewStore } from '~/stores/swap-view-store'
import { viewsNeedingProvider } from '~/views/dapp/swap/views-needing-provider'

export function SwapSubviewProviders({
  activeTab,
  children,
}: {
  activeTab: DappTab
  children: ReactNode
}) {
  const { sessionReady } = useDappShell()
  const view = useSwapViewStore((state) => state.view)
  const motion = useSwapViewStore((state) => state.motion)
  const outgoingView = useSwapViewStore((state) => state.outgoingView)
  const incomingView = useSwapViewStore((state) => state.incomingView)
  const swapTabActive = activeTab === 'swap'
  const needed = viewsNeedingProvider(view, motion, outgoingView, incomingView)
  const flashQuotesEnabled = swapTabActive && needed.flash
  const tradeQuotesEnabled = swapTabActive && needed.trade

  let tree = children
  if (needed.trade) {
    tree = (
      <TradeSwapWidgetProvider quotesEnabled={tradeQuotesEnabled} sessionReady={sessionReady}>
        {tree}
      </TradeSwapWidgetProvider>
    )
  }
  if (needed.flash) {
    tree = (
      <FlashSwapWidgetProvider quotesEnabled={flashQuotesEnabled} sessionReady={sessionReady}>
        {tree}
      </FlashSwapWidgetProvider>
    )
  }

  return tree
}
