import { useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { cn } from '~/lib/utils'
import { useI18n } from '~/i18n/use-i18n'
import { BSC_CONTRACTS } from '~/config/contracts'
import { bscscanAddress } from '~/config/explorer'
import { flashSwapAssets } from '~/app/assets'
import { DappIcon } from '~/app/components/dapp-icon'
import { dappWidgetFooterTopGapClass } from '~/app/dapp-detail-layout'
import { DappWidgetConnectFooter } from '~/app/components/dapp-widget-connect-footer'
import { DappActionButton } from '~/app/components/dapp-action-button'
import { DappActionRow } from '~/app/components/dapp-action-row'
import { DappMetaList } from '~/app/components/dapp-meta-list'
import { dappWidgetBodyClass } from '~/app/components/dapp-widget-frame'
import { GenesisPromoCard } from '~/app/components/genesis-promo-card'
import { SwapAmountBox } from '~/app/components/swap-amount-box'
import { SwapBalanceSkeleton, SwapMetaValueSkeleton } from '~/app/components/dapp-skeleton'
import { useFlashSwapWidget } from '~/hooks/use-flash-swap-widget'
import { useDappShell } from '~/app/dapp-shell-context'
import { useGenesisWidgetContext } from '~/app/genesis-widget-context'
import { resolveGenesisPurchaseError, toWalletUserFacingMessage } from '~/lib/web3/resolve-contract-error-message'
import { SwapSubpageHeader, SwapWidgetBody } from '~/app/tabs/swap/swap-widget-header'

export function FlashSwapWidget({
  onSelectGenesis,
}: {
  onSelectGenesis: () => void
}) {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const swap = useFlashSwapWidget(sessionReady)
  const genesis = useGenesisWidgetContext()
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
      <SwapSubpageHeader subtitle={t.swap.flash.intro} title={t.swap.flash.title} />
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

        <DappMetaList
          className={cn('rounded-xl px-3.5 py-3.25', dappWidgetFooterTopGapClass)}
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
      </SwapWidgetBody>
    </>
  )
}
