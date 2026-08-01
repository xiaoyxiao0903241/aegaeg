import { exchangeHubAssets } from '~/app/assets'
import { DappModeCard } from '~/app/shell/dapp-mode-card'
import { DappPanelToggle } from '~/app/shell/dapp-panel-toggle'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { useI18n } from '~/i18n/use-i18n'
import { openExchangeView } from '~/shared/config/dapp-open-views'
import { WidgetHeader } from '~/shared/ui/widget-header'

export function ExchangeHubWidget() {
  const { messages: t } = useI18n()

  return (
    <>
      <WidgetHeader
        action={<DappPanelToggle />}
        className="mb-4 [&_h1]:text-xl/normal [&_h1]:tracking-normal"
        subtitle={t.exchange.intro}
        title={t.exchange.title}
      />
      <DappWidgetStack>
        <DappModeCard
          body={t.exchange.hub.modes.flash.body}
          icon={exchangeHubAssets.modeFlash}
          onClick={() => openExchangeView('flash')}
          title={t.exchange.hub.modes.flash.title}
        />
        <DappModeCard
          body={t.exchange.hub.modes.trade.body}
          icon={exchangeHubAssets.modeTrade}
          onClick={() => openExchangeView('trade')}
          title={t.exchange.hub.modes.trade.title}
          tourId="swap-trade"
        />
        <DappModeCard
          body={t.exchange.hub.modes.burn.body}
          icon={exchangeHubAssets.modeBurn}
          onClick={() => openExchangeView('burn')}
          title={t.exchange.hub.modes.burn.title}
        />
        <DappModeCard
          body={t.exchange.hub.modes.turbine.body}
          icon={exchangeHubAssets.modeTurbine}
          onClick={() => openExchangeView('turbine')}
          title={t.exchange.hub.modes.turbine.title}
          tourId="swap-turbine"
        />
      </DappWidgetStack>
    </>
  )
}
