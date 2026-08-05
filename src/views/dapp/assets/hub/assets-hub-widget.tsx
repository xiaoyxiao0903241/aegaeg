import { useState } from 'react'

import { assetsHubAssets } from '~/app/assets'
import { PanelToggle } from '~/app/shell/panel-toggle'
import { WidgetConnectPromo } from '~/app/shell/widget-connect-promo'
import { WidgetStack } from '~/app/shell/widget-frame'
import { useAppShell } from '~/app/use-app-shell'
import { useI18n } from '~/i18n/use-i18n'
import { CountValue } from '~/shared/components/count-value'
import { Icon } from '~/shared/components/icon'
import { InteractiveCard } from '~/shared/components/interactive-card'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { Tooltip } from '~/shared/components/tooltip'
import { WidgetHeader } from '~/shared/components/widget-header'
import type { AssetsView } from '~/shared/config/dapp-deep-links'
import { openAssetsView } from '~/shared/config/dapp-open-views'
import { AssetsHubFilterMenu } from '~/views/dapp/assets/hub/assets-hub-filter-menu'
import { useAssetsHubOverviewStats } from '~/views/dapp/assets/hub/use-assets-hub-overview-stats'

/** 资产 Hub：质押 / LP 债券 / 燃烧债券 / XMine 仓位概览 */
const ASSET_MODES = [
  'stake',
  'lpbond',
  'burnbond',
  'xmine',
] as const satisfies readonly AssetsView[]

const ASSET_MODE_ICONS = {
  stake: assetsHubAssets.modeStake,
  lpbond: assetsHubAssets.modeLpBond,
  burnbond: assetsHubAssets.modeBurnBond,
  xmine: assetsHubAssets.modeXmine,
} as const

/** 资产 Hub 侧栏：四个仓位模式的入口卡，勾选隐藏零余额时过滤；未连接钱包时展示引导 */
export function AssetsHubWidget() {
  const { messages: t } = useI18n()
  const { walletReady } = useAppShell()
  const overview = useAssetsHubOverviewStats()
  const [hideZero, setHideZero] = useState(false)

  const modes = ASSET_MODES.filter((key) => {
    if (!hideZero) return true
    return overview.modes[key].hasBalance
  })

  return (
    <>
      <WidgetHeader
        action={
          <div className="flex items-center gap-2 max-dapp:hidden">
            <AssetsHubFilterMenu
              align="end"
              ariaLabel={t.assets.hub.filterAria}
              hideZero={hideZero}
              hideZeroLabel={t.assets.hub.hideZero}
              onHideZeroChange={setHideZero}
            />
            <PanelToggle />
          </div>
        }
        subtitle={t.assets.intro}
        title={
          <>
            <span className="min-w-0">{t.assets.title}</span>
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
      <WidgetStack>
        {modes.map((key) => {
          const stats = overview.modes[key]
          const modeCopy = t.assets.hub.modes[key]
          return (
            <InteractiveCard
              aria-label={modeCopy.title}
              hitArea="overlay"
              key={key}
              onClick={() => openAssetsView(key)}
              tourId={key === 'stake' ? 'asset-mode-stake' : undefined}
            >
              <div className="pointer-events-none relative z-10 grid gap-2">
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                  <div className="flex min-w-0 items-center gap-1">
                    <Icon alt="" size="xl" src={ASSET_MODE_ICONS[key]} />
                    <Text as="span" className="font-semibold wrap-break-word" variant="detail">
                      {modeCopy.title}
                    </Text>
                  </div>
                  <div className="pointer-events-auto flex items-center gap-1">
                    <Text as="span" className="wrap-break-word" variant="copy">
                      <CountValue animate={false} text={stats.aprLabel} />
                    </Text>
                    <Tooltip.Info
                      className="size-3 text-foreground [&_svg]:size-3"
                      content={modeCopy.aprHint}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-1">
                  <Text as="span" className="text-foreground/40" variant="copy">
                    {t.assets.hub.card.position}
                  </Text>
                  <Text as="span" className="justify-self-end text-foreground/40" variant="copy">
                    {t.assets.hub.card.yield}
                  </Text>

                  <Text as="strong" className="font-semibold" variant="detail">
                    <CountValue text={stats.positionValue} />
                  </Text>
                  <Text
                    as="strong"
                    className="justify-self-end font-semibold"
                    tone="primary"
                    variant="detail"
                  >
                    <CountValue text={stats.yieldValue} />
                  </Text>

                  <Text as="span" className="text-foreground/40" variant="copy">
                    <CountValue animate={false} text={stats.positionApprox} />
                  </Text>
                  <Text as="span" className="justify-self-end text-foreground/40" variant="copy">
                    <CountValue animate={false} text={stats.yieldApprox} />
                  </Text>
                </div>
              </div>
            </InteractiveCard>
          )
        })}

        {walletReady && hideZero && modes.length === 0 ? (
          <Table.Empty embedded title={t.assets.hub.hideZeroEmpty} />
        ) : null}

        {!walletReady ? <WidgetConnectPromo /> : null}
      </WidgetStack>
    </>
  )
}
