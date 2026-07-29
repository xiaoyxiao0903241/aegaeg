import { useI18n } from '~/i18n/use-i18n'
import { stakingHubAssets } from '~/app/assets'
import { openAssetsView } from '~/shared/config/open-assets-view'
import { ExchangeModeCard } from '~/views/dapp/exchange/hub/exchange-mode-card'
import {
  ExchangePanelToggle,
  ExchangeWidgetBody,
} from '~/views/dapp/exchange/exchange-widget-composites'
import { WidgetHeader } from '~/shared/ui/widget-header'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { useDappShell } from '~/app/use-dapp-shell'
import { Text } from '~/shared/ui/text'

export function AssetsHubWidget() {
  const { messages: t } = useI18n()
  const { walletReady } = useDappShell()

  return (
    <>
      <WidgetHeader
        action={<ExchangePanelToggle />}
        subtitle={t.assets.intro}
        title={t.assets.title}
      />
      <ExchangeWidgetBody>
        <ExchangeModeCard
          body={t.assets.hub.modes.stake.body}
          icon={stakingHubAssets.modeStake}
          onClick={() => openAssetsView('stake')}
          title={t.assets.hub.modes.stake.title}
        />
        <ExchangeModeCard
          body={t.assets.hub.modes.lpbond.body}
          icon={stakingHubAssets.modeLpBond}
          onClick={() => openAssetsView('lpbond')}
          title={t.assets.hub.modes.lpbond.title}
        />
        <ExchangeModeCard
          body={t.assets.hub.modes.burnbond.body}
          icon={stakingHubAssets.modeBurnBond}
          onClick={() => openAssetsView('burnbond')}
          title={t.assets.hub.modes.burnbond.title}
        />
        <ExchangeModeCard
          body={t.assets.hub.modes.xmine.body}
          icon={stakingHubAssets.modeXmine}
          onClick={() => openAssetsView('xmine')}
          title={t.assets.hub.modes.xmine.title}
        />
        {!walletReady ? (
          <DappWidgetConnectPromo />
        ) : (
          <Text as="p" tone="muted-foreground" variant="copy">
            {t.assets.hub.emptyHint}
          </Text>
        )}
      </ExchangeWidgetBody>
    </>
  )
}
