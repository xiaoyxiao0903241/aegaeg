import type { ReactNode } from 'react'

import { useAppShell } from '~/app/use-app-shell'
import type { DappTab } from '~/shared/config/dapp-tabs'
import { useExchangeViewMotion } from '~/stores/exchange-view-store'
import { useBurnExchangeWidget } from '~/views/dapp/exchange/burn/use-burn-exchange-widget'
import { viewsNeedingProvider } from '~/views/dapp/exchange/exchange-views-needing-provider'
import { useFlashExchangeWidget } from '~/views/dapp/exchange/flash-exchange/use-flash-exchange-widget'
import { useMarketTradeWidget } from '~/views/dapp/exchange/market-trade/use-market-trade-widget'
import { useTurbineExchangeWidget } from '~/views/dapp/exchange/turbine/use-turbine-exchange-widget'

export type MarketTradeState = ReturnType<typeof useMarketTradeWidget>
export type FlashExchangeState = ReturnType<typeof useFlashExchangeWidget>
export type BurnExchangeState = ReturnType<typeof useBurnExchangeWidget>
export type TurbineExchangeState = ReturnType<typeof useTurbineExchangeWidget>

function MarketTradeSessionMounted({
  sessionReady,
  quotesEnabled,
  readsEnabled,
  children,
}: {
  sessionReady: boolean
  quotesEnabled: boolean
  readsEnabled: boolean
  children: (trade: MarketTradeState) => ReactNode
}) {
  const trade = useMarketTradeWidget(sessionReady, quotesEnabled, readsEnabled)
  return children(trade)
}

function FlashExchangeSessionMounted({
  sessionReady,
  quotesEnabled,
  readsEnabled,
  children,
}: {
  sessionReady: boolean
  quotesEnabled: boolean
  readsEnabled: boolean
  children: (flash: FlashExchangeState) => ReactNode
}) {
  const flash = useFlashExchangeWidget(sessionReady, quotesEnabled, readsEnabled)
  return children(flash)
}

function BurnExchangeSessionMounted({
  sessionReady,
  quotesEnabled,
  readsEnabled,
  children,
}: {
  sessionReady: boolean
  quotesEnabled: boolean
  readsEnabled: boolean
  children: (burn: BurnExchangeState) => ReactNode
}) {
  const burn = useBurnExchangeWidget(sessionReady, quotesEnabled, readsEnabled)
  return children(burn)
}

function TurbineExchangeSessionMounted({
  sessionReady,
  quotesEnabled,
  readsEnabled,
  children,
}: {
  sessionReady: boolean
  quotesEnabled: boolean
  readsEnabled: boolean
  children: (turbine: TurbineExchangeState) => ReactNode
}) {
  const turbine = useTurbineExchangeWidget(sessionReady, quotesEnabled, readsEnabled)
  return children(turbine)
}

/**
 * 把四个模式的会话 hook 各提升一次，再把状态作为 props 注入
 *
 * 挂载与读取跟随 viewsNeedingProvider：离开子视图即卸载对应
 * 会话，丢弃本地报价与提交状态。
 */
export function ExchangeSessionHosts({
  activeTab,
  children,
}: {
  activeTab: DappTab
  children: (sessions: {
    trade: MarketTradeState | null
    flash: FlashExchangeState | null
    burn: BurnExchangeState | null
    turbine: TurbineExchangeState | null
  }) => ReactNode
}) {
  const { sessionReady } = useAppShell()
  const { view, motion, outgoingView, incomingView } = useExchangeViewMotion()
  const exchangeTabActive = activeTab === 'exchange'
  const needed = viewsNeedingProvider(view, motion, outgoingView, incomingView)
  const idle = { flash: false, trade: false, burn: false, turbine: false } as const
  const mount = exchangeTabActive ? needed : idle
  const flashQuotesEnabled = mount.flash
  const tradeQuotesEnabled = mount.trade
  const burnQuotesEnabled = mount.burn
  const turbineQuotesEnabled = mount.turbine

  const renderWithTurbine = (
    trade: MarketTradeState | null,
    flash: FlashExchangeState | null,
    burn: BurnExchangeState | null,
  ) => {
    if (!mount.turbine) {
      return children({ trade, flash, burn, turbine: null })
    }
    return (
      <TurbineExchangeSessionMounted
        quotesEnabled={turbineQuotesEnabled}
        readsEnabled={mount.turbine}
        sessionReady={sessionReady}
      >
        {(turbine) => children({ trade, flash, burn, turbine })}
      </TurbineExchangeSessionMounted>
    )
  }

  const renderWithBurn = (trade: MarketTradeState | null, flash: FlashExchangeState | null) => {
    if (!mount.burn) {
      return renderWithTurbine(trade, flash, null)
    }
    return (
      <BurnExchangeSessionMounted
        quotesEnabled={burnQuotesEnabled}
        readsEnabled={mount.burn}
        sessionReady={sessionReady}
      >
        {(burn) => renderWithTurbine(trade, flash, burn)}
      </BurnExchangeSessionMounted>
    )
  }

  const renderWithFlash = (trade: MarketTradeState | null) => {
    if (!mount.flash) {
      return renderWithBurn(trade, null)
    }
    return (
      <FlashExchangeSessionMounted
        quotesEnabled={flashQuotesEnabled}
        readsEnabled={mount.flash}
        sessionReady={sessionReady}
      >
        {(flash) => renderWithBurn(trade, flash)}
      </FlashExchangeSessionMounted>
    )
  }

  if (!mount.trade) {
    return renderWithFlash(null)
  }

  return (
    <MarketTradeSessionMounted
      quotesEnabled={tradeQuotesEnabled}
      readsEnabled={mount.trade}
      sessionReady={sessionReady}
    >
      {(trade) => renderWithFlash(trade)}
    </MarketTradeSessionMounted>
  )
}
