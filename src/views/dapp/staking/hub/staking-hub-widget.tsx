import { stakingHubAssets } from '~/app/assets'
import { DappModeCard } from '~/app/shell/dapp-mode-card'
import { DappPanelToggle } from '~/app/shell/dapp-panel-toggle'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { useI18n } from '~/i18n/use-i18n'
import { openStakingView } from '~/shared/config/dapp-open-views'
import { WidgetHeader } from '~/shared/ui/widget-header'

export function StakingHubWidget() {
  const { messages: t } = useI18n()

  return (
    <>
      <WidgetHeader
        action={<DappPanelToggle />}
        className="mb-4 [&_h1]:text-xl/normal [&_h1]:tracking-normal"
        subtitle={t.staking.intro}
        title={t.staking.title}
      />
      <DappWidgetStack>
        <DappModeCard
          body={t.staking.hub.modes.stake.body}
          icon={stakingHubAssets.modeStake}
          onClick={() => openStakingView('stake')}
          title={t.staking.hub.modes.stake.title}
          tourId="stake-mode-stake"
        />
        <DappModeCard
          body={t.staking.hub.modes.lpbond.body}
          icon={stakingHubAssets.modeLpBond}
          onClick={() => openStakingView('lpbond')}
          title={t.staking.hub.modes.lpbond.title}
        />
        <DappModeCard
          body={t.staking.hub.modes.burnbond.body}
          icon={stakingHubAssets.modeBurnBond}
          onClick={() => openStakingView('burnbond')}
          title={t.staking.hub.modes.burnbond.title}
        />
        <DappModeCard
          body={t.staking.hub.modes.xmine.body}
          icon={stakingHubAssets.modeXmine}
          onClick={() => openStakingView('xmine')}
          title={t.staking.hub.modes.xmine.title}
        />
        <DappModeCard
          body={t.staking.hub.modes.calc.body}
          icon={stakingHubAssets.modeCalc}
          onClick={() => openStakingView('calc')}
          title={t.staking.hub.modes.calc.title}
        />
      </DappWidgetStack>
    </>
  )
}
