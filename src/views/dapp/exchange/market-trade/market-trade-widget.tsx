import { useEffect, useEffectEvent, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '~/shared/lib/utils'
import { useI18n } from '~/i18n/use-i18n'
import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappActionRow } from '~/app/shell/dapp-action-row'
import { ExchangeSlippageModal } from '~/views/dapp/exchange/market-trade/exchange-slippage-modal'
import { ExchangeMetaValueSkeleton } from '~/app/shell/dapp-skeleton'
import { AnchoredTooltip } from '~/shared/ui/anchored-tooltip'
import { useDappShell } from '~/app/use-dapp-shell'
import type { MarketTradeState } from '~/views/dapp/exchange/exchange-session-hosts'
import { resolveExchangeUserFacingMessage } from '~/web3/resolve-contract-error-message'
import { presentUserFacingError } from '~/web3/present-user-facing-error'
import { openPancakeSwapDeepLink } from '~/shared/config/pancake-exchange-links'
import {
  ExchangeAmountFlow,
  ExchangeFlowButton,
  ExchangeGenesisFooter,
  ExchangeMetaPanel,
  ExchangeSubpageHeader,
  ExchangeWidgetBody,
  exchangeFlipCard,
  useExchangeBalanceLabels,
} from '~/views/dapp/exchange/exchange-widget-composites'
import { DappInlineAlert } from '~/shared/ui/dapp-inline-alert'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'

/**
 * Keep in sync with `exchange-card-flip` / `--motion-dapp-emphasis` (300ms) in theme.css.
 * Apply direction change mid-animation; settle after the flip completes.
 */
const EXCHANGE_FLIP_APPLY_MS = 160
const EXCHANGE_FLIP_SETTLE_MS = 320

export function MarketTradeWidget({
  onSelectGenesis,
  trade,
}: {
  onSelectGenesis: () => void
  trade: MarketTradeState
}) {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const [isFlipping, setIsFlipping] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [slippageOpen, setSlippageOpen] = useState(false)
  const [exchangePriceInverted, setExchangePriceInverted] = useState(false)

  const { pair } = trade
  const flipCardClass = exchangeFlipCard({ flipping: isFlipping })
  const showRateSkeleton = exchangePriceInverted
    ? trade.isExchangePriceInvertedQuoting && !trade.exchangePriceLabelInverted
    : trade.isExchangePriceQuoting && !trade.exchangePriceLabel
  const exchangePriceDisplayLabel = exchangePriceInverted
    ? trade.exchangePriceLabelInverted
    : trade.exchangePriceLabel
  const showBuyAmountSkeleton =
    sessionReady && trade.isQuoting && trade.sellAmount.trim().length > 0

  const { buyLabel, sellLabel } = useExchangeBalanceLabels({
    buyBalanceLabel: trade.buyBalanceLabel,
    isBalancesLoading: trade.isBalancesLoading,
    sellBalanceLabel: trade.sellBalanceLabel,
    sessionReady,
    walletReady: trade.walletReady,
  })

  function handleFlip() {
    if (sessionReady && !trade.walletReady) return
    if (isFlipping) return
    setIsFlipping(true)
    setRotation((prev) => prev + 180)
    window.setTimeout(() => {
      trade.flipDirection()
    }, EXCHANGE_FLIP_APPLY_MS)
    window.setTimeout(() => {
      setIsFlipping(false)
    }, EXCHANGE_FLIP_SETTLE_MS)
  }

  function resolveTradeMessage(error: unknown) {
    return resolveExchangeUserFacingMessage(
      error,
      {
        walletNotConnected: t.genesis.walletNotConnected,
        insufficientAllowance: t.genesis.insufficientAllowance,
        insufficientUsd1: t.genesis.insufficientUsd1,
        purchaseUnavailable: t.genesis.purchaseUnavailable,
        transactionCancelled: t.exchange.transactionCancelled,
        quoteFailed: t.errors.quoteFailed,
      },
      t.wallet.transactionErrors,
      t.errors.chain.fallback,
    )
  }

  async function handleSubmit() {
    const result = await trade.submit()
    if (result.ok) {
      toast.success(t.exchange.exchangeSuccess)
      return
    }
    if (result.error != null) {
      presentUserFacingError(result.error, resolveTradeMessage)
    }
  }

  // Quote/validation only — submit errors toast in handleSubmit so same sentinel re-fires.
  // quoteErrorUpdatedAt re-triggers when RQ fails again with the same EXCHANGE_QUOTE_FAILED sentinel.
  const presentValidationError = useEffectEvent((error: unknown) => {
    presentUserFacingError(error, resolveTradeMessage, {
      id: 'market-trade-quote-error',
    })
  })

  useEffect(() => {
    if (!trade.validationError) return
    presentValidationError(trade.validationError)
  }, [trade.quoteErrorUpdatedAt, trade.validationError])

  return (
    <>
      <ExchangeSubpageHeader subtitle={t.exchange.trade.intro} title={t.exchange.trade.title} />
      <ExchangeWidgetBody
        bodyClassName="gap-0"
        footer={
          sessionReady ? <ExchangeGenesisFooter onSelectGenesis={onSelectGenesis} /> : undefined
        }
      >
        <ExchangeAmountFlow
          amountBoxClassName={flipCardClass}
          buy={pair.buy}
          buyAmount={trade.buyAmount}
          buyBalance={buyLabel}
          middleSlot={
            <div
              className={cn(
                'flex items-center justify-center py-1.5',
                'max-dapp:h-auto max-dapp:py-0 max-dapp:drop-shadow-card',
              )}
            >
              <AnchoredTooltip content={t.exchange.flip}>
                <ExchangeFlowButton
                  aria-label={t.exchange.flip}
                  className="max-dapp:my-2"
                  disabled={sessionReady && (!trade.walletReady || trade.isSubmitting)}
                  interactive
                  onClick={handleFlip}
                >
                  <span
                    className="duration-dapp-emphasis grid place-items-center transition-transform ease-dapp"
                    style={{ transform: `rotate(${rotation}deg)` }}
                  >
                    ⇅
                  </span>
                </ExchangeFlowButton>
              </AnchoredTooltip>
            </div>
          }
          onFillPercent={(percent) => trade.fillPercent(percent)}
          onSellAmountChange={trade.setSellAmount}
          sell={pair.sell}
          sellAmountDisplay={trade.sellAmountDisplay}
          sellBalance={sellLabel}
          sessionReady={sessionReady}
          showBuyAmountSkeleton={showBuyAmountSkeleton}
          walletReady={trade.walletReady}
          amountLocked={trade.isSubmitting}
        />

        <ExchangeMetaPanel
          items={[
            {
              label: t.exchange.exchangePrice,
              value: showRateSkeleton ? (
                <ExchangeMetaValueSkeleton />
              ) : (
                <>
                  {exchangePriceDisplayLabel || t.exchange.ratePlaceholder}
                  <AnchoredTooltip content={t.exchange.flip}>
                    <button
                      aria-label={t.exchange.flip}
                      className="duration-dapp-fast grid size-6 shrink-0 cursor-pointer place-items-center rounded-md border-0 bg-transparent p-0 transition-opacity ease-out hover:opacity-80"
                      onClick={() => setExchangePriceInverted((inverted) => !inverted)}
                      type="button"
                    >
                      <DappIcon alt="" size="xs" src={dappAssets.exchangeFlip} />
                    </button>
                  </AnchoredTooltip>
                </>
              ),
              valueClassName: 'inline-flex items-center justify-end gap-1',
            },
            {
              label: t.exchange.allowedSlippage,
              value: (
                <>
                  {trade.slippage}%
                  <button
                    aria-label={t.exchange.slippageSettings}
                    className={cn(
                      'duration-dapp-fast grid size-6 shrink-0 cursor-pointer place-items-center rounded-md border-0 bg-transparent p-0 transition-opacity ease-out hover:opacity-80',
                      sessionReady && !trade.walletReady && 'pointer-events-none opacity-40',
                    )}
                    disabled={sessionReady && !trade.walletReady}
                    onClick={() => setSlippageOpen(true)}
                    type="button"
                  >
                    <DappIcon alt="" size="xs" src={dappAssets.setting} />
                  </button>
                </>
              ),
              valueClassName: 'inline-flex items-center justify-end gap-1',
            },
            ...(sessionReady && trade.sellAmount.trim().length > 0
              ? [
                  {
                    label: t.exchange.trade.priceImpact,
                    value: trade.isQuoting ? (
                      <ExchangeMetaValueSkeleton />
                    ) : (
                      trade.priceImpactLabel || '—'
                    ),
                  },
                  {
                    label: t.exchange.trade.estimatedGas,
                    value: trade.isQuoting ? <ExchangeMetaValueSkeleton /> : trade.gasEstimateLabel,
                  },
                ]
              : []),
            {
              label: t.exchange.route,
              value: trade.routeLabel,
            },
            {
              label: t.exchange.provider,
              value: (
                <>
                  {t.exchange.providerName}
                  <button
                    aria-label={t.exchange.openPancakeSwap}
                    className="duration-dapp-fast grid size-6 shrink-0 cursor-pointer place-items-center rounded-md border-0 bg-transparent p-0 transition-opacity ease-out hover:opacity-80"
                    onClick={() => openPancakeSwapDeepLink(trade.pancakeSwapUrl)}
                    type="button"
                  >
                    <DappIcon alt="" size="action" src={dappAssets.arrowUpRight} />
                  </button>
                </>
              ),
              valueClassName: 'inline-flex items-center justify-end gap-1',
            },
          ]}
        />

        {sessionReady && trade.isHighPriceImpact ? (
          <DappInlineAlert className="mt-3">
            {t.exchange.trade.highPriceImpactWarning}
          </DappInlineAlert>
        ) : null}

        {sessionReady && trade.walletReady ? (
          <DappActionRow className="mt-3.5 max-dapp:mt-3">
            <DappActionButton
              className="col-span-full"
              density="external"
              disabled={!trade.canSubmit}
              loading={trade.isSubmitting}
              onClick={() => void handleSubmit()}
            >
              {t.exchange.trade.action}
            </DappActionButton>
          </DappActionRow>
        ) : null}

        {!sessionReady ? <DappWidgetConnectPromo className="mt-3.5" /> : null}
      </ExchangeWidgetBody>

      <ExchangeSlippageModal
        onConfirm={trade.setSlippage}
        onOpenChange={setSlippageOpen}
        open={slippageOpen}
        slippage={trade.slippage}
      />
    </>
  )
}
