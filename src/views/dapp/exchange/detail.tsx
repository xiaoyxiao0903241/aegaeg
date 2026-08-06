/**
 * 兑换右栏 Detail：按子视图分发会话展示标量到各 mode。
 */
import type { ExchangeView } from '~/shared/config/dapp-deep-links'
import { useExchangeViewMotion } from '~/stores/exchange-view-store'
import { BurnExchangeDetail } from '~/views/dapp/exchange/burn/detail'
import {
  type ExchangeSessions,
  requireBurn,
  requireFlash,
  requireTrade,
  requireTurbine,
} from '~/views/dapp/exchange/exchange-session-hosts'
import { FlashExchangeDetail } from '~/views/dapp/exchange/flash-exchange/detail'
import { ExchangeHubDetail } from '~/views/dapp/exchange/hub/detail'
import { MarketTradeDetail } from '~/views/dapp/exchange/market-trade/detail'
import { TurbineExchangeDetail } from '~/views/dapp/exchange/turbine/detail'
import { useSubviewView } from '~/views/dapp/shared/subview-panel'
import { TabDetailHost } from '~/views/dapp/shared/tab-host'

function ExchangeDetailBody({ trade, flash, burn, turbine }: ExchangeSessions) {
  const view = useSubviewView<ExchangeView>()
  if (view === 'flash') {
    const session = requireFlash(flash)
    return <FlashExchangeDetail overviewRateLabel={session.overviewRateLabel} />
  }
  if (view === 'trade') {
    const session = requireTrade(trade)
    return <MarketTradeDetail exchangePriceLabel={session.exchangePriceLabel} />
  }
  if (view === 'burn') {
    const session = requireBurn(burn)
    return (
      <BurnExchangeDetail
        overviewRateLabel={session.overviewRateLabel}
        walletReady={session.walletReady}
        config={session.config}
        userStats={session.userStats}
      />
    )
  }
  if (view === 'turbine') {
    const session = requireTurbine(turbine)
    const { overview } = session
    return (
      <TurbineExchangeDetail
        pendingUnlockLabel={overview.pendingUnlockLabel}
        pendingUnlockUsdHint={overview.pendingUnlockUsdHint}
        coolingLabel={overview.coolingLabel}
        coolingUsdHint={overview.coolingUsdHint}
        totalWithdrawnLabel={overview.totalWithdrawnLabel}
        totalWithdrawnUsdHint={overview.totalWithdrawnUsdHint}
      />
    )
  }
  return <ExchangeHubDetail />
}

export function ExchangeDetail(sessions: ExchangeSessions) {
  const subview = useExchangeViewMotion()
  return (
    <TabDetailHost subview={subview}>
      <ExchangeDetailBody {...sessions} />
    </TabDetailHost>
  )
}
