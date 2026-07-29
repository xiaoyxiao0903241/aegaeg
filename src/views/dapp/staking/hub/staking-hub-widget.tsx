import { useI18n } from '~/i18n/use-i18n'
import { stakingHubAssets } from '~/app/assets'
import { openStakingView } from '~/shared/config/open-staking-view'
import { ExchangeModeCard } from '~/views/dapp/exchange/hub/exchange-mode-card'
import {
  ExchangePanelToggle,
  ExchangeWidgetBody,
} from '~/views/dapp/exchange/exchange-widget-composites'
import { WidgetHeader } from '~/shared/ui/widget-header'

export function StakingHubWidget() {
  const { messages: t } = useI18n()

  return (
    <>
      <WidgetHeader
        action={<ExchangePanelToggle />}
        subtitle={t.staking.intro}
        title={t.staking.title}
      />
      <ExchangeWidgetBody>
        <ExchangeModeCard
          body={t.staking.hub.modes.stake.body}
          icon={stakingHubAssets.modeStake}
          onClick={() => openStakingView('stake')}
          title={t.staking.hub.modes.stake.title}
        />
        <ExchangeModeCard
          body={t.staking.hub.modes.lpbond.body}
          icon={stakingHubAssets.modeLpBond}
          onClick={() => openStakingView('lpbond')}
          title={t.staking.hub.modes.lpbond.title}
        />
        <ExchangeModeCard
          body={t.staking.hub.modes.burnbond.body}
          icon={stakingHubAssets.modeBurnBond}
          onClick={() => openStakingView('burnbond')}
          title={t.staking.hub.modes.burnbond.title}
        />
        <ExchangeModeCard
          body={t.staking.hub.modes.xmine.body}
          icon={stakingHubAssets.modeXmine}
          onClick={() => openStakingView('xmine')}
          title={t.staking.hub.modes.xmine.title}
        />
        <ExchangeModeCard
          body={t.staking.hub.modes.calc.body}
          icon={stakingHubAssets.modeCalc}
          onClick={() => openStakingView('calc')}
          title={t.staking.hub.modes.calc.title}
        />
      </ExchangeWidgetBody>
    </>
  )
}
