import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
import { bscscanAddress } from '~/shared/config/explorer'
import { dappAssets, flashExchangeAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappActionRow } from '~/app/shell/dapp-action-row'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { ExchangeBalanceSkeleton, ExchangeMetaValueSkeleton } from '~/app/shell/dapp-skeleton'
import type { TurbineExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import { useDappShell } from '~/app/use-dapp-shell'
import { resolveExchangeUserFacingMessage } from '~/web3/resolve-contract-error-message'
import { presentUserFacingError } from '~/web3/present-user-facing-error'
import {
  ExchangeAmountFlow,
  ExchangeFlowButton,
  ExchangeMetaPanel,
  ExchangeSubpageHeader,
  ExchangeWidgetBody,
} from '~/views/dapp/exchange/exchange-widget-composites'
import { AmountBox } from '~/shared/ui/amount-box'
import { TokenChip } from '~/app/shell/token-chip'
import { DappInlineAlert } from '~/shared/ui/dapp-inline-alert'
import { Segment } from '~/shared/ui/segment'
import { Text } from '~/shared/ui/text'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { cn } from '~/shared/lib/utils'

export function TurbineExchangeWidget({ turbine }: { turbine: TurbineExchangeState }) {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const exchangePreview = !sessionReady
  const showBalanceSkeleton = !exchangePreview && turbine.isBalancesLoading

  const segmentOptions = [
    { label: t.exchange.turbine.segments.unlock, value: 'unlock' },
    { label: t.exchange.turbine.segments.claim, value: 'claim' },
  ]

  const unlockableBalance = showBalanceSkeleton ? (
    <>
      {t.exchange.turbine.unlockable}: <ExchangeBalanceSkeleton />
    </>
  ) : exchangePreview ? (
    `${t.exchange.turbine.unlockable}: 0.00`
  ) : (
    `${t.exchange.turbine.unlockable}: ${turbine.walletReady ? turbine.quotaLabel : '—'} AGX`
  )

  const usd1Balance = showBalanceSkeleton ? (
    <>
      {t.exchange.balance}: <ExchangeBalanceSkeleton />
    </>
  ) : exchangePreview ? (
    `${t.exchange.balance}: 0.00`
  ) : (
    `${t.exchange.balance}: ${turbine.walletReady ? turbine.usd1BalanceLabel : '—'}`
  )

  function resolveTurbineMessage(error: unknown) {
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
    !turbine.error || turbine.isSubmitting ? null : resolveTurbineMessage(turbine.error)

  async function handleUnlock() {
    const result = await turbine.submitUnlock()
    if (result.ok) {
      toast.success(t.exchange.turbine.unlockSuccess)
      return
    }
    if (result.error != null) presentUserFacingError(result.error, resolveTurbineMessage)
  }

  async function handleClaim(index: number) {
    const result = await turbine.submitClaim(index)
    if (result.ok) {
      toast.success(t.exchange.turbine.claimSuccess)
      return
    }
    if (result.error != null) presentUserFacingError(result.error, resolveTurbineMessage)
  }

  return (
    <>
      <ExchangeSubpageHeader
        subtitle={t.exchange.hub.modes.turbine.body}
        title={t.exchange.turbine.title}
      />
      <ExchangeWidgetBody bodyClassName="gap-0">
        <Segment
          aria-label={t.exchange.turbine.segmentAriaLabel}
          className="mb-3.5"
          disabled={turbine.isSubmitting}
          onChange={(value) => turbine.setSegment(value as 'unlock' | 'claim')}
          options={segmentOptions}
          tone="ink"
          value={turbine.segment}
        />

        {turbine.segment === 'unlock' ? (
          <>
            <ExchangeAmountFlow
              buy={turbine.pair.buy}
              buyAmount={turbine.buyAgxLabel}
              buyBalance={t.exchange.turbine.buyToBoundWallet}
              buyLabel={t.exchange.turbine.buyAgxLabel}
              middleSlot={
                <div className="flex items-center justify-center py-1.5">
                  <ExchangeFlowButton aria-hidden>
                    <DappIcon alt="" className="rotate-90" size="base" src={dappAssets.chevron} />
                  </ExchangeFlowButton>
                </div>
              }
              onFillPercent={(percent) => turbine.fillPercent(percent)}
              onSellAmountChange={turbine.setUnlockAmount}
              sell={turbine.pair.unlock}
              sellAmountDisplay={turbine.unlockAmountDisplay}
              sellBalance={unlockableBalance}
              sellLabel={t.exchange.turbine.unlockLabel}
              sessionReady={sessionReady}
              showBuyAmountSkeleton={sessionReady && turbine.isQuoting}
              walletReady={turbine.walletReady}
              amountLocked={turbine.isSubmitting}
            />

            <div className="mt-3.5 grid gap-2">
              <Text as="p" variant="support" tone="muted-foreground">
                {t.exchange.turbine.equivalentBuyHint}
              </Text>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <AmountBox
                  amountProps={{
                    'aria-label': 'USD1 pay amount',
                    readOnly: true,
                    tabIndex: -1,
                    value: turbine.payUsd1Label,
                    onMouseDown: (event) => event.preventDefault(),
                  }}
                  balance={usd1Balance}
                  label={t.exchange.turbine.payUsd1Label}
                  sessionReady={sessionReady}
                  startAdornment={
                    <TokenChip icon={turbine.pair.pay.icon} label={turbine.pair.pay.symbol} />
                  }
                />
                <DappIcon
                  alt=""
                  className="size-4 text-coral"
                  size="base"
                  src={dappAssets.chevron}
                />
                <AmountBox
                  amountProps={{
                    'aria-label': 'AGX buy amount',
                    readOnly: true,
                    tabIndex: -1,
                    value: turbine.buyAgxLabel,
                    onMouseDown: (event) => event.preventDefault(),
                  }}
                  balance={t.exchange.turbine.buyToBoundWallet}
                  label={t.exchange.turbine.buyAgxLabel}
                  sessionReady={sessionReady}
                  startAdornment={
                    <TokenChip icon={turbine.pair.buy.icon} label={turbine.pair.buy.symbol} />
                  }
                />
              </div>
            </div>

            <ExchangeMetaPanel
              items={[
                {
                  label: t.exchange.turbine.agxPrice,
                  value: sessionReady ? '—' : t.exchange.ratePlaceholder,
                },
                {
                  label: t.exchange.allowedSlippage,
                  // No user slippage UI on turbine; do not hardcode a fake floor.
                  value: '—',
                },
                {
                  label: t.exchange.turbine.willReceiveAgx,
                  value:
                    sessionReady && turbine.isQuoting ? (
                      <ExchangeMetaValueSkeleton />
                    ) : (
                      turbine.buyAgxLabel
                    ),
                },
                {
                  label: t.exchange.turbine.unlockRatio,
                  value: t.exchange.turbine.unlockRatioValue,
                },
                {
                  label: t.exchange.turbine.cooldown,
                  value: turbine.cooldownHoursLabel,
                },
                {
                  label: t.exchange.provider,
                  value: (
                    <>
                      Turbine
                      <button
                        aria-label={t.genesis.viewContract}
                        className="duration-dapp-fast grid size-6 shrink-0 cursor-pointer place-items-center rounded-md border-0 bg-transparent p-0 transition-opacity ease-out hover:opacity-80"
                        onClick={() =>
                          window.open(
                            bscscanAddress(turbine.providerAddress),
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

            {sessionReady && turbine.walletReady ? (
              <DappActionRow className="mt-3.5 max-dapp:mt-3">
                <DappActionButton
                  className="col-span-full"
                  density="external"
                  disabled={!turbine.canUnlock}
                  loading={turbine.isSubmitting && turbine.claimingIndex == null}
                  onClick={() => void handleUnlock()}
                >
                  {t.exchange.turbine.unlockAction}
                </DappActionButton>
              </DappActionRow>
            ) : null}
          </>
        ) : (
          <div className="flex flex-col gap-2.5">
            {turbine.silences.length === 0 ? (
              <Text as="p" variant="copy" tone="muted-foreground">
                {t.exchange.turbine.claimEmpty}
              </Text>
            ) : (
              turbine.silences.map((row) => (
                <div
                  key={`${row.index}-${row.startTime.toString()}`}
                  className={cn(
                    'flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-3',
                  )}
                >
                  <div className="min-w-0">
                    <Text as="p" variant="detail" className="font-semibold">
                      {formatTokenAmount(
                        row.silenceBalance,
                        EXCHANGE_CONFIG.tokens.gagx.decimals,
                        4,
                      )}{' '}
                      gAGX
                    </Text>
                    <Text as="p" variant="support" tone="muted-foreground">
                      {row.vested ? t.exchange.turbine.claimReady : t.exchange.turbine.claimCooling}
                    </Text>
                  </div>
                  {sessionReady && turbine.walletReady ? (
                    <DappActionButton
                      density="external"
                      disabled={!row.vested || turbine.isSubmitting}
                      loading={turbine.claimingIndex === row.index}
                      onClick={() => void handleClaim(row.index)}
                    >
                      {t.exchange.turbine.claimAction}
                    </DappActionButton>
                  ) : null}
                </div>
              ))
            )}
          </div>
        )}

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
