/**
 * 兑换左栏 Dock：按子视图分发会话态到各 mode。
 */
import type { ExchangeView } from '~/shared/config/dapp-deep-links'
import { useExchangeViewMotion } from '~/stores/exchange-view-store'
import { BurnDock } from '~/views/dapp/exchange/burn/dock'
import {
  type ExchangeSessions,
  requireBurn,
  requireFlash,
  requireTrade,
  requireTurbine,
} from '~/views/dapp/exchange/exchange-session-hosts'
import { FlashExchangeDock } from '~/views/dapp/exchange/flash-exchange/dock'
import { HubDock } from '~/views/dapp/exchange/hub/dock'
import { MarketTradeDock } from '~/views/dapp/exchange/market-trade/dock'
import { TurbineDock } from '~/views/dapp/exchange/turbine/dock'
import { useSubviewDisplayView } from '~/views/dapp/shared/subview-panel'
import { TabDockShell } from '~/views/dapp/shared/tab-shell'

function ExchangeDockBody({ trade, flash, burn, turbine }: ExchangeSessions) {
  const view = useSubviewDisplayView<ExchangeView>()
  if (view === 'flash') return <FlashExchangeDock flash={requireFlash(flash)} />
  if (view === 'trade') return <MarketTradeDock trade={requireTrade(trade)} />
  if (view === 'burn') return <BurnDock burn={requireBurn(burn)} />
  if (view === 'turbine') return <TurbineDock turbine={requireTurbine(turbine)} />
  return <HubDock />
}

export function ExchangeDock(sessions: ExchangeSessions) {
  const subview = useExchangeViewMotion()
  return (
    <TabDockShell subview={subview}>
      <ExchangeDockBody {...sessions} />
    </TabDockShell>
  )
}
