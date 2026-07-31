import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { bscscanAddress } from '~/shared/config/explorer'
import { flashExchangeAssets, turbineExchangeAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappActionRow } from '~/app/shell/dapp-action-row'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { ExchangeBalanceSkeleton, ExchangeMetaValueSkeleton } from '~/app/shell/dapp-skeleton'
import type { TurbineExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import { useTurbineExchangeView } from '~/views/dapp/exchange/turbine/use-turbine-exchange-view'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { DappMetaPanel } from '~/app/shell/dapp-meta-panel'
import { ExchangeOneWayFlowIndicator } from '~/views/dapp/exchange/exchange-flow-button'
import { AmountBox } from '~/shared/ui/amount-box'
import { TokenChip } from '~/app/shell/token-chip'
import { Segment } from '~/shared/ui/segment'
import { PercentButtonRow } from '~/views/dapp/exchange/percent-button-row'
import { Text } from '~/shared/ui/text'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { formatBlockTime } from '~/shared/api/format-display'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { cn } from '~/shared/lib/utils'

export function TurbineExchangeWidget({ turbine }: { turbine: TurbineExchangeState }) {
  const vm = useTurbineExchangeView(turbine)
  const { t } = vm
  const unlock = turbine.pair.unlock

  const unlockableBalance = vm.showBalanceSkeleton ? (
    <>
      {t.exchange.turbine.unlockable}: <ExchangeBalanceSkeleton />
    </>
  ) : (
    `${t.exchange.turbine.unlockable}: ${vm.unlockableAmountLabel}`
  )

  const usd1Balance = vm.showBalanceSkeleton ? (
    <>
      {t.exchange.balance} <ExchangeBalanceSkeleton />
    </>
  ) : (
    `${t.exchange.balance} ${vm.usd1AmountLabel}`
  )

  const willReceiveValue = vm.showWillReceiveSkeleton ? (
    <ExchangeMetaValueSkeleton />
  ) : (
    vm.willReceiveLabel
  )

  return (
    <>
      <DappTabHeader
        backText={t.exchange.backToHub}
        onBack={vm.onBack}
        subtitle={t.exchange.hub.modes.turbine.body}
        title={t.exchange.turbine.title}
      />
      <DappWidgetStack className="gap-0">
        <Segment
          aria-label={t.exchange.turbine.segmentAriaLabel}
          className="mb-3.5"
          disabled={turbine.isSubmitting}
          onChange={(value) => turbine.setSegment(value as 'unlock' | 'claim')}
          options={vm.segmentOptions}
          tone="ink"
          value={turbine.segment}
        />

        {turbine.segment === 'unlock' ? (
          <>
            <AmountBox
              amountProps={{
                'aria-label': `${unlock.symbol} unlock amount`,
                disabled: vm.sellDisabled,
                inputMode: 'decimal',
                onChange: (event) => turbine.setUnlockAmount(event.currentTarget.value),
                placeholder: '0.00',
                value: turbine.unlockAmountDisplay,
              }}
              balance={unlockableBalance}
              className="p-4"
              label={t.exchange.turbine.unlockLabel}
              sessionReady={vm.sessionReady}
              startAdornment={<TokenChip icon={unlock.icon} label={unlock.symbol} />}
            />

            <PercentButtonRow
              aria-label={`${unlock.symbol} unlock percent`}
              className="pt-2.5 max-dapp:mt-3 max-dapp:py-0"
              disabled={(!vm.exchangePreview && !turbine.walletReady) || turbine.isSubmitting}
              onSelect={(percent) => turbine.fillPercent(percent)}
            />

            <div className="flex items-center justify-center py-1.5">
              <ExchangeOneWayFlowIndicator />
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
              <Text as="p" variant="support" tone="muted-foreground">
                {t.exchange.turbine.equivalentBuyHint}
              </Text>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="flex min-w-0 flex-col gap-1.5 rounded-[10px] bg-background p-3">
                  <Text as="p" variant="caption" tone="muted-foreground">
                    {t.exchange.turbine.payUsd1Label}
                  </Text>
                  <div className="flex items-center gap-2">
                    <DappIcon
                      alt=""
                      className="size-5 rounded-md"
                      size="token"
                      src={turbine.pair.pay.icon}
                    />
                    <Text as="span" variant="copy" className="font-semibold">
                      {vm.sessionReady && turbine.isQuoting ? (
                        <ExchangeMetaValueSkeleton />
                      ) : (
                        turbine.payUsd1Label || '—'
                      )}
                    </Text>
                  </div>
                  <Text as="p" variant="caption" tone="muted-foreground">
                    {usd1Balance}
                  </Text>
                </div>
                <DappIcon
                  alt=""
                  className="size-3.5 shrink-0"
                  size="base"
                  src={turbineExchangeAssets.eqBuyArrow}
                />
                <div className="flex min-w-0 flex-col gap-1.5 rounded-[10px] bg-background p-3">
                  <Text as="p" variant="caption" tone="muted-foreground">
                    {t.exchange.turbine.buyAgxLabel}
                  </Text>
                  <div className="flex items-center gap-2">
                    <DappIcon
                      alt=""
                      className="size-5 rounded-md"
                      size="token"
                      src={turbine.pair.buy.icon}
                    />
                    <Text as="span" variant="copy" className="font-semibold">
                      {vm.sessionReady && turbine.isQuoting ? (
                        <ExchangeMetaValueSkeleton />
                      ) : (
                        turbine.buyAgxLabel
                      )}
                    </Text>
                  </div>
                  <Text as="p" variant="caption" tone="muted-foreground">
                    {t.exchange.turbine.buyToBoundWallet}
                  </Text>
                </div>
              </div>
            </div>

            <DappMetaPanel
              items={[
                {
                  label: t.exchange.turbine.agxPrice,
                  value: turbine.isAgxPriceQuoting ? (
                    <ExchangeMetaValueSkeleton />
                  ) : (
                    turbine.agxPriceLabel || '—'
                  ),
                },
                {
                  label: t.exchange.allowedSlippage,
                  // No user slippage UI on turbine; do not hardcode a fake floor.
                  value: '—',
                },
                {
                  label: t.exchange.turbine.willReceiveAgx,
                  value: willReceiveValue,
                },
                {
                  label: t.exchange.turbine.unlockRatio,
                  value: turbine.isUnlockRatioQuoting ? (
                    <ExchangeMetaValueSkeleton />
                  ) : (
                    turbine.unlockRatioLabel || '—'
                  ),
                },
                {
                  label: t.exchange.turbine.cooldown,
                  value:
                    turbine.cooldownHours == null
                      ? '—'
                      : t.exchange.turbine.cooldownHoursValue.replace(
                          '{hours}',
                          String(turbine.cooldownHours),
                        ),
                },
                {
                  label: t.exchange.provider,
                  value: (
                    <>
                      {t.exchange.providerName}
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

            {vm.sessionReady && turbine.walletReady ? (
              <DappActionRow className="mt-3.5 max-dapp:mt-3">
                <DappActionButton
                  className="col-span-full"
                  density="external"
                  disabled={!turbine.canUnlock}
                  loading={turbine.isSubmitting && turbine.claimingIndex == null}
                  onClick={() => void vm.handleUnlock()}
                >
                  {t.exchange.turbine.unlockAction}
                </DappActionButton>
              </DappActionRow>
            ) : null}
          </>
        ) : (
          <div className="flex flex-col gap-2.5">
            {!vm.exchangePreview && turbine.isSilencesLoading ? (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-3">
                <ExchangeBalanceSkeleton />
              </div>
            ) : turbine.silences.length === 0 ? (
              <Text as="p" variant="copy" className="my-6 text-center text-black/40">
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
                        // Handbook §16: silenceBalance axis = AGX decimals (UI leaf labels gAGX).
                        EXCHANGE_CONFIG.tokens.agx.decimals,
                        4,
                      )}{' '}
                      gAGX
                    </Text>
                    <Text as="p" variant="support" tone="muted-foreground">
                      {row.vested
                        ? t.exchange.turbine.claimReady
                        : t.exchange.turbine.claimCoolingUntil.replace(
                            '{time}',
                            formatBlockTime(Number(row.unlockAt)),
                          )}
                    </Text>
                  </div>
                  {vm.sessionReady && turbine.walletReady ? (
                    <DappActionButton
                      density="external"
                      disabled={!row.vested || turbine.isSubmitting}
                      loading={turbine.claimingIndex === row.index}
                      onClick={() => void vm.handleClaim(row.index)}
                    >
                      {t.exchange.turbine.claimAction}
                    </DappActionButton>
                  ) : null}
                </div>
              ))
            )}
          </div>
        )}

        {!vm.sessionReady ? <DappWidgetConnectPromo className="mt-3.5" /> : null}
      </DappWidgetStack>
    </>
  )
}
