import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '~/shared/lib/utils'
import { useI18n } from '~/i18n/use-i18n'
import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/components/dapp-icon'
import { DappActionButton } from '~/app/shell/components/dapp-action-button'
import { DappActionRow } from '~/app/shell/components/dapp-action-row'
import { SwapSlippageModal } from '~/app/shell/components/swap-slippage-modal'
import { SwapMetaValueSkeleton } from '~/app/shell/components/dapp-skeleton'
import { AnchoredTooltip } from '~/shared/ui/anchored-tooltip'
import { useDappShell } from '~/app/dapp-shell-context'
import { useTradeSwapWidgetContext } from '~/views/dapp/swap/trade-swap-widget-context'
import {
  resolveGenesisPurchaseError,
  resolveWalletTransactionError,
  toWalletUserFacingMessage,
} from '~/views/dapp/web3/resolve-contract-error-message'
import { openPancakeSwapDeepLink } from '~/shared/config/pancake-swap-links'
import {
  SwapAmountFlow,
  SwapFlowButton,
  SwapGenesisFooter,
  SwapMetaPanel,
  SwapSubpageHeader,
  SwapWidgetBody,
  swapFlipCard,
  useSwapBalanceLabels,
} from '~/views/dapp/swap/swap-widget-composites'
import { DappInlineAlert } from '~/shared/ui/dapp-inline-alert'

export function TradeSwapWidget({
  onSelectGenesis,
}: {
  onSelectGenesis: () => void
}) {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const swap = useTradeSwapWidgetContext()
  const [isFlipping, setIsFlipping] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [slippageOpen, setSlippageOpen] = useState(false)
  const [exchangePriceInverted, setExchangePriceInverted] = useState(false)

  const { pair } = swap
  const flipCardClass = swapFlipCard({ flipping: isFlipping })
  const showRateSkeleton = exchangePriceInverted
    ? swap.isExchangePriceInvertedQuoting && !swap.exchangePriceLabelInverted
    : swap.isExchangePriceQuoting && !swap.exchangePriceLabel
  const exchangePriceDisplayLabel = exchangePriceInverted
    ? swap.exchangePriceLabelInverted
    : swap.exchangePriceLabel
  const showBuyAmountSkeleton = sessionReady && swap.isQuoting && swap.sellAmount.trim().length > 0

  const { buyLabel, sellLabel } = useSwapBalanceLabels({
    buyBalanceLabel: swap.buyBalanceLabel,
    isBalancesLoading: swap.isBalancesLoading,
    sellBalanceLabel: swap.sellBalanceLabel,
    sessionReady,
    walletReady: swap.walletReady,
  })

  const handleFlip = useCallback(() => {
    if (sessionReady && !swap.walletReady) return
    if (isFlipping) return
    setIsFlipping(true)
    setRotation((prev) => prev + 180)
    window.setTimeout(() => {
      swap.flipDirection()
    }, 160)
    window.setTimeout(() => {
      setIsFlipping(false)
    }, 320)
  }, [isFlipping, sessionReady, swap])

  const handleSubmit = useCallback(async () => {
    const success = await swap.submit()
    if (!success) return
    toast.success(t.swap.swapSuccess)
  }, [swap, t.swap.swapSuccess])

  useEffect(() => {
    if (!swap.error) return
    const message =
      resolveWalletTransactionError(swap.error, t.wallet.transactionErrors) ??
      resolveGenesisPurchaseError(swap.error, {
        insufficientAllowance: t.genesis.insufficientAllowance,
        insufficientUsd1: t.genesis.insufficientUsd1,
        purchaseUnavailable: t.genesis.purchaseUnavailable,
        walletNotConnected: t.genesis.walletNotConnected,
      }) ??
      toWalletUserFacingMessage(swap.error, t.wallet.transactionErrors.transactionFailed)
    if (message) toast.error(message)
  }, [
    swap.error,
    t.genesis.insufficientAllowance,
    t.genesis.insufficientUsd1,
    t.genesis.purchaseUnavailable,
    t.genesis.walletNotConnected,
    t.wallet.transactionErrors,
  ])

  return (
    <>
      <SwapSubpageHeader subtitle={t.swap.trade.intro} title={t.swap.trade.title} />
      <SwapWidgetBody
        bodyClassName="gap-0"
        footer={sessionReady ? <SwapGenesisFooter onSelectGenesis={onSelectGenesis} /> : undefined}
      >
        <SwapAmountFlow
          amountBoxClassName={flipCardClass}
          buy={pair.buy}
          buyAmount={swap.buyAmount}
          buyBalance={buyLabel}
          middleSlot={
            <div
              className={cn(
                'flex items-center justify-center py-1.5',
                'max-dapp:h-auto max-dapp:py-0 max-dapp:drop-shadow-card',
              )}
            >
              <AnchoredTooltip content={t.swap.flip}>
                <SwapFlowButton
                  aria-label={t.swap.flip}
                  className="max-dapp:my-2"
                  disabled={sessionReady && !swap.walletReady}
                  interactive
                  onClick={handleFlip}
                >
                  <span
                    className="grid place-items-center transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)]"
                    style={{ transform: `rotate(${rotation}deg)` }}
                  >
                    ⇅
                  </span>
                </SwapFlowButton>
              </AnchoredTooltip>
            </div>
          }
          onFillPercent={(percent) => swap.fillPercent(percent)}
          onSellAmountChange={swap.setSellAmount}
          sell={pair.sell}
          sellAmountDisplay={swap.sellAmountDisplay}
          sellBalance={sellLabel}
          sessionReady={sessionReady}
          showBuyAmountSkeleton={showBuyAmountSkeleton}
          walletReady={swap.walletReady}
        />

        <SwapMetaPanel
          items={[
            {
              label: t.swap.exchangePrice,
              value: showRateSkeleton ? (
                <SwapMetaValueSkeleton />
              ) : (
                <>
                  {exchangePriceDisplayLabel || t.swap.ratePlaceholder}
                  <AnchoredTooltip content={t.swap.flip}>
                    <button
                      aria-label={t.swap.flip}
                      className="grid size-6 shrink-0 cursor-pointer place-items-center rounded-md border-0 bg-transparent p-0 transition-opacity duration-180 ease-out hover:opacity-80"
                      onClick={() => setExchangePriceInverted((inverted) => !inverted)}
                      type="button"
                    >
                      <DappIcon alt="" size="xs" src={dappAssets.swapExchange} />
                    </button>
                  </AnchoredTooltip>
                </>
              ),
              valueClassName: 'inline-flex items-center justify-end gap-1',
            },
            {
              label: t.swap.allowedSlippage,
              value: (
                <>
                  {swap.slippage}%
                  <button
                    aria-label={t.swap.slippageSettings}
                    className={cn(
                      'grid size-6 shrink-0 cursor-pointer place-items-center rounded-md border-0 bg-transparent p-0 transition-opacity duration-180 ease-out hover:opacity-80',
                      sessionReady && !swap.walletReady && 'pointer-events-none opacity-40',
                    )}
                    disabled={sessionReady && !swap.walletReady}
                    onClick={() => setSlippageOpen(true)}
                    type="button"
                  >
                    <DappIcon alt="" size="xs" src={dappAssets.setting} />
                  </button>
                </>
              ),
              valueClassName: 'inline-flex items-center justify-end gap-1',
            },
            ...(sessionReady && swap.sellAmount.trim().length > 0
              ? [
                  {
                    label: t.swap.trade.priceImpact,
                    value: swap.isQuoting ? (
                      <SwapMetaValueSkeleton />
                    ) : (
                      swap.priceImpactLabel || '—'
                    ),
                  },
                  {
                    label: t.swap.trade.estimatedGas,
                    value: swap.isQuoting ? (
                      <SwapMetaValueSkeleton />
                    ) : (
                      swap.gasEstimateLabel
                    ),
                  },
                ]
              : []),
            {
              label: t.swap.route,
              value: swap.routeLabel,
            },
            {
              label: t.swap.provider,
              value: (
                <>
                  {t.swap.providerName}
                  <button
                    aria-label={t.swap.openPancakeSwap}
                    className="grid size-6 shrink-0 cursor-pointer place-items-center rounded-md border-0 bg-transparent p-0 transition-opacity duration-180 ease-out hover:opacity-80"
                    onClick={() => openPancakeSwapDeepLink(swap.pancakeSwapUrl)}
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

        {sessionReady && swap.isHighPriceImpact ? (
          <DappInlineAlert className="mt-3">
            {t.swap.trade.highPriceImpactWarning}
          </DappInlineAlert>
        ) : null}

        {sessionReady && swap.walletReady ? (
          <DappActionRow className="mt-3.5 max-dapp:mt-3">
            <DappActionButton
              className="col-span-full"
              density="external"
              disabled={!swap.canSubmit}
              loading={swap.isSubmitting}
              onClick={() => void handleSubmit()}
            >
              {t.swap.trade.action}
            </DappActionButton>
          </DappActionRow>
        ) : null}
      </SwapWidgetBody>

      <SwapSlippageModal
        onConfirm={swap.setSlippage}
        onOpenChange={setSlippageOpen}
        open={slippageOpen}
        slippage={swap.slippage}
      />
    </>
  )
}
