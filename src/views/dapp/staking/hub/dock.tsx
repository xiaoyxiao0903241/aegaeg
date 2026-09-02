import { useI18n } from '~/i18n/use-i18n'
import { stakingHubAssets } from '~/shared/assets/dapp'
import { StatusBadge } from '~/shared/components/badge'
import { ModeCard } from '~/shared/components/mode-card'
import { isXmineSubviewClosed, type StakingView } from '~/shared/config/dapp-deep-links'
import { DockFrame } from '~/views/dapp/shared/dock-frame'
import { withEpochSchedule } from '~/views/dapp/shared/epoch-schedule'
import { openStakingView } from '~/views/dapp/shared/navigation'
import { useEpochScheduleLabels } from '~/web3/staking/use-staking-queries'

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
 * 展示五种质押模式的入口卡片；X 挖矿暂时不可点，标「即将推出」。
 */
export function StakingHubDock() {
  const { messages: t } = useI18n()
  const copy = t.staking.hub.modes
  const epochSchedule = useEpochScheduleLabels()

  return (
    <DockFrame
      subtitle={t.staking.intro}
      title={t.staking.title}
      titleClassName="text-xl/none tracking-normal"
    >
      {STAKING_MODES.map((mode) => {
        const { title, body } = copy[mode.view]
        const closed = isXmineSubviewClosed(mode.view)
        return (
          <ModeCard
            key={mode.view}
            onClick={closed ? undefined : () => openStakingView(mode.view)}
            tourId={mode.tourId}
          >
            <ModeCard.Icon src={mode.icon} />
            <ModeCard.Copy>
              <span className="flex flex-wrap items-center gap-1.5">
                <ModeCard.Title>{title}</ModeCard.Title>
                {closed ? (
                  <StatusBadge size="compact" tone="pending">
                    {t.common.comingSoon}
                  </StatusBadge>
                ) : null}
              </span>
              <ModeCard.Body>{withEpochSchedule(body, epochSchedule)}</ModeCard.Body>
            </ModeCard.Copy>
          </ModeCard>
        )
      })}
    </DockFrame>
  )
}
