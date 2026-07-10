import { useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { bscscanAddress } from '~/shared/config/explorer'
import { flashSwapAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappActionRow } from '~/app/shell/dapp-action-row'
import { SwapMetaValueSkeleton } from '~/app/shell/dapp-skeleton'
import { useFlashSwapWidgetContext } from '~/views/dapp/swap/flash-swap-widget-context'
import { useDappShell } from '~/app/dapp-shell-context'
import { resolveFlashSwapUserMessage } from '~/views/dapp/web3/resolve-contract-error-message'
import { presentUserFacingError } from '~/views/dapp/web3/present-user-facing-error'
import {
  SwapAmountFlow,
  SwapFlowButton,
  SwapGenesisFooter,
  SwapMetaPanel,
  SwapSubpageHeader,
  SwapWidgetBody,
  useSwapBalanceLabels,
} from '~/views/dapp/swap/swap-widget-composites'
import { DappInlineAlert } from '~/shared/ui/dapp-inline-alert'

export function FlashSwapWidget({
  onSelectGenesis,
}: {
  onSelectGenesis: () => void
}) {
  'use memo'
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

  const resolveFlashMessage = useCallback(
    (error: unknown) =>
      resolveFlashSwapUserMessage(
        error,
        {
          walletNotConnected: t.genesis.walletNotConnected,
          insufficientAllowance: t.genesis.insufficientAllowance,
          insufficientUsd1: t.genesis.insufficientUsd1,
          purchaseUnavailable: t.genesis.purchaseUnavailable,
          transactionCancelled: t.swap.transactionCancelled,
          quoteFailed: t.errors.quoteFailed,
        },
        t.wallet.transactionErrors,
        t.errors.chain.fallback,
      ),
    [t],
  )

  const submitErrorMessage =
    !swap.error || swap.isSubmitting ? null : resolveFlashMessage(swap.error)

  async function handleSubmit() {
    const result = await swap.submit()
    if (result.ok) {
      toast.success(t.swap.swapSuccess)
      return
    }
    if (result.error != null) {
      presentUserFacingError(result.error, resolveFlashMessage)
    }
  }

  useEffect(() => {
    if (!swap.validationError) return
    presentUserFacingError(swap.validationError, resolveFlashMessage)
  }, [resolveFlashMessage, swap.quoteErrorUpdatedAt, swap.validationError])

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
              <SwapFlowButton aria-hidden>
                <DappIcon alt="" className="size-4" src={flashSwapAssets.flowDivider} />
              </SwapFlowButton>
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
          amountLocked={swap.isSubmitting}
        />

        <SwapMetaPanel
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
              label: t.swap.flash.minReceived,
              value: swap.minUsd1OutLabel,
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
          <DappActionRow className="mt-3.5 max-dapp:mt-3">
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
          <DappInlineAlert className="mt-3" role="alert">
            {submitErrorMessage}
          </DappInlineAlert>
        ) : null}
      </SwapWidgetBody>
    </>
  )
}
