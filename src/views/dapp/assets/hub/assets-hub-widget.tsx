import { useState } from 'react'

import { assetsHubAssets } from '~/app/assets'
import { DappPanelToggle } from '~/app/shell/dapp-panel-toggle'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { useDappShell } from '~/app/use-dapp-shell'
import { useI18n } from '~/i18n/use-i18n'
import type { AssetsView } from '~/shared/config/dapp-deep-links'
import { openAssetsView } from '~/shared/config/dapp-open-views'
import { WidgetHeader } from '~/shared/ui/widget-header'
import { AssetsHubFilterMenu } from '~/views/dapp/assets/hub/assets-hub-filter-menu'
import { AssetsModeCard } from '~/views/dapp/assets/hub/assets-mode-card'
import { useAssetsHubOverviewStats } from '~/views/dapp/assets/hub/use-assets-hub-overview-stats'

const MODE_KEYS = ['stake', 'lpbond', 'burnbond', 'xmine'] as const satisfies readonly AssetsView[]

export function AssetsHubWidget() {
  const { messages: t } = useI18n()
  const { walletReady } = useDappShell()
  const overview = useAssetsHubOverviewStats()
  const [hideZero, setHideZero] = useState(false)

  const icons = {
    stake: assetsHubAssets.modeStake,
    lpbond: assetsHubAssets.modeLpBond,
    burnbond: assetsHubAssets.modeBurnBond,
    xmine: assetsHubAssets.modeXmine,
  } as const

  const modes = MODE_KEYS.filter((key) => {
    if (!hideZero) return true
    return overview.modes[key].hasBalance
  })

  return (
    <>
      <WidgetHeader
        action={
          /* PC：筛选 + 面板切换靠右；H5：action 隐藏，筛选进 title 行贴右 */
          <div className="flex items-center gap-2 max-dapp:hidden">
            <AssetsHubFilterMenu
              align="end"
              ariaLabel={t.assets.hub.filterAria}
              hideZero={hideZero}
              hideZeroLabel={t.assets.hub.hideZero}
              onHideZeroChange={setHideZero}
            />
            <DappPanelToggle className="rounded-control!" />
          </div>
        }
        subtitle={t.assets.intro}
        title={
          <>
            <span className="min-w-0">{t.assets.title}</span>
            {/* H5：与标题同行、ml-auto 贴页面右缘（action 已 hidden，copy 全宽） */}
            <AssetsHubFilterMenu
              align="end"
              ariaLabel={t.assets.hub.filterAria}
              className="dapp:hidden"
              hideZero={hideZero}
              hideZeroLabel={t.assets.hub.hideZero}
              onHideZeroChange={setHideZero}
            />
          </>
        }
        titleClassName="flex w-full items-center justify-between gap-3"
      />
      <DappWidgetStack>
        {modes.map((key) => {
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

        {walletReady && hideZero && modes.length === 0 ? (
          <DappTableEmptyMessage embedded title={t.assets.hub.hideZeroEmpty} />
        ) : null}

        {!walletReady ? <DappWidgetConnectPromo /> : null}
      </DappWidgetStack>
    </>
  )
}
