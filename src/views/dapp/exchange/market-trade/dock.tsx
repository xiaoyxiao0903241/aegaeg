/**
 * 市价交易左栏 Dock
 *
 * 卖出 / 买入代币可下拉选择，中间可翻转方向；信息行展示汇率
 * （可反向）、滑点设置、价格影响与预估 Gas。滑点通过弹窗修改，
 * 高价格影响时给出告警。
 */
import { dappAssets } from '~/shared/assets/dapp'
import { CountValue } from '~/shared/components/count-value'
import { FormActions } from '~/shared/components/form-actions'
import { FormInfoCard } from '~/shared/components/form-info-card'
import { Icon } from '~/shared/components/icon'
import { InlineAlert } from '~/shared/components/inline-alert'
import { MainButton } from '~/shared/components/main-button'
import { Tooltip } from '~/shared/components/tooltip'
import { cn } from '~/shared/lib/utils'
import { formatNumber } from '~/shared/presenters/format'
import type { MarketTradeState } from '~/views/dapp/exchange/exchange-session-hosts'
import {
  ExchangeSlippageModal,
  ExchangeTokenPicker,
} from '~/views/dapp/exchange/market-trade/primitives'
import { useMarketTradeDock } from '~/views/dapp/exchange/market-trade/use-market-trade'
import {
  ExchangeAmountFlow,
  ExchangeFlipGlyph,
  ExchangeFlowButton,
  exchangeProviderMetaRow,
} from '~/views/dapp/exchange/primitives'
import { DockConnectPromo } from '~/views/dapp/shared/dock-connect-promo'
import { DockStack } from '~/views/dapp/shared/dock-frame'
import { TabHeader } from '~/views/dapp/shared/tab-header'

export function MarketTradeDock({ trade }: { trade: MarketTradeState }) {
  const vm = useMarketTradeDock(trade)
  const { t, pair } = vm

  return (
    <>
      <TabHeader
        backText={t.exchange.backToHub}
        onBack={vm.onBack}
        subtitle={t.exchange.trade.intro}
        title={t.exchange.trade.title}
      >
        <DockStack className="gap-0">
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
                    <ExchangeFlipGlyph rotation={vm.rotation} />
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

          <FormInfoCard className="mt-3.5 max-dapp:mt-3">
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
                        <Icon alt="" size="xs" src={dappAssets.settingPrimary} />
                      </button>
                    </>
                  ),
                  valueClassName: 'inline-flex items-center justify-end gap-1',
                },
                ...(vm.sessionReady && trade.sellAmount.trim().length > 0
                  ? [
                      {
                        label: t.exchange.trade.priceImpact,
                        value:
                          trade.priceImpactLabel || formatNumber(0, { digits: 2, suffix: '%' }),
                      },
                      {
                        label: t.exchange.trade.estimatedGas,
                        value: trade.gasEstimateLabel || '—',
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

          <InlineAlert className="mt-3" open={vm.sessionReady && trade.isHighPriceImpact}>
            {t.exchange.trade.highPriceImpactWarning}
          </InlineAlert>

          {vm.sessionReady && trade.walletReady ? (
            <FormActions className="mt-3.5 max-dapp:mt-3">
              <MainButton
                className="col-span-full"
                density="external"
                disabled={!trade.canSubmit}
                loading={trade.isSubmitting}
                onClick={() => void vm.onSubmit()}
              >
                {t.exchange.trade.action}
              </MainButton>
            </FormActions>
          ) : (
            <DockConnectPromo className="mt-3.5" />
          )}
        </DockStack>
      </TabHeader>

      <ExchangeSlippageModal
        onConfirm={trade.setSlippage}
        onOpenChange={vm.setSlippageOpen}
        open={vm.slippageOpen}
        slippage={trade.slippage}
      />
    </>
  )
}
