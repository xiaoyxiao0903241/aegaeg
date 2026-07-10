import { useI18n } from '~/i18n/use-i18n'
import { swapHubAssets } from '~/app/assets'
import { useDappShell } from '~/app/dapp-shell-context'
import { useSwapViewStore } from '~/stores/swap-view-store'
import { SwapModeCard } from '~/views/dapp/swap/hub/swap-mode-card'
import {
  SwapGenesisFooter,
  SwapPanelToggle,
  SwapWidgetBody,
} from '~/views/dapp/swap/swap-widget-composites'
import { WidgetHeader } from '~/shared/ui/widget-header'

export function SwapHubWidget({
  onSelectGenesis,
}: {
  onSelectGenesis: () => void
}) {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const setView = useSwapViewStore((state) => state.setView)

  return (
    <>
      <WidgetHeader
        action={<SwapPanelToggle />}
        subtitle={t.swap.intro}
        title={t.swap.title}
      />
      <SwapWidgetBody
        footer={sessionReady ? <SwapGenesisFooter onSelectGenesis={onSelectGenesis} /> : undefined}
      >
        <SwapModeCard
          body={t.swap.hub.modes.flash.body}
          icon={swapHubAssets.modeFlash}
          onClick={() => setView('flash')}
          title={t.swap.hub.modes.flash.title}
        />
        <SwapModeCard
          body={t.swap.hub.modes.trade.body}
          icon={swapHubAssets.modeTrade}
          onClick={() => setView('trade')}
          title={t.swap.hub.modes.trade.title}
        />
        <SwapModeCard
          badge={t.swap.hub.modes.comingSoon}
          body={t.swap.hub.modes.burn.body}
          icon={swapHubAssets.modeBurn}
          title={t.swap.hub.modes.burn.title}
        />
      </SwapWidgetBody>
    </>
  )
}
