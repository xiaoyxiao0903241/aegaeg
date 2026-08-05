import { useI18n } from '~/i18n/use-i18n'
import { ModeCard } from '~/shared/components/mode-card'
import { stakingHubAssets } from '~/shared/config/assets'
import type { StakingView } from '~/shared/config/dapp-deep-links'
import { openStakingView } from '~/shared/config/dapp-open-views'
import { DockFrame } from '~/views/dapp/shared/dock-frame'

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
    <DockFrame
      subtitle={t.staking.intro}
      title={t.staking.title}
      titleClassName="text-xl/none tracking-normal"
    >
      {STAKING_MODES.map((mode) => {
        const { title, body } = copy[mode.view]
        return (
          <ModeCard key={mode.view} onClick={() => openStakingView(mode.view)} tourId={mode.tourId}>
            <ModeCard.Icon src={mode.icon} />
            <ModeCard.Copy>
              <ModeCard.Title>{title}</ModeCard.Title>
              <ModeCard.Body>{body}</ModeCard.Body>
            </ModeCard.Copy>
          </ModeCard>
        )
      })}
    </DockFrame>
  )
}
