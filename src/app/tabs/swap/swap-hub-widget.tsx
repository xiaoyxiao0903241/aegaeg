import { cn } from '~/lib/utils'
import { useI18n } from '~/i18n/use-i18n'
import { swapHubAssets } from '~/app/assets'
import { DappWidgetConnectFooter } from '~/app/components/dapp-widget-connect-footer'
import { dappWidgetBodyClass } from '~/app/components/dapp-widget-frame'
import { GenesisPromoCard } from '~/app/components/genesis-promo-card'
import { useDappShell } from '~/app/dapp-shell-context'
import { useGenesisWidgetContext } from '~/app/genesis-widget-context'
import { shellWidgetRootClass } from '~/app/shell-layout'
import { useSwapViewStore } from '~/stores/swap-view-store'
import { SwapModeCard } from '~/app/tabs/swap/swap-mode-card'
import { SwapHubHeader, SwapWidgetBody } from '~/app/tabs/swap/swap-widget-header'

export function SwapHubWidget({
  onSelectGenesis,
}: {
  onSelectGenesis: () => void
}) {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const genesis = useGenesisWidgetContext()
  const setView = useSwapViewStore((state) => state.setView)

  return (
    <div className={shellWidgetRootClass}>
      <SwapHubHeader subtitle={t.swap.intro} title={t.swap.title} />
      <SwapWidgetBody
        bodyClassName={cn(dappWidgetBodyClass, 'gap-3')}
        footer={
          sessionReady ? (
            <DappWidgetConnectFooter>
              <GenesisPromoCard
                actionLabel={t.genesis.joinGenesis}
                className={cn(
                  'gap-1.5 [&_button]:min-h-9.5 [&_button]:text-xs [&_p]:leading-tight',
                  'max-dapp:[&_button]:min-h-10 max-dapp:[&_button]:text-sm',
                )}
                isLoading={genesis.isLoading}
                onClick={onSelectGenesis}
                promo={genesis.promoSnapshot}
              />
            </DappWidgetConnectFooter>
          ) : undefined
        }
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
    </div>
  )
}
