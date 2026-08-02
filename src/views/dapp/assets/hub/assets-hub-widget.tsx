import { assetsHubAssets, dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappPanelToggle } from '~/app/shell/dapp-panel-toggle'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { useDappShell } from '~/app/use-dapp-shell'
import { useI18n } from '~/i18n/use-i18n'
import type { AssetsView } from '~/shared/config/dapp-deep-links'
import { openAssetsView } from '~/shared/config/dapp-open-views'
import { Button } from '~/shared/ui/button'
import { WidgetHeader } from '~/shared/ui/widget-header'
import { AssetsModeCard } from '~/views/dapp/assets/hub/assets-mode-card'
import { useAssetsHubOverviewStats } from '~/views/dapp/assets/hub/use-assets-hub-overview-stats'

const MODE_KEYS = ['stake', 'lpbond', 'burnbond', 'xmine'] as const satisfies readonly AssetsView[]

export function AssetsHubWidget() {
  const { messages: t } = useI18n()
  const { walletReady } = useDappShell()
  const overview = useAssetsHubOverviewStats()

  const icons = {
    stake: assetsHubAssets.modeStake,
    lpbond: assetsHubAssets.modeLpBond,
    burnbond: assetsHubAssets.modeBurnBond,
    xmine: assetsHubAssets.modeXmine,
  } as const

  return (
    <>
      <WidgetHeader
        action={
          <div className="flex items-center gap-2">
            {/* Figma `4282:216` btn/settings：36 · radius/sm≈10 · 白底描边；面板 DEFER → 禁用但保持 bg-card */}
            <Button
              aria-label={t.assets.hub.settingsAria}
              className="grid size-9 min-h-9 shrink-0 bg-card p-0 disabled:bg-card max-dapp:hidden"
              disabled
              shape="rounded"
              type="button"
              variant="secondary"
            >
              <DappIcon alt="" size="lg" src={dappAssets.setting} />
            </Button>
            <DappPanelToggle />
          </div>
        }
        subtitle={t.assets.intro}
        title={t.assets.title}
      />
      <DappWidgetStack>
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
      </DappWidgetStack>
    </>
  )
}
