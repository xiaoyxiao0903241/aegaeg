import { useEffect, useEffectEvent } from 'react'
import { useExchangeViewStore } from '~/stores/exchange-view-store'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { toast } from 'sonner'
import { burnExchangeAssets, flashExchangeAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappActionRow } from '~/app/shell/dapp-action-row'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { ExchangeMetaValueSkeleton } from '~/app/shell/dapp-skeleton'
import type { BurnExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import { useDappShell } from '~/app/use-dapp-shell'
import { useI18n } from '~/i18n/use-i18n'
import { bscscanAddress } from '~/shared/config/explorer'
import { resolveExchangeUserFacingMessage } from '~/web3/resolve-contract-error-message'
import { presentUserFacingError } from '~/web3/present-user-facing-error'
import { BURN_GATE_ERROR } from '~/views/dapp/exchange/burn/submit-burn-exchange'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { DappMetaPanel } from '~/app/shell/dapp-meta-panel'
import { ExchangeFlowButton } from '~/views/dapp/exchange/exchange-flow-button'
import { ExchangeAmountFlow } from '~/views/dapp/exchange/exchange-amount-flow'
import { DappInlineAlert } from '~/shared/ui/dapp-inline-alert'
import { readErrorText } from '~/web3/errors/error-text'
import { ExchangeBalanceSkeleton } from '~/app/shell/dapp-skeleton'

export function BurnExchangeWidget({ burn }: { burn: BurnExchangeState }) {
  const { messages: t } = useI18n()
  const setView = useExchangeViewStore((state) => state.setView)
  const { sessionReady } = useDappShell()
  const { pair } = burn
  const showRateSkeleton = burn.isExchangePriceQuoting && !burn.exchangePriceLabel
  const showBuyAmountSkeleton = sessionReady && burn.isQuoting && burn.sellAmount.trim().length > 0
  const exchangePreview = !sessionReady

  const sellBalanceLabel = exchangePreview ? (
    `${t.exchange.balance}: 0.00`
  ) : burn.isBalancesLoading ? (
    <>
      {t.exchange.balance}: <ExchangeBalanceSkeleton />
    </>
  ) : (
    `${t.exchange.balance}: ${burn.walletReady ? burn.sellBalanceLabel : '—'}`
  )

  const buyBalanceLabel = exchangePreview ? (
    `${t.exchange.burn.currentContribution}: 0.00`
  ) : burn.isBalancesLoading ? (
    <>
      {t.exchange.burn.currentContribution}: <ExchangeBalanceSkeleton />
    </>
  ) : (
    `${t.exchange.burn.currentContribution}: ${burn.walletReady ? burn.contributionBalanceLabel : '—'}`
  )

  function resolveBurnMessage(error: unknown) {
    const raw = readErrorText(error)
    const gateMessages = t.exchange.burn.gates
    if (raw === BURN_GATE_ERROR.paused) return gateMessages.paused
    if (raw === BURN_GATE_ERROR.belowMin) return gateMessages.belowMin
    if (raw === BURN_GATE_ERROR.aboveMax) return gateMessages.aboveMax
    if (raw === BURN_GATE_ERROR.zeroRate) return gateMessages.zeroRate

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

  const gateHint = burn.gate != null ? t.exchange.burn.gates[burn.gate] : null

  const submitErrorMessage =
    !burn.error || burn.isSubmitting ? null : resolveBurnMessage(burn.error)

  async function handleSubmit() {
    const result = await burn.submit()
    if (result.ok) {
      toast.success(t.exchange.exchangeSuccess)
      return
    }
    if (result.error != null) {
      presentUserFacingError(result.error, resolveBurnMessage)
    }
  }

  const presentValidationError = useEffectEvent((error: unknown) => {
    presentUserFacingError(error, resolveBurnMessage, {
      id: 'burn-exchange-quote-error',
    })
  })

  useEffect(() => {
    if (!burn.validationError) return
    presentValidationError(burn.validationError)
  }, [burn.quoteErrorUpdatedAt, burn.validationError])

  return (
    <>
      <DappTabHeader
        backText={t.exchange.backToHub}
        onBack={() => setView('hub')}
        subtitle={t.exchange.burn.subtitle}
        title={t.exchange.burn.title}
      />
      <DappWidgetStack className="gap-0">
        <ExchangeAmountFlow
          buy={{ symbol: t.exchange.burn.pointsToken }}
          buyAmount={burn.buyAmount}
          buyBalance={buyBalanceLabel}
          buyLabel={t.exchange.burn.receiveLabel}
          middleSlot={
            <div className="flex items-center justify-center py-1.5">
              <ExchangeFlowButton aria-hidden>
                <DappIcon alt="" size="base" src={burnExchangeAssets.flowDown} />
              </ExchangeFlowButton>
            </div>
          }
          onFillPercent={(percent) => burn.fillPercent(percent)}
          onSellAmountChange={burn.setSellAmount}
          sell={pair.sell}
          sellAmountDisplay={burn.sellAmountDisplay}
          sellBalance={sellBalanceLabel}
          sellLabel={t.exchange.burn.sellLabel}
          sessionReady={sessionReady}
          showBuyAmountSkeleton={showBuyAmountSkeleton}
          walletReady={burn.walletReady}
          amountLocked={burn.isSubmitting}
        />

        <DappMetaPanel
          items={[
            {
              label: t.exchange.burn.burnRate,
              value: showRateSkeleton ? (
                <ExchangeMetaValueSkeleton />
              ) : (
                burn.exchangePriceLabel || '—'
              ),
            },
            {
              label: t.exchange.burn.destination,
              value: t.exchange.burn.destinationValue,
            },
            {
              label: t.exchange.provider,
              value: (
                <>
                  {t.exchange.burn.providerName}
                  <button
                    aria-label={t.exchange.burn.openProvider}
                    className="duration-dapp-fast grid size-6 shrink-0 cursor-pointer place-items-center rounded-md border-0 bg-transparent p-0 transition-opacity ease-out hover:opacity-80"
                    onClick={() =>
                      window.open(
                        bscscanAddress(burn.providerAddress),
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

        {sessionReady && burn.walletReady ? (
          <DappActionRow className="mt-3.5 max-dapp:mt-3">
            <DappActionButton
              className="col-span-full"
              density="external"
              disabled={!burn.canSubmit}
              loading={burn.isSubmitting}
              onClick={() => void handleSubmit()}
            >
              {t.exchange.burn.action}
            </DappActionButton>
          </DappActionRow>
        ) : null}

        {!sessionReady ? <DappWidgetConnectPromo className="mt-3.5" /> : null}

        {gateHint ? (
          <DappInlineAlert className="mt-3" role="status">
            {gateHint}
          </DappInlineAlert>
        ) : null}

        {submitErrorMessage ? (
          <DappInlineAlert className="mt-3" role="alert">
            {submitErrorMessage}
          </DappInlineAlert>
        ) : null}
      </DappWidgetStack>
    </>
  )
}
