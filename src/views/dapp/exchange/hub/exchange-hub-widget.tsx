import { useI18n } from '~/i18n/use-i18n'
import { exchangeHubAssets } from '~/app/assets'
import { useDappShell } from '~/app/use-dapp-shell'
import { useExchangeViewStore } from '~/stores/exchange-view-store'
import { ExchangeModeCard } from '~/views/dapp/exchange/hub/exchange-mode-card'
import {
  ExchangeGenesisFooter,
  ExchangePanelToggle,
  ExchangeWidgetBody,
} from '~/views/dapp/exchange/exchange-widget-composites'
import { WidgetHeader } from '~/shared/ui/widget-header'

export function ExchangeHubWidget({ onSelectGenesis }: { onSelectGenesis: () => void }) {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const setView = useExchangeViewStore((state) => state.setView)

  return (
    <>
      <WidgetHeader
        action={<ExchangePanelToggle />}
        subtitle={t.exchange.intro}
        title={t.exchange.title}
      />
      <ExchangeWidgetBody
        footer={
          sessionReady ? <ExchangeGenesisFooter onSelectGenesis={onSelectGenesis} /> : undefined
        }
      >
        <ExchangeModeCard
          body={t.exchange.hub.modes.flash.body}
          icon={exchangeHubAssets.modeFlash}
          onClick={() => setView('flash')}
          title={t.exchange.hub.modes.flash.title}
        />
        <ExchangeModeCard
          body={t.exchange.hub.modes.trade.body}
          icon={exchangeHubAssets.modeTrade}
          onClick={() => setView('trade')}
          title={t.exchange.hub.modes.trade.title}
        />
        <ExchangeModeCard
          badge={t.exchange.hub.modes.comingSoon}
          body={t.exchange.hub.modes.burn.body}
          icon={exchangeHubAssets.modeBurn}
          title={t.exchange.hub.modes.burn.title}
        />
        <ExchangeModeCard
          badge={t.exchange.hub.modes.comingSoon}
          body={t.exchange.hub.modes.turbine.body}
          icon={exchangeHubAssets.modeTurbine}
          title={t.exchange.hub.modes.turbine.title}
        />
      </ExchangeWidgetBody>
    </>
  )
}
