import { useEffect, useEffectEvent, useState } from 'react'
import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { bscscanAddress } from '~/shared/config/explorer'
import { flashExchangeAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappActionRow } from '~/app/shell/dapp-action-row'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { ExchangeMetaValueSkeleton } from '~/app/shell/dapp-skeleton'
import type { FlashExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import { useDappShell } from '~/app/use-dapp-shell'
import { resolveExchangeUserFacingMessage } from '~/web3/resolve-contract-error-message'
import { presentUserFacingError } from '~/web3/present-user-facing-error'
import {
  ExchangeAmountFlow,
  ExchangeFlowButton,
  ExchangeGenesisFooter,
  ExchangeMetaPanel,
  ExchangeSubpageHeader,
  ExchangeWidgetBody,
  useExchangeBalanceLabels,
} from '~/views/dapp/exchange/exchange-widget-composites'
import { DappInlineAlert } from '~/shared/ui/dapp-inline-alert'
import { Segment } from '~/shared/ui/segment'

export function FlashExchangeWidget({
  onSelectGenesis,
  flash,
}: {
  onSelectGenesis: () => void
  flash: FlashExchangeState
}) {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const { pair } = flash
  /** Live money path is USDT→USD1; gAGX→AGX UI is deferred (Spec). */
  const [pairTab, setPairTab] = useState('usdt')
  const showRateSkeleton = flash.isExchangePriceQuoting && !flash.exchangePriceLabel
  const showBuyAmountSkeleton =
    sessionReady && flash.isQuoting && flash.sellAmount.trim().length > 0

  const flashPairOptions = [
    { label: t.exchange.flash.pairs.gagx, value: 'gagx', disabled: true },
    { label: t.exchange.flash.pairs.usdt, value: 'usdt' },
  ]

  const { buyLabel, sellLabel } = useExchangeBalanceLabels({
    buyBalanceLabel: flash.buyBalanceLabel,
    isBalancesLoading: flash.isBalancesLoading,
    sellBalanceLabel: flash.sellBalanceLabel,
    sessionReady,
    walletReady: flash.walletReady,
  })

  function resolveFlashMessage(error: unknown) {
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

  const submitErrorMessage =
    !flash.error || flash.isSubmitting ? null : resolveFlashMessage(flash.error)

  async function handleSubmit() {
    const result = await flash.submit()
    if (result.ok) {
      toast.success(t.exchange.exchangeSuccess)
      return
    }
    if (result.error != null) {
      presentUserFacingError(result.error, resolveFlashMessage)
    }
  }

  const presentValidationError = useEffectEvent((error: unknown) => {
    presentUserFacingError(error, resolveFlashMessage, {
      id: 'flash-exchange-quote-error',
    })
  })

  useEffect(() => {
    if (!flash.validationError) return
    presentValidationError(flash.validationError)
  }, [flash.quoteErrorUpdatedAt, flash.validationError])

  return (
    <>
      <ExchangeSubpageHeader subtitle={t.exchange.flash.intro} title={t.exchange.flash.title} />
      <ExchangeWidgetBody
        bodyClassName="gap-0"
        footer={
          sessionReady ? <ExchangeGenesisFooter onSelectGenesis={onSelectGenesis} /> : undefined
        }
      >
        <Segment
          aria-label={t.exchange.flash.pairAriaLabel}
          className="mb-3.5"
          onChange={setPairTab}
          options={flashPairOptions}
          value={pairTab}
        />

        <ExchangeAmountFlow
          buy={pair.buy}
          buyAmount={flash.buyAmount}
          buyBalance={buyLabel}
          middleSlot={
            <div aria-hidden className="flex items-center justify-center py-1.5">
              <ExchangeFlowButton aria-hidden>
                <DappIcon alt="" className="size-4" src={flashExchangeAssets.flowDivider} />
              </ExchangeFlowButton>
            </div>
          }
          onFillPercent={(percent) => flash.fillPercent(percent)}
          onSellAmountChange={flash.setSellAmount}
          sell={pair.sell}
          sellAmountDisplay={flash.sellAmountDisplay}
          sellBalance={sellLabel}
          sessionReady={sessionReady}
          showBuyAmountSkeleton={showBuyAmountSkeleton}
          walletReady={flash.walletReady}
          amountLocked={flash.isSubmitting}
        />

        <ExchangeMetaPanel
          items={[
            {
              label: t.exchange.exchangePrice,
              value: showRateSkeleton ? (
                <ExchangeMetaValueSkeleton />
              ) : (
                flash.exchangePriceLabel || t.exchange.ratePlaceholder
              ),
            },
            {
              label: t.exchange.route,
              value: flash.routeLabel,
            },
            {
              label: t.exchange.flash.minReceived,
              value: flash.minUsd1OutLabel,
            },
            {
              label: t.exchange.provider,
              value: (
                <>
                  {t.exchange.flash.providerName}
                  <button
                    aria-label={t.exchange.flash.openProvider}
                    className="duration-dapp-fast grid size-6 shrink-0 cursor-pointer place-items-center rounded-md border-0 bg-transparent p-0 transition-opacity ease-out hover:opacity-80"
                    onClick={() =>
                      window.open(
                        bscscanAddress(BSC_CONTRACTS.usd1Swap),
                        '_blank',
                        'noopener,noreferrer',
                      )
                    }
                    type="button"
                  >
                    <DappIcon alt="" size="action" src={flashExchangeAssets.externalLink} />
                  </button>
                </>
              ),
              valueClassName: 'inline-flex items-center justify-end gap-1',
            },
          ]}
        />

        {sessionReady && flash.walletReady ? (
          <DappActionRow className="mt-3.5 max-dapp:mt-3">
            <DappActionButton
              className="col-span-full"
              density="external"
              disabled={!flash.canSubmit}
              loading={flash.isSubmitting}
              onClick={() => void handleSubmit()}
            >
              {t.exchange.flash.action}
            </DappActionButton>
          </DappActionRow>
        ) : null}

        {!sessionReady ? <DappWidgetConnectPromo className="mt-3.5" /> : null}

        {submitErrorMessage ? (
          <DappInlineAlert className="mt-3" role="alert">
            {submitErrorMessage}
          </DappInlineAlert>
        ) : null}
      </ExchangeWidgetBody>
    </>
  )
}
