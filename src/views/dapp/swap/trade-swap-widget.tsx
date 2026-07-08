import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '~/shared/lib/utils'
import { useI18n } from '~/i18n/use-i18n'
import { dappAssets, flashSwapAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/components/dapp-icon'
import { DappActionButton } from '~/app/shell/components/dapp-action-button'
import { DappActionRow } from '~/app/shell/components/dapp-action-row'
import { dappWidgetBodyClass } from '~/app/shell/components/dapp-widget-frame'
import { SwapSlippageModal } from '~/app/shell/components/swap-slippage-modal'
import { SwapAmountSkeleton, SwapBalanceSkeleton, SwapMetaValueSkeleton } from '~/app/shell/components/dapp-skeleton'
import { dappWidgetFooterTopGapClass } from '~/app/dapp-detail-layout'
import { AnchoredTooltip } from '~/shared/ui/anchored-tooltip'
import { useDappShell } from '~/app/dapp-shell-context'
import { useTradeSwapWidgetContext } from '~/views/dapp/swap/trade-swap-widget-context'
import { resolveGenesisPurchaseError, resolveWalletTransactionError, toWalletUserFacingMessage } from '~/views/dapp/web3/resolve-contract-error-message'
import { openPancakeSwapDeepLink } from '~/shared/config/pancake-swap-links'
import {
  SwapGenesisFooter,
  SwapMetaPanel,
  swapFlipCard,
} from '~/views/dapp/swap/swap-promo-card'
import { SwapPanelToggle } from '~/views/dapp/swap/swap-panel-toggle'
import { useSwapViewStore } from '~/stores/swap-view-store'
import { TokenChip } from '~/app/shell/components/token-chip'
import { AmountBox } from '~/shared/ui/amount-box'
import { PercentButtonRow } from '~/shared/ui/segment'
import { WidgetSubpageHeader } from '~/shared/ui/widget-header'
import { Text } from '~/shared/ui/text'

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
  const swapPreview = !sessionReady
  const showBalanceSkeleton = !swapPreview && swap.isBalancesLoading
  const showRateSkeleton =
    exchangePriceInverted
      ? swap.isExchangePriceInvertedQuoting && !swap.exchangePriceLabelInverted
      : swap.isExchangePriceQuoting && !swap.exchangePriceLabel
  const exchangePriceDisplayLabel = exchangePriceInverted
    ? swap.exchangePriceLabelInverted
    : swap.exchangePriceLabel
  const showBuyAmountSkeleton = sessionReady && swap.isQuoting && swap.sellAmount.trim().length > 0
  const zeroBalanceLabel = `${t.swap.balance}: 0.00`

  const sellBalanceLabel = showBalanceSkeleton ? (
    <>
      {t.swap.balance}: <SwapBalanceSkeleton />
    </>
  ) : swapPreview ? (
    zeroBalanceLabel
  ) : (
    `${t.swap.balance}: ${swap.walletReady ? swap.sellBalanceLabel : '—'}`
  )

  const buyBalanceLabel = showBalanceSkeleton ? (
    <>
      {t.swap.balance}: <SwapBalanceSkeleton />
    </>
  ) : swapPreview ? (
    zeroBalanceLabel
  ) : (
    `${t.swap.balance}: ${swap.walletReady ? swap.buyBalanceLabel : '—'}`
  )

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

  const setSwapView = useSwapViewStore((state) => state.setView)

  return (
    <>
      <WidgetSubpageHeader
        action={<SwapPanelToggle />}
        backLabel={
          <>
            <DappIcon alt="" size="sm" src={flashSwapAssets.backArrow} />
            <Text tone="muted-foreground" variant="copy">
              {t.swap.backToHub}
            </Text>
          </>
        }
        onBack={() => setSwapView('hub')}
        subtitle={t.swap.trade.intro}
        title={t.swap.trade.title}
      />
      <div className={cn(dappWidgetBodyClass, 'gap-0')}>
        <AmountBox
          amountProps={{
            'aria-label': `${pair.sell.symbol} sell amount`,
            disabled: sessionReady && !swap.walletReady,
            inputMode: 'decimal',
            onChange: (event) => swap.setSellAmount(event.currentTarget.value),
            placeholder: '0.00',
            value: swap.sellAmountDisplay,
          }}
          balance={sellBalanceLabel}
          className={flipCardClass}
          label={t.swap.sell}
          startAdornment={<TokenChip icon={pair.sell.icon} label={pair.sell.symbol} />}
        />

        <PercentButtonRow
          disabled={!swapPreview && !swap.walletReady}
          onSelect={(percent) => swap.fillPercent(percent)}
        />

        <div
          className={cn(
            'flex items-center justify-center py-1.5',
            'max-dapp:h-auto max-dapp:py-0 max-dapp:drop-shadow-[0_0.5rem_0.75rem_rgba(18,26,51,0.07)]',
          )}
        >
          <AnchoredTooltip content={t.swap.flip}>
            <button
              aria-label={t.swap.flip}
              className={cn(
                'grid size-8 place-items-center rounded-sm border border-border bg-card p-0',
                'text-foreground shadow-none transition-[border-color,transform] duration-180 ease-out',
                'enabled:hover:-translate-y-px enabled:hover:border-primary',
                'enabled:focus-visible:-translate-y-px enabled:focus-visible:border-primary',
                'max-dapp:my-2',
              )}
              disabled={sessionReady && !swap.walletReady}
              onClick={handleFlip}
              type="button"
            >
              <span
                className="grid place-items-center transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)]"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                ⇅
              </span>
            </button>
          </AnchoredTooltip>
        </div>

        <AmountBox
          amountProps={{
            'aria-label': `${pair.buy.symbol} receive amount`,
            placeholder: '0.00',
            readOnly: true,
            value: swapPreview ? swap.buyAmount || '0.00' : swap.buyAmount,
          }}
          balance={buyBalanceLabel}
          className={cn('mt-0', flipCardClass)}
          label={t.swap.buy}
          loading={showBuyAmountSkeleton}
          loadingSkeleton={<SwapAmountSkeleton />}
          startAdornment={<TokenChip icon={pair.buy.icon} label={pair.buy.symbol} />}
        />

        <SwapMetaPanel
          sessionReady
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
          <Text
            as="p"
            className="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-destructive"
            tone="foreground"
            variant="copy"
          >
            {t.swap.trade.highPriceImpactWarning}
          </Text>
        ) : null}

        {sessionReady && swap.walletReady ? (
          <DappActionRow className={dappWidgetFooterTopGapClass}>
            <DappActionButton
              className="col-span-full"
              disabled={!swap.canSubmit}
              loading={swap.isSubmitting}
              onClick={() => void handleSubmit()}
            >
              {t.swap.trade.action}
            </DappActionButton>
          </DappActionRow>
        ) : null}
        {sessionReady ? (
          <div className="mt-auto w-full shrink-0">
            <SwapGenesisFooter onSelectGenesis={onSelectGenesis} />
          </div>
        ) : null}
      </div>

      <SwapSlippageModal
        onConfirm={swap.setSlippage}
        onOpenChange={setSlippageOpen}
        open={slippageOpen}
        slippage={swap.slippage}
      />
    </>
  )
}
