import type { ReactNode } from 'react'
import type { DappTab } from '~/app/types'
import { useDappShell } from '~/app/dapp-shell-context'
import { FlashSwapWidgetProvider } from '~/views/dapp/swap/flash-swap-widget-context'
import { TradeSwapWidgetProvider } from '~/views/dapp/swap/trade-swap-widget-context'
import { useSwapViewStore, type SwapView } from '~/stores/swap-view-store'

function resolveEffectiveSwapView(
  view: SwapView,
  motion: boolean,
  incomingView: SwapView | null,
): SwapView {
  if (motion && incomingView) return incomingView
  return view
}

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
  const incomingView = useSwapViewStore((state) => state.incomingView)
  const swapTabActive = activeTab === 'swap'
  const effectiveView = resolveEffectiveSwapView(view, motion, incomingView)
  const flashQuotesEnabled = swapTabActive && effectiveView === 'flash'
  const tradeQuotesEnabled = swapTabActive && effectiveView === 'trade'

  return (
    <FlashSwapWidgetProvider
      quotesEnabled={flashQuotesEnabled}
      sessionReady={sessionReady}
    >
      <TradeSwapWidgetProvider
        quotesEnabled={tradeQuotesEnabled}
        sessionReady={sessionReady}
      >
        {children}
      </TradeSwapWidgetProvider>
    </FlashSwapWidgetProvider>
  )
}
