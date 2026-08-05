import { stakingHubAssets } from '~/app/assets'
import { DockModeCard } from '~/app/shell/dock-mode-card'
import { PanelToggle } from '~/app/shell/panel-toggle'
import { WidgetStack } from '~/app/shell/widget-frame'
import { useI18n } from '~/i18n/use-i18n'
import { WidgetHeader } from '~/shared/components/widget-header'
import type { StakingView } from '~/shared/config/dapp-deep-links'
import { openStakingView } from '~/shared/config/dapp-open-views'

/** 质押 Hub 模式：质押 / LP 债券 / 燃烧债券 / XMine / 计算器 */
const STAKING_MODES: readonly {
  view: Exclude<StakingView, 'hub'>
  icon: string
  tourId?: string
}[] = [
  {
    view: 'stake',
    icon: stakingHubAssets.modeStake,
    tourId: 'stake-mode-stake',
  },
  { view: 'lpbond', icon: stakingHubAssets.modeLpBond },
  { view: 'burnbond', icon: stakingHubAssets.modeBurnBond },
  { view: 'xmine', icon: stakingHubAssets.modeXmine },
  { view: 'calc', icon: stakingHubAssets.modeCalc },
]

/**
 * 质押 Hub 左侧入口列表
 *
 * 展示五种质押模式的入口卡片，点击跳转到对应子视图。
 */
export function HubDock() {
  const { messages: t } = useI18n()
  const copy = t.staking.hub.modes

  return (
    <>
      <WidgetHeader
        action={<PanelToggle />}
        className="mb-4 gap-4 [&_h1]:text-xl/none! [&_h1]:tracking-normal"
        subtitle={t.staking.intro}
        title={t.staking.title}
      />
      <WidgetStack>
        {STAKING_MODES.map((mode) => {
          const { title, body } = copy[mode.view]
          return (
            <DockModeCard
              key={mode.view}
              onClick={() => openStakingView(mode.view)}
              tourId={mode.tourId}
            >
              <DockModeCard.Icon src={mode.icon} />
              <DockModeCard.Copy>
                <DockModeCard.Title>{title}</DockModeCard.Title>
                <DockModeCard.Body>{body}</DockModeCard.Body>
              </DockModeCard.Copy>
            </DockModeCard>
          )
        })}
      </WidgetStack>
    </>
  )
}
