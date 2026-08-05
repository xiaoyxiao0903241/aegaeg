/**
 * 兑换中心（DApp 内子视图入口）
 *
 * 按当前子视图把交互面板（Widget）与详情面板（Content）分发到
 * Hub / 闪电兑换 / 市价交易 / 销毁 / Turbine 五个页面；
 * 各模式的会话状态由外部注入，金额草稿保留在交互面板侧。
 */
import { useDappSubviewDisplayView } from '~/app/shell/dapp-subview-panel'
import { DappTabDetailShell, DappTabWidgetShell } from '~/app/shell/dapp-tab-panel-shell'
import type { ExchangeView } from '~/shared/config/dapp-deep-links'
import { useExchangeViewMotion } from '~/stores/exchange-view-store'
import { BurnExchangeDetail } from '~/views/dapp/exchange/burn/burn-exchange-detail'
import { BurnExchangeWidget } from '~/views/dapp/exchange/burn/burn-exchange-widget'
import type {
  BurnExchangeState,
  FlashExchangeState,
  MarketTradeState,
  TurbineExchangeState,
} from '~/views/dapp/exchange/exchange-session-hosts'
import { FlashExchangeDetail } from '~/views/dapp/exchange/flash-exchange/flash-exchange-detail'
import { FlashExchangeWidget } from '~/views/dapp/exchange/flash-exchange/flash-exchange-widget'
import { ExchangeDetail } from '~/views/dapp/exchange/hub/exchange-detail'
import { ExchangeHubWidget } from '~/views/dapp/exchange/hub/exchange-hub-widget'
import { MarketTradeDetail } from '~/views/dapp/exchange/market-trade/market-trade-detail'
import { MarketTradeWidget } from '~/views/dapp/exchange/market-trade/market-trade-widget'
import { TurbineExchangeDetail } from '~/views/dapp/exchange/turbine/turbine-exchange-detail'
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

// 详情面板只接收展示用标量，金额草稿留在交互面板，避免输入抖动刷新 FAQ / 代币介绍
function ExchangeContentBody({ trade, flash, burn, turbine }: ExchangeSessions) {
  const view = useDappSubviewDisplayView<ExchangeView>()
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
  return <ExchangeDetail />
}

export function ExchangeWidget(sessions: ExchangeSessions) {
  const subview = useExchangeViewMotion()
  return (
    <DappTabWidgetShell subview={subview}>
      <ExchangeWidgetBody {...sessions} />
    </DappTabWidgetShell>
  )
}

export function ExchangeContent(sessions: ExchangeSessions) {
  const subview = useExchangeViewMotion()
  return (
    <DappTabDetailShell subview={subview}>
      <ExchangeContentBody {...sessions} />
    </DappTabDetailShell>
  )
}
