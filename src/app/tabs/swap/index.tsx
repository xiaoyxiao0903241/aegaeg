import { useSwapViewStore } from '~/stores/swap-view-store'
import { SwapHubWidget } from '~/app/tabs/swap/swap-hub-widget'
import { SwapHubContent } from '~/app/tabs/swap/swap-hub-content'
import { FlashSwapWidget } from '~/app/tabs/swap/flash-swap-widget'
import { FlashSwapContent } from '~/app/tabs/swap/flash-swap-content'
import { TradeSwapWidget } from '~/app/tabs/swap/trade-swap-widget'
import { TradeSwapContent } from '~/app/tabs/swap/trade-swap-content'

export function SwapWidget({
  onSelectGenesis,
}: {
  onSelectGenesis: () => void
}) {
  const view = useSwapViewStore((state) => state.view)

  if (view === 'flash') {
    return <FlashSwapWidget onSelectGenesis={onSelectGenesis} />
  }

  if (view === 'trade') {
    return <TradeSwapWidget onSelectGenesis={onSelectGenesis} />
  }

  return <SwapHubWidget onSelectGenesis={onSelectGenesis} />
}

export function SwapContent() {
  const view = useSwapViewStore((state) => state.view)

  if (view === 'flash') {
    return <FlashSwapContent />
  }

  if (view === 'trade') {
    return <TradeSwapContent />
  }

  return <SwapHubContent />
}
