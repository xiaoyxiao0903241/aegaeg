import { exchangeHubAssets } from '~/app/assets'
import { DappModeCard } from '~/app/shell/dapp-mode-card'
import { DappPanelToggle } from '~/app/shell/dapp-panel-toggle'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { useI18n } from '~/i18n/use-i18n'
import { WidgetHeader } from '~/shared/components/widget-header'
import { openExchangeView } from '~/shared/config/dapp-open-views'

export function ExchangeHubWidget() {
  const { messages: t } = useI18n()

  return (
    <>
      <WidgetHeader
        action={<DappPanelToggle className="rounded-[length:var(--radius-control)]" />}
        className="mb-4"
        subtitle={t.exchange.intro}
        title={t.exchange.title}
        titleClassName="text-xl leading-(--type-headline-leading) tracking-normal"
      />
      <DappWidgetStack>
        <DappModeCard
          body={t.exchange.hub.modes.flash.body}
          density="tall"
          icon={exchangeHubAssets.modeFlash}
          onClick={() => openExchangeView('flash')}
          title={t.exchange.hub.modes.flash.title}
        />
        <DappModeCard
          body={t.exchange.hub.modes.trade.body}
          density="compact"
          icon={exchangeHubAssets.modeTrade}
          onClick={() => openExchangeView('trade')}
          title={t.exchange.hub.modes.trade.title}
          tourId="swap-trade"
        />
        <DappModeCard
          body={t.exchange.hub.modes.burn.body}
          density="compact"
          icon={exchangeHubAssets.modeBurn}
          onClick={() => openExchangeView('burn')}
          title={t.exchange.hub.modes.burn.title}
        />
        <DappModeCard
          body={t.exchange.hub.modes.turbine.body}
          density="compact"
          icon={exchangeHubAssets.modeTurbine}
          onClick={() => openExchangeView('turbine')}
          title={t.exchange.hub.modes.turbine.title}
          tourId="swap-turbine"
        />
      </DappWidgetStack>
    </>
  )
}
