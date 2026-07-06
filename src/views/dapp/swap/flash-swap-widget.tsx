import { useCallback, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import { cn } from '~/lib/utils'
import { useI18n } from '~/i18n/use-i18n'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { bscscanAddress } from '~/shared/config/explorer'
import { flashSwapAssets } from '~/app/assets'
import { DappIcon } from '~/app/components/dapp-icon'
import { DappWidgetConnectFooter } from '~/app/components/dapp-widget-connect-footer'
import { DappActionButton } from '~/app/components/dapp-action-button'
import { DappActionRow } from '~/app/components/dapp-action-row'
import { dappWidgetBodyClass } from '~/app/components/dapp-widget-frame'
import { dappWidgetFooterTopGapClass } from '~/app/dapp-detail-layout'
import { SwapAmountBox } from '~/app/components/swap-amount-box'
import { SwapBalanceSkeleton, SwapMetaValueSkeleton } from '~/app/components/dapp-skeleton'
import { useFlashSwapWidgetContext } from '~/views/dapp/swap/flash-swap-widget-context'
import { useDappShell } from '~/app/dapp-shell-context'
import { resolveFlashSwapUserMessage } from '~/views/dapp/web3/resolve-contract-error-message'
import {
  SwapGenesisFooter,
  SwapMetaPanel,
  SwapPercentButtons,
} from '~/views/dapp/swap/swap-widget-primitives'
import { SwapSubpageHeader, SwapWidgetBody } from '~/views/dapp/swap/swap-widget-header'

export function FlashSwapWidget({
  onSelectGenesis,
}: {
  onSelectGenesis: () => void
}) {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const swap = useFlashSwapWidgetContext()
  const { pair } = swap
  const swapPreview = !sessionReady
  const showBalanceSkeleton = !swapPreview && swap.isBalancesLoading
  const showRateSkeleton = swap.isExchangePriceQuoting && !swap.exchangePriceLabel
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

  const flashSwapErrorMessages = useMemo(
    () => ({
      walletNotConnected: t.genesis.walletNotConnected,
      insufficientAllowance: t.genesis.insufficientAllowance,
      insufficientUsd1: t.genesis.insufficientUsd1,
      purchaseUnavailable: t.genesis.purchaseUnavailable,
      transactionCancelled: t.swap.transactionCancelled,
    }),
    [
      t.genesis.insufficientAllowance,
      t.genesis.insufficientUsd1,
      t.genesis.purchaseUnavailable,
      t.genesis.walletNotConnected,
      t.swap.transactionCancelled,
    ],
  )

  const showFlashSwapError = useCallback(
    (error: unknown) => {
      const message = resolveFlashSwapUserMessage(error, flashSwapErrorMessages, t.wallet.transactionErrors)
      if (message) toast.error(message)
    },
    [flashSwapErrorMessages, t.wallet.transactionErrors],
  )

  const submitErrorMessage = useMemo(() => {
    if (!swap.error || swap.isSubmitting) return null
    return resolveFlashSwapUserMessage(swap.error, flashSwapErrorMessages, t.wallet.transactionErrors)
  }, [flashSwapErrorMessages, swap.error, swap.isSubmitting, t.wallet.transactionErrors])

  const handleSubmit = useCallback(async () => {
    const result = await swap.submit()
    if (result.ok) {
      toast.success(t.swap.swapSuccess)
      return
    }
    if (result.error != null) {
      showFlashSwapError(result.error)
    }
  }, [showFlashSwapError, swap, t.swap.swapSuccess])

  useEffect(() => {
    if (!swap.validationError) return
    showFlashSwapError(swap.validationError)
  }, [showFlashSwapError, swap.validationError])

  return (
    <>
      <SwapSubpageHeader subtitle={t.swap.flash.intro} title={t.swap.flash.title} />
      <SwapWidgetBody
        bodyClassName={cn(dappWidgetBodyClass, 'gap-0')}
        footer={
          sessionReady ? <SwapGenesisFooter onSelectGenesis={onSelectGenesis} /> : undefined
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
          sessionReady
          balance={sellBalanceLabel}
          label={t.swap.sell}
          tokenIcon={pair.sell.icon}
          tokenLabel={pair.sell.symbol}
        />

        <SwapPercentButtons
          disabled={!swapPreview && !swap.walletReady}
          onSelect={(percent) => swap.fillPercent(percent)}
        />

        <div aria-hidden className="flex items-center justify-center py-1.5">
          <div className="grid size-[2.125rem] place-items-center rounded-[0.6875rem] border border-border bg-card">
            <DappIcon alt="" className="size-4" src={flashSwapAssets.flowDivider} />
          </div>
        </div>

        <SwapAmountBox
          amountLoading={showBuyAmountSkeleton}
          amountProps={{
            'aria-label': `${pair.buy.symbol} receive amount`,
            placeholder: '0.00',
            readOnly: true,
            value: swapPreview ? swap.buyAmount || '0.00' : swap.buyAmount,
          }}
          className="mt-0"
          sessionReady
          balance={buyBalanceLabel}
          label={t.swap.buy}
          tokenIcon={pair.buy.icon}
          tokenLabel={pair.buy.symbol}
        />

        <SwapMetaPanel
          sessionReady
          items={[
            {
              label: t.swap.exchangePrice,
              value: showRateSkeleton ? (
                <SwapMetaValueSkeleton />
              ) : (
                swap.exchangePriceLabel || t.swap.ratePlaceholder
              ),
            },
            {
              label: t.swap.route,
              value: swap.routeLabel,
            },
            {
              label: t.swap.provider,
              value: (
                <>
                  {t.swap.flash.providerName}
                  <button
                    aria-label={t.swap.flash.openProvider}
                    className="grid size-6 shrink-0 cursor-pointer place-items-center rounded-md border-0 bg-transparent p-0 transition-opacity duration-180 ease-out hover:opacity-80"
                    onClick={() =>
                      window.open(
                        bscscanAddress(BSC_CONTRACTS.usd1Swap),
                        '_blank',
                        'noopener,noreferrer',
                      )
                    }
                    type="button"
                  >
                    <DappIcon alt="" size="action" src={flashSwapAssets.externalLink} />
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
              {t.swap.flash.action}
            </DappActionButton>
          </DappActionRow>
        ) : null}

        {submitErrorMessage ? (
          <p
            className="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs leading-relaxed text-destructive"
            role="alert"
          >
            {submitErrorMessage}
          </p>
        ) : null}
      </SwapWidgetBody>
    </>
  )
}
