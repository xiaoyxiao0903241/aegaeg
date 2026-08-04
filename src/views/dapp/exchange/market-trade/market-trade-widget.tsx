import { Settings } from 'lucide-react'

import { dappAssets, flashExchangeAssets } from '~/app/assets'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappActionRow } from '~/app/shell/dapp-action-row'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { Card } from '~/shared/components/card'
import { CountValue } from '~/shared/components/count-value'
import { Icon } from '~/shared/components/icon'
import { InlineAlert } from '~/shared/components/inline-alert'
import { List } from '~/shared/components/list'
import { Tooltip } from '~/shared/components/tooltip'
import { cn } from '~/shared/lib/utils'
import { ExchangeAmountFlow } from '~/views/dapp/exchange/exchange-amount-flow'
import { ExchangeFlowButton } from '~/views/dapp/exchange/exchange-flow-button'
import { exchangeProviderMetaRow } from '~/views/dapp/exchange/exchange-provider-meta-value'
import type { MarketTradeState } from '~/views/dapp/exchange/exchange-session-hosts'
import { ExchangeSlippageModal } from '~/views/dapp/exchange/market-trade/exchange-slippage-modal'
import { ExchangeTokenPicker } from '~/views/dapp/exchange/market-trade/exchange-token-picker'
import { useMarketTradeView } from '~/views/dapp/exchange/market-trade/use-market-trade-view'

export function MarketTradeWidget({ trade }: { trade: MarketTradeState }) {
  const vm = useMarketTradeView(trade)
  const { t, pair } = vm

  return (
    <>
      <DappTabHeader
        backText={t.exchange.backToHub}
        onBack={vm.onBack}
        subtitle={t.exchange.trade.intro}
        title={t.exchange.trade.title}
      />
      <DappWidgetStack className="gap-0">
        <ExchangeAmountFlow
          amountBoxClassName={vm.flipCardClass}
          buy={pair.buy}
          buyAmount={trade.buyAmount}
          buyBalance={vm.buyLabel}
          middleSlot={
            <div
              className={cn(
                'flex items-center justify-center py-1.5',
                'max-dapp:h-auto max-dapp:py-0 max-dapp:drop-shadow-card',
              )}
            >
              <Tooltip content={t.exchange.flip}>
                <ExchangeFlowButton
                  aria-label={t.exchange.flip}
                  className="max-dapp:my-2"
                  disabled={vm.sessionReady && (!trade.walletReady || trade.isSubmitting)}
                  interactive
                  onClick={vm.onFlip}
                >
                  <span
                    className="duration-dapp-emphasis grid place-items-center transition-transform ease-dapp"
                    style={{ transform: `rotate(${vm.rotation}deg)` }}
                  >
                    <span className="grid size-4 place-items-center">
                      <span className="-rotate-90">
                        <Icon alt="" size="base" src={flashExchangeAssets.flowDivider} />
                      </span>
                    </span>
                  </span>
                </ExchangeFlowButton>
              </Tooltip>
            </div>
          }
          onFillPercent={(percent) => trade.fillPercent(percent)}
          onSellAmountChange={trade.setSellAmount}
          sell={pair.sell}
          sellAmountDisplay={trade.sellAmountDisplay}
          sellBalance={vm.sellLabel}
          sellTokenAdornment={
            <ExchangeTokenPicker
              ariaLabel={t.exchange.trade.selectSellToken}
              checkIcon={dappAssets.check}
              disabled={vm.pickDisabled}
              onSelect={(key) => vm.handleTokenPick('sell', key)}
              options={vm.sellPickerOptions}
              value={pair.sell.key}
            />
          }
          buyTokenAdornment={
            <ExchangeTokenPicker
              ariaLabel={t.exchange.trade.selectBuyToken}
              checkIcon={dappAssets.check}
              disabled={vm.pickDisabled}
              onSelect={(key) => vm.handleTokenPick('buy', key)}
              options={vm.buyPickerOptions}
              value={pair.buy.key}
            />
          }
          sessionReady={vm.sessionReady}
          walletReady={trade.walletReady}
          amountLocked={trade.isSubmitting || vm.isFlipping}
        />

        <Card as="div" className="mt-3.5 max-dapp:mt-3" surface="outlined">
          <List
            items={[
              {
                label: t.exchange.exchangePrice,
                value: (
                  <>
                    <CountValue text={vm.exchangePriceDisplayLabel || '0'} />
                    <Tooltip content={t.exchange.flip}>
                      <button
                        aria-label={t.exchange.flip}
                        className="duration-dapp-fast grid size-4 shrink-0 cursor-pointer place-items-center rounded-md border-0 bg-transparent p-0 transition-opacity ease-out hover:opacity-80"
                        onClick={vm.onTogglePriceInverted}
                        type="button"
                      >
                        <Icon alt="" size="xs" src={dappAssets.exchangeFlip} />
                      </button>
                    </Tooltip>
                  </>
                ),
                valueClassName: 'inline-flex items-center justify-end gap-1',
              },
              {
                label: t.exchange.allowedSlippage,
                value: (
                  <>
                    <CountValue text={`${trade.slippage}%`} />
                    <button
                      aria-label={t.exchange.slippageSettings}
                      className={cn(
                        'duration-dapp-fast grid size-4 shrink-0 cursor-pointer place-items-center rounded-md border-0 bg-transparent p-0 transition-opacity ease-out hover:opacity-80',
                        vm.sessionReady && !trade.walletReady && 'pointer-events-none opacity-40',
                      )}
                      disabled={vm.sessionReady && !trade.walletReady}
                      onClick={() => vm.setSlippageOpen(true)}
                      type="button"
                    >
                      <Settings
                        aria-hidden
                        className="size-(--app-icon-xs) text-primary"
                        strokeWidth={1.5}
                      />
                    </button>
                  </>
                ),
                valueClassName: 'inline-flex items-center justify-end gap-1',
              },
              ...(vm.sessionReady && trade.sellAmount.trim().length > 0
                ? [
                    {
                      label: t.exchange.trade.priceImpact,
                      value: trade.priceImpactLabel || '0',
                    },
                    {
                      label: t.exchange.trade.estimatedGas,
                      value: trade.gasEstimateLabel || '0',
                    },
                  ]
                : []),
              {
                label: t.exchange.route,
                value: trade.routeLabel,
              },
              exchangeProviderMetaRow({
                label: t.exchange.provider,
                name: t.exchange.providerName,
                ariaLabel: t.exchange.openPancakeSwap,
                onOpen: vm.onOpenPancakeSwap,
                iconSrc: dappAssets.arrowUpRight,
              }),
            ]}
          />
        </Card>

        {vm.sessionReady && trade.isHighPriceImpact ? (
          <InlineAlert className="mt-3">{t.exchange.trade.highPriceImpactWarning}</InlineAlert>
        ) : null}

        {vm.sessionReady && trade.walletReady ? (
          <DappActionRow className="mt-3.5 max-dapp:mt-3">
            <DappActionButton
              className="col-span-full"
              density="external"
              disabled={!trade.canSubmit}
              loading={trade.isSubmitting}
              onClick={() => void vm.onSubmit()}
            >
              {t.exchange.trade.action}
            </DappActionButton>
          </DappActionRow>
        ) : (
          <DappWidgetConnectPromo className="mt-3.5" />
        )}
      </DappWidgetStack>

      <ExchangeSlippageModal
        onConfirm={trade.setSlippage}
        onOpenChange={vm.setSlippageOpen}
        open={vm.slippageOpen}
        slippage={trade.slippage}
      />
    </>
  )
}
