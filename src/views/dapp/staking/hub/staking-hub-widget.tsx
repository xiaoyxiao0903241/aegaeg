import { stakingHubAssets } from '~/app/assets'
import { DappPanelToggle } from '~/app/shell/dapp-panel-toggle'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { useI18n } from '~/i18n/use-i18n'
import { Icon } from '~/shared/components/icon'
import { InteractiveCard } from '~/shared/components/interactive-card'
import { Text } from '~/shared/components/text'
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
export function StakingHubWidget() {
  const { messages: t } = useI18n()
  const copy = t.staking.hub.modes

  return (
    <>
      <WidgetHeader
        action={<DappPanelToggle />}
        className="mb-4 gap-4 [&_h1]:text-xl/none! [&_h1]:tracking-normal"
        subtitle={t.staking.intro}
        title={t.staking.title}
      />
      <DappWidgetStack>
        {STAKING_MODES.map((mode) => {
          const { title, body } = copy[mode.view]
          return (
            <InteractiveCard
              className="flex items-center gap-3"
              key={mode.view}
              onClick={() => openStakingView(mode.view)}
              tourId={mode.tourId}
            >
              <Icon alt="" size="xl" src={mode.icon} />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Text as="span" className="font-semibold" variant="detail">
                  {title}
                </Text>
                <Text as="p" className="m-0 text-foreground/40" variant="copy">
                  {body}
                </Text>
              </div>
            </InteractiveCard>
          )
        })}
      </DappWidgetStack>
    </>
  )
}
