import { useI18n } from '~/i18n/use-i18n'
import { swapHubAssets } from '~/app/assets'
import { dappWidgetBodyClass } from '~/app/shell/components/dapp-widget-frame'
import { useDappShell } from '~/app/dapp-shell-context'
import { useSwapViewStore } from '~/stores/swap-view-store'
import { SwapGenesisFooter } from '~/views/dapp/swap/swap-widget-primitives'
import { SwapModeCard } from '~/views/dapp/swap/swap-mode-card'
import { SwapHubHeader, SwapWidgetBody } from '~/views/dapp/swap/swap-widget-header'

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
      <SwapHubHeader subtitle={t.swap.intro} title={t.swap.title} />
      <SwapWidgetBody
        bodyClassName={dappWidgetBodyClass}
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
