import { useI18n } from '~/i18n/use-i18n'
import { stakingHubAssets } from '~/app/assets'
import { openAssetsView } from '~/shared/config/open-assets-view'
import {
  ExchangePanelToggle,
  ExchangeWidgetBody,
} from '~/views/dapp/exchange/exchange-widget-composites'
import { WidgetHeader } from '~/shared/ui/widget-header'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { useDappShell } from '~/app/use-dapp-shell'
import type { AssetsView } from '~/stores/assets-view-store'
import { AssetsModeCard } from '~/views/dapp/assets/hub/assets-mode-card'
import { useAssetsHubOverviewStats } from '~/views/dapp/assets/hub/use-assets-hub-overview-stats'

const MODE_KEYS = ['stake', 'lpbond', 'burnbond', 'xmine'] as const satisfies readonly AssetsView[]

export function AssetsHubWidget() {
  const { messages: t } = useI18n()
  const { walletReady } = useDappShell()
  const overview = useAssetsHubOverviewStats()

  const icons = {
    stake: stakingHubAssets.modeStake,
    lpbond: stakingHubAssets.modeLpBond,
    burnbond: stakingHubAssets.modeBurnBond,
    xmine: stakingHubAssets.modeXmine,
  } as const

  return (
    <>
      <WidgetHeader
        action={<ExchangePanelToggle />}
        subtitle={t.assets.intro}
        title={t.assets.title}
      />
      <ExchangeWidgetBody>
        {MODE_KEYS.map((key) => {
          const stats = overview.modes[key]
          return (
            <AssetsModeCard
              aprHint={t.assets.hub.modes[key].aprHint}
              aprLabel={stats.aprLabel}
              icon={icons[key]}
              key={key}
              onClick={() => openAssetsView(key)}
              positionApprox={stats.positionApprox}
              positionLabel={t.assets.hub.card.position}
              positionValue={stats.positionValue}
              title={t.assets.hub.modes[key].title}
              tourId={key === 'stake' ? 'asset-mode-stake' : undefined}
              yieldApprox={stats.yieldApprox}
              yieldLabel={t.assets.hub.card.yield}
              yieldValue={stats.yieldValue}
            />
          )
        })}

        {!walletReady ? <DappWidgetConnectPromo /> : null}
      </ExchangeWidgetBody>
    </>
  )
}
