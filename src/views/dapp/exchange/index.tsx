import { DappSubviewShell, useDappSubviewDisplayView } from '~/app/shell/dapp-subview-panel'
import type { ExchangeView } from '~/shared/config/dapp-deep-links'
import { useExchangeViewMotion } from '~/stores/exchange-view-store'
import { BurnExchangeContent } from '~/views/dapp/exchange/burn/burn-exchange-content'
import { BurnExchangeWidget } from '~/views/dapp/exchange/burn/burn-exchange-widget'
import type {
  BurnExchangeState,
  FlashExchangeState,
  MarketTradeState,
  TurbineExchangeState,
} from '~/views/dapp/exchange/exchange-session-hosts'
import { FlashExchangeContent } from '~/views/dapp/exchange/flash-exchange/flash-exchange-content'
import { FlashExchangeWidget } from '~/views/dapp/exchange/flash-exchange/flash-exchange-widget'
import { ExchangeHubContent } from '~/views/dapp/exchange/hub/exchange-hub-content'
import { ExchangeHubWidget } from '~/views/dapp/exchange/hub/exchange-hub-widget'
import { MarketTradeContent } from '~/views/dapp/exchange/market-trade/market-trade-content'
import { MarketTradeWidget } from '~/views/dapp/exchange/market-trade/market-trade-widget'
import { TurbineExchangeContent } from '~/views/dapp/exchange/turbine/turbine-exchange-content'
import { TurbineExchangeWidget } from '~/views/dapp/exchange/turbine/turbine-exchange-widget'

type ExchangeSessions = {
  trade: MarketTradeState | null
  flash: FlashExchangeState | null
  burn: BurnExchangeState | null
  turbine: TurbineExchangeState | null
}

function requireTrade(trade: MarketTradeState | null): MarketTradeState {
  if (!trade) {
    throw new Error('MarketTrade view requires a lifted trade session')
  }
  return trade
}

function requireFlash(flash: FlashExchangeState | null): FlashExchangeState {
  if (!flash) {
    throw new Error('FlashExchange view requires a lifted flash session')
  }
  return flash
}

function requireBurn(burn: BurnExchangeState | null): BurnExchangeState {
  if (!burn) {
    throw new Error('BurnExchange view requires a lifted burn session')
  }
  return burn
}

function requireTurbine(turbine: TurbineExchangeState | null): TurbineExchangeState {
  if (!turbine) {
    throw new Error('TurbineExchange view requires a lifted turbine session')
  }
  return turbine
}

function ExchangeWidgetBody({ trade, flash, burn, turbine }: ExchangeSessions) {
  const view = useDappSubviewDisplayView<ExchangeView>()
  if (view === 'flash') return <FlashExchangeWidget flash={requireFlash(flash)} />
  if (view === 'trade') return <MarketTradeWidget trade={requireTrade(trade)} />
  if (view === 'burn') return <BurnExchangeWidget burn={requireBurn(burn)} />
  if (view === 'turbine') return <TurbineExchangeWidget turbine={requireTurbine(turbine)} />
  return <ExchangeHubWidget />
}

function ExchangeContentBody({ trade, flash, burn, turbine }: ExchangeSessions) {
  const view = useDappSubviewDisplayView<ExchangeView>()
  if (view === 'flash') return <FlashExchangeContent flash={requireFlash(flash)} />
  if (view === 'trade') return <MarketTradeContent trade={requireTrade(trade)} />
  if (view === 'burn') return <BurnExchangeContent burn={requireBurn(burn)} />
  if (view === 'turbine') return <TurbineExchangeContent turbine={requireTurbine(turbine)} />
  return <ExchangeHubContent />
}

export function ExchangeWidget(sessions: ExchangeSessions) {
  const subview = useExchangeViewMotion()
  return (
    <DappSubviewShell
      className="flex min-h-full flex-col max-dapp:h-auto max-dapp:min-h-0"
      panel="widget"
      subview={subview}
    >
      <ExchangeWidgetBody {...sessions} />
    </DappSubviewShell>
  )
}

export function ExchangeContent(sessions: ExchangeSessions) {
  const subview = useExchangeViewMotion()
  return (
    <DappSubviewShell className="min-h-0" panel="detail" subview={subview}>
      <ExchangeContentBody {...sessions} />
    </DappSubviewShell>
  )
}
