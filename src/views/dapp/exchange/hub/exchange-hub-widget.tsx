import { useI18n } from '~/i18n/use-i18n'
import { exchangeHubAssets } from '~/app/assets'
import { openExchangeView } from '~/shared/config/open-exchange-view'
import { ExchangeModeCard } from '~/views/dapp/exchange/hub/exchange-mode-card'
import {
  ExchangePanelToggle,
  ExchangeWidgetBody,
} from '~/views/dapp/exchange/exchange-widget-composites'
import { WidgetHeader } from '~/shared/ui/widget-header'

export function ExchangeHubWidget() {
  const { messages: t } = useI18n()

  return (
    <>
      <WidgetHeader
        action={<ExchangePanelToggle />}
        subtitle={t.exchange.intro}
        title={t.exchange.title}
      />
      <ExchangeWidgetBody>
        <ExchangeModeCard
          body={t.exchange.hub.modes.flash.body}
          density="tall"
          icon={exchangeHubAssets.modeFlash}
          onClick={() => openExchangeView('flash')}
          title={t.exchange.hub.modes.flash.title}
        />
        <ExchangeModeCard
          body={t.exchange.hub.modes.trade.body}
          icon={exchangeHubAssets.modeTrade}
          onClick={() => openExchangeView('trade')}
          title={t.exchange.hub.modes.trade.title}
          tourId="swap-trade"
        />
        <ExchangeModeCard
          body={t.exchange.hub.modes.burn.body}
          icon={exchangeHubAssets.modeBurn}
          onClick={() => openExchangeView('burn')}
          title={t.exchange.hub.modes.burn.title}
        />
        <ExchangeModeCard
          body={t.exchange.hub.modes.turbine.body}
          icon={exchangeHubAssets.modeTurbine}
          onClick={() => openExchangeView('turbine')}
          title={t.exchange.hub.modes.turbine.title}
          tourId="swap-turbine"
        />
      </ExchangeWidgetBody>
    </>
  )
}
