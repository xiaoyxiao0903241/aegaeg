import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '~/lib/utils'
import { useI18n } from '~/i18n/use-i18n'
import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/components/dapp-icon'
import { DappWidgetConnectFooter } from '~/app/components/dapp-widget-connect-footer'
import { DappActionButton } from '~/app/components/dapp-action-button'
import { DappActionRow } from '~/app/components/dapp-action-row'
import { dappWidgetFooterTopGapClass } from '~/app/dapp-detail-layout'
import { AnchoredTooltip } from '~/components/anchored-tooltip'
import { DappMetaList } from '~/app/components/dapp-meta-list'
import { dappWidgetBodyClass } from '~/app/components/dapp-widget-frame'
import { GenesisPromoCard } from '~/app/components/genesis-promo-card'
import { SwapAmountBox } from '~/app/components/swap-amount-box'
import { SwapSlippageModal } from '~/app/components/swap-slippage-modal'
import { SwapBalanceSkeleton, SwapMetaValueSkeleton } from '~/app/components/dapp-skeleton'
import { useSwapWidget } from '~/hooks/use-swap-widget'
import { useDappShell } from '~/app/dapp-shell-context'
import { useGenesisWidgetContext } from '~/app/genesis-widget-context'
import { resolveGenesisPurchaseError, toWalletUserFacingMessage } from '~/lib/web3/resolve-contract-error-message'
import { openPancakeSwapDeepLink } from '~/config/pancake-swap-links'
import { SwapSubpageHeader, SwapWidgetBody } from '~/app/tabs/swap/swap-widget-header'

export function TradeSwapWidget({
  onSelectGenesis,
}: {
  onSelectGenesis: () => void
}) {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const swap = useSwapWidget(sessionReady)
  const genesis = useGenesisWidgetContext()
  const [isFlipping, setIsFlipping] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [slippageOpen, setSlippageOpen] = useState(false)
  const [exchangePriceInverted, setExchangePriceInverted] = useState(false)

  const { pair } = swap
  const flipAnimClass = isFlipping
    ? '[animation:swap-card-flip_320ms_cubic-bezier(.2,.8,.2,1)_both]'
    : undefined
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
      resolveGenesisPurchaseError(swap.error, {
        insufficientAllowance: t.genesis.insufficientAllowance,
        insufficientUsd1: t.genesis.insufficientUsd1,
        purchaseUnavailable: t.genesis.purchaseUnavailable,
        walletNotConnected: t.genesis.walletNotConnected,
      }) ?? toWalletUserFacingMessage(swap.error)
    if (message) toast.error(message)
  }, [
    swap.error,
    t.genesis.insufficientAllowance,
    t.genesis.insufficientUsd1,
    t.genesis.purchaseUnavailable,
    t.genesis.walletNotConnected,
  ])

  return (
    <>
      <SwapSubpageHeader subtitle={t.swap.trade.intro} title={t.swap.trade.title} />
      <SwapWidgetBody
        bodyClassName={cn(dappWidgetBodyClass, 'gap-0')}
        footer={
          sessionReady ? (
            <DappWidgetConnectFooter>
              <GenesisPromoCard
                actionLabel={t.genesis.joinGenesis}
                className={cn(
                  'gap-1.5 [&_button]:min-h-9.5 [&_button]:text-xs [&_p]:leading-tight',
                  'max-dapp:[&_button]:min-h-10 max-dapp:[&_button]:text-sm',
                )}
                isLoading={genesis.isLoading}
                onClick={onSelectGenesis}
                promo={genesis.promoSnapshot}
              />
            </DappWidgetConnectFooter>
          ) : undefined
        }
      >
        <SwapAmountBox
          amountProps={{
            'aria-label': `${pair.sell.symbol} sell amount`,
            disabled: sessionReady && !swap.walletReady,
            inputMode: 'decimal',
            onChange: (event) => swap.setSellAmount(event.currentTarget.value),
            placeholder: '0.00',
            value: swap.sellAmountDisplay,
          }}
          className={flipAnimClass}
          sessionReady
          balance={sellBalanceLabel}
          label={t.swap.sell}
          tokenIcon={pair.sell.icon}
          tokenLabel={pair.sell.symbol}
        />

        <div className="grid grid-cols-4 gap-1.5 pt-2.5 max-dapp:mt-3 max-dapp:py-0">
          {[25, 50, 75, 100].map((percent) => (
            <button
              className={cn(
                'flex cursor-pointer items-center justify-center rounded-[0.5625rem] border border-border bg-card py-1.25',
                'text-xs font-semibold leading-normal tracking-[-0.02em] text-ink-strong',
                'transition-[border-color,color,transform] duration-180 ease-out',
                'hover:-translate-y-px hover:border-primary hover:text-primary',
                'disabled:pointer-events-none disabled:opacity-55',
                'max-dapp:h-auto max-dapp:py-1.5',
              )}
              disabled={!swapPreview && !swap.walletReady}
              key={percent}
              onClick={() => swap.fillPercent(percent)}
              type="button"
            >
              {percent}%
            </button>
          ))}
        </div>

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
                'text-sm font-normal leading-normal tracking-[-0.28px] text-foreground shadow-none transition-[border-color,transform] duration-180 ease-out',
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

        <SwapAmountBox
          amountLoading={showBuyAmountSkeleton}
          amountProps={{
            'aria-label': `${pair.buy.symbol} receive amount`,
            placeholder: '0.00',
            readOnly: true,
            value: swapPreview ? swap.buyAmount || '0.00' : swap.buyAmount,
          }}
          className={cn('mt-0', flipAnimClass)}
          sessionReady
          balance={buyBalanceLabel}
          label={t.swap.buy}
          tokenIcon={pair.buy.icon}
          tokenLabel={pair.buy.symbol}
        />

        <DappMetaList
          className={cn('rounded-xl px-3.5 py-3.25', dappWidgetFooterTopGapClass)}
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
