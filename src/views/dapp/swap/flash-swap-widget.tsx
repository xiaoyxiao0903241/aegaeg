import { useCallback, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { bscscanAddress } from '~/shared/config/explorer'
import { flashSwapAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/components/dapp-icon'
import { DappActionButton } from '~/app/shell/components/dapp-action-button'
import { DappActionRow } from '~/app/shell/components/dapp-action-row'
import { SwapMetaValueSkeleton } from '~/app/shell/components/dapp-skeleton'
import { dappWidgetFooterTopGapClass } from '~/app/dapp-detail-layout'
import { useFlashSwapWidgetContext } from '~/views/dapp/swap/flash-swap-widget-context'
import { useDappShell } from '~/app/dapp-shell-context'
import { resolveFlashSwapUserMessage } from '~/views/dapp/web3/resolve-contract-error-message'
import {
  SwapAmountFlow,
  SwapGenesisFooter,
  SwapMetaPanel,
  SwapSubpageHeader,
  SwapWidgetBody,
  useSwapBalanceLabels,
} from '~/views/dapp/swap/swap-widget-composites'
import { Text } from '~/shared/ui/text'

export function FlashSwapWidget({
  onSelectGenesis,
}: {
  onSelectGenesis: () => void
}) {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const swap = useFlashSwapWidgetContext()
  const { pair } = swap
  const showRateSkeleton = swap.isExchangePriceQuoting && !swap.exchangePriceLabel
  const showBuyAmountSkeleton = sessionReady && swap.isQuoting && swap.sellAmount.trim().length > 0

  const { buyLabel, sellLabel } = useSwapBalanceLabels({
    buyBalanceLabel: swap.buyBalanceLabel,
    isBalancesLoading: swap.isBalancesLoading,
    sellBalanceLabel: swap.sellBalanceLabel,
    sessionReady,
    walletReady: swap.walletReady,
  })

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
        bodyClassName="gap-0"
        footer={sessionReady ? <SwapGenesisFooter onSelectGenesis={onSelectGenesis} /> : undefined}
      >
        <SwapAmountFlow
          buy={pair.buy}
          buyAmount={swap.buyAmount}
          buyBalance={buyLabel}
          middleSlot={
            <div aria-hidden className="flex items-center justify-center py-1.5">
              <div className="grid size-[2.125rem] place-items-center rounded-control border border-border bg-card">
                <DappIcon alt="" className="size-4" src={flashSwapAssets.flowDivider} />
              </div>
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
              density="external"
              disabled={!swap.canSubmit}
              loading={swap.isSubmitting}
              onClick={() => void handleSubmit()}
            >
              {t.swap.flash.action}
            </DappActionButton>
          </DappActionRow>
        ) : null}

        {submitErrorMessage ? (
          <Text
            as="p"
            className="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-destructive"
            role="alert"
            tone="foreground"
            variant="copy"
          >
            {submitErrorMessage}
          </Text>
        ) : null}
      </SwapWidgetBody>
    </>
  )
}
