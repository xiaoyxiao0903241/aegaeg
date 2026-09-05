/**
 * 市价交易左栏 Dock
 *
 * 卖出可选 USD1 / AGX / X；买入随卖出变化（USD1↔AGX，X 可买 USD1 或 AGX）。
 * 买入只有一个时不下拉。卖出为 X 时禁用翻转。信息行展示汇率、滑点、价格影响与预估 Gas。
 */
import { dappAssets } from '~/shared/assets/dapp'
import { CountValue } from '~/shared/components/count-value'
import { FormActions } from '~/shared/components/form-actions'
import { FormInfoCard } from '~/shared/components/form-info-card'
import { Icon } from '~/shared/components/icon'
import { InlineAlert } from '~/shared/components/inline-alert'
import { Tooltip } from '~/shared/components/tooltip'
import { cn } from '~/shared/lib/utils'
import type { MarketTradeState } from '~/views/dapp/exchange/exchange-session-hosts'
import { ExchangeTokenPicker } from '~/views/dapp/exchange/market-trade/primitives'
import { ExchangeSlippagePanel } from '~/views/dapp/exchange/market-trade/slippage-panel'
import { useMarketTradeDock } from '~/views/dapp/exchange/market-trade/use-market-trade'
import {
  ExchangeAmountFlow,
  ExchangeFlipGlyph,
  ExchangeFlowButton,
  exchangeProviderMetaRow,
} from '~/views/dapp/exchange/primitives'
import { DockConnectPromo } from '~/views/dapp/shared/dock-connect-promo'
import { DockStack } from '~/views/dapp/shared/dock-frame'
import { SessionButton } from '~/views/dapp/shared/session-button'
import { TabHeader } from '~/views/dapp/shared/tab-header'

export function MarketTradeDock({ trade }: { trade: MarketTradeState }) {
  const vm = useMarketTradeDock(trade)
  const { t, pair } = vm

  return (
    <TabHeader
      backText={t.exchange.backToHub}
      onBack={vm.onBack}
      subtitle={t.exchange.trade.intro}
      title={t.exchange.trade.title}
    >
      <DockStack>
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
              <Tooltip content={vm.flipTooltip}>
                <span className="inline-flex">
                  <ExchangeFlowButton
                    aria-label={vm.flipTooltip}
                    className="max-dapp:my-2"
                    disabled={vm.flipDisabled}
                    interactive
                    onClick={vm.onFlip}
                  >
                    <ExchangeFlipGlyph rotation={vm.rotation} />
                  </ExchangeFlowButton>
                </span>
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
          amountLocked={trade.isSubmitting || vm.isFlipping}
        />

        <FormInfoCard>
          <FormInfoCard.Rows
            items={[
              {
                label: t.exchange.exchangePrice,
                value: (
                  <>
                    <CountValue text={vm.exchangePriceDisplayLabel} />
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
                  <ExchangeSlippagePanel
                    autoPercent={trade.autoSlippagePercent}
                    customText={trade.slippageCustomText}
                    mode={trade.slippageMode}
                    onCustomTextChange={trade.setSlippageCustomText}
                    onModeChange={trade.setSlippageMode}
                    slippage={trade.slippage}
                  />
                ),
                valueClassName: 'inline-flex items-center justify-end gap-1',
              },
              ...(vm.sessionReady && trade.sellAmount.trim().length > 0
                ? [
                    {
                      label: t.exchange.trade.priceImpact,
                      value: <CountValue text={trade.priceImpactLabel} />,
                    },
                    {
                      label: t.exchange.trade.estimatedGas,
                      value: <CountValue text={trade.gasEstimateLabel} />,
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
        </FormInfoCard>

        {vm.sessionReady && trade.isHighPriceImpact ? (
          <InlineAlert open tone="notice">
            {t.exchange.trade.highPriceImpactWarning}
          </InlineAlert>
        ) : null}

        <FormActions>
          <SessionButton
            className="col-span-full"
            density="external"
            disabled={!trade.canSubmit}
            loading={trade.isSubmitting}
            onClick={() => void vm.onSubmit()}
          >
            {t.exchange.trade.action}
          </SessionButton>
        </FormActions>
        {!trade.walletReady ? <DockConnectPromo /> : null}
      </DockStack>
    </TabHeader>
  )
}
