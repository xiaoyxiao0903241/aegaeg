import { useEffect, useEffectEvent, useState } from 'react'
import { useExchangeViewStore } from '~/stores/exchange-view-store'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
import { bscscanAddress } from '~/shared/config/explorer'
import { flashExchangeAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappActionRow } from '~/app/shell/dapp-action-row'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { ExchangeMetaValueSkeleton } from '~/app/shell/dapp-skeleton'
import type { FlashExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import { useDappShell } from '~/app/use-dapp-shell'
import {
  resolveExchangeUserFacingMessage,
  resolveFlashExchangeError,
} from '~/web3/resolve-contract-error-message'
import { presentUserFacingError } from '~/web3/present-user-facing-error'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { DappMetaPanel } from '~/app/shell/dapp-meta-panel'
import {
  ExchangeFlowButton,
  ExchangeOneWayFlowIndicator,
  exchangeFlipCard,
} from '~/views/dapp/exchange/exchange-flow-button'
import { ExchangeAmountFlow } from '~/views/dapp/exchange/exchange-amount-flow'
import { useExchangeBalanceLabels } from '~/views/dapp/exchange/use-exchange-balance-labels'
import { AnchoredTooltip } from '~/shared/ui/anchored-tooltip'
import { DappInlineAlert } from '~/shared/ui/dapp-inline-alert'
import { Segment } from '~/shared/ui/segment'

/** Keep in sync with market-trade + `exchange-card-flip` (theme.css). */
const EXCHANGE_FLIP_APPLY_MS = 160
const EXCHANGE_FLIP_SETTLE_MS = 320

export function FlashExchangeWidget({ flash }: { flash: FlashExchangeState }) {
  const { messages: t } = useI18n()
  const setView = useExchangeViewStore((state) => state.setView)
  const { sessionReady } = useDappShell()
  const [isFlipping, setIsFlipping] = useState(false)
  const [rotation, setRotation] = useState(0)
  const { pair } = flash
  const flipCardClass = exchangeFlipCard({ flipping: isFlipping })
  const showRateSkeleton = flash.isExchangePriceQuoting && !flash.exchangePriceLabel
  const showBuyAmountSkeleton =
    sessionReady && flash.isQuoting && flash.sellAmount.trim().length > 0

  const flashPairOptions = [
    { label: t.exchange.flash.pairs.gagx, value: 'gagx' },
    { label: t.exchange.flash.pairs.usdt, value: 'usdt' },
  ]

  const { buyLabel, sellLabel } = useExchangeBalanceLabels({
    buyBalanceLabel: flash.buyBalanceLabel,
    isBalancesLoading: flash.isBalancesLoading,
    sellBalanceLabel: flash.sellBalanceLabel,
    sessionReady,
    walletReady: flash.walletReady,
  })

  function handleFlip() {
    if (!flash.canFlip) return
    if (sessionReady && !flash.walletReady) return
    if (isFlipping || flash.isSubmitting) return
    setIsFlipping(true)
    setRotation((prev) => prev + 180)
    window.setTimeout(() => {
      flash.flipDirection()
    }, EXCHANGE_FLIP_APPLY_MS)
    window.setTimeout(() => {
      setIsFlipping(false)
    }, EXCHANGE_FLIP_SETTLE_MS)
  }

  function resolveFlashMessage(error: unknown) {
    return (
      resolveFlashExchangeError(error, t.exchange.flash.gates) ??
      resolveExchangeUserFacingMessage(
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
    )
  }

  const gateHint = flash.usd1Gate != null ? t.exchange.flash.gates[flash.usd1Gate] : null

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
      <DappTabHeader
        backText={t.exchange.backToHub}
        onBack={() => setView('hub')}
        /* Figma `4430:265`: col gap16 · intro 13 · panel title already 21 */
        className="gap-4 [&_p]:text-[13px] [&_p]:leading-normal"
        subtitle={t.exchange.flash.intros[flash.introKey]}
        title={t.exchange.flash.title}
      />
      <DappWidgetStack className="gap-0">
        <Segment
          aria-label={t.exchange.flash.pairAriaLabel}
          className="mb-3"
          disabled={flash.isSubmitting || isFlipping}
          onChange={flash.setPairId}
          options={flashPairOptions}
          tone="ink"
          value={flash.pairId}
        />

        <ExchangeAmountFlow
          amountBoxClassName={flash.canFlip ? flipCardClass : undefined}
          buy={pair.buy}
          buyAmount={flash.buyAmount}
          buyBalance={buyLabel}
          middleSlot={
            <div className="flex items-center justify-center py-1.5">
              {flash.canFlip ? (
                <AnchoredTooltip content={t.exchange.flip}>
                  <ExchangeFlowButton
                    aria-label={t.exchange.flip}
                    disabled={
                      flash.isSubmitting || isFlipping || (sessionReady && !flash.walletReady)
                    }
                    interactive
                    onClick={handleFlip}
                  >
                    <span
                      className="duration-dapp-emphasis grid place-items-center transition-transform ease-dapp"
                      style={{ transform: `rotate(${rotation}deg)` }}
                    >
                      <span className="grid size-4 place-items-center">
                        <span className="-rotate-90">
                          <DappIcon alt="" size="base" src={flashExchangeAssets.flowDivider} />
                        </span>
                      </span>
                    </span>
                  </ExchangeFlowButton>
                </AnchoredTooltip>
              ) : (
                <ExchangeOneWayFlowIndicator />
              )}
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
          amountLocked={flash.isSubmitting || isFlipping}
        />

        <DappMetaPanel
          className="gap-2.5"
          items={[
            {
              label: t.exchange.exchangePrice,
              value: showRateSkeleton ? (
                <ExchangeMetaValueSkeleton />
              ) : (
                flash.exchangePriceLabel || '—'
              ),
            },
            {
              label: t.exchange.route,
              value: flash.routeLabel,
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
                        bscscanAddress(flash.providerAddress),
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
