import type { ReactNode } from 'react'

import { flashExchangeAssets, turbineExchangeAssets } from '~/app/assets'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappActionRow } from '~/app/shell/dapp-action-row'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappMetaPanel } from '~/app/shell/dapp-meta-panel'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { TokenChip } from '~/app/shell/token-chip'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { formatBlockTime } from '~/shared/api/format-display'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { bscscanAddress } from '~/shared/config/explorer'
import { cn } from '~/shared/lib/utils'
import { AmountBox } from '~/shared/ui/amount-box'
import { DappCountValue } from '~/shared/ui/dapp-count-value'
import { Segment } from '~/shared/ui/segment'
import { Text } from '~/shared/ui/text'
import { ExchangeOneWayFlowIndicator } from '~/views/dapp/exchange/exchange-flow-button'
import type { TurbineExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import { PercentButtonRow } from '~/views/dapp/exchange/percent-button-row'
import { useTurbineExchangeView } from '~/views/dapp/exchange/turbine/use-turbine-exchange-view'

function TurbineEqBuyTokenCell({
  label,
  icon,
  value,
  footer,
}: {
  label: string
  icon: string
  value: string
  footer: ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5 rounded-control bg-background p-3">
      <Text as="p" variant="caption" tone="muted-foreground">
        {label}
      </Text>
      <div className="flex items-center gap-2">
        <DappIcon alt="" className="size-5 rounded-md" size="token" src={icon} />
        <Text as="span" variant="copy" className="font-semibold">
          <DappCountValue text={value} />
        </Text>
      </div>
      <Text as="p" variant="caption" tone="muted-foreground">
        {typeof footer === 'string' ? <DappCountValue text={footer} /> : footer}
      </Text>
    </div>
  )
}

export function TurbineExchangeWidget({ turbine }: { turbine: TurbineExchangeState }) {
  const vm = useTurbineExchangeView(turbine)
  const { t } = vm
  const unlock = turbine.pair.unlock

  const unlockableBalance = `${t.exchange.turbine.unlockable}: ${vm.unlockableAmountLabel}`
  const usd1Balance = `${t.exchange.balance} ${vm.usd1AmountLabel}`

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
          size="lg"
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
              formatLabel={(percent) => (percent === 100 ? 'Max' : `${percent}%`)}
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
                <TurbineEqBuyTokenCell
                  footer={usd1Balance}
                  icon={turbine.pair.pay.icon}
                  label={t.exchange.turbine.payUsd1Label}
                  value={turbine.payUsd1Label || '0'}
                />
                <DappIcon
                  alt=""
                  className="size-3.5 shrink-0"
                  size="base"
                  src={turbineExchangeAssets.eqBuyArrow}
                />
                <TurbineEqBuyTokenCell
                  footer={t.exchange.turbine.buyToBoundWallet}
                  icon={turbine.pair.buy.icon}
                  label={t.exchange.turbine.buyAgxLabel}
                  value={turbine.buyAgxLabel || '0'}
                />
              </div>
            </div>

            <DappMetaPanel
              className="mt-0 gap-2.5 px-4 py-4.5"
              items={[
                {
                  label: t.exchange.turbine.agxPrice,
                  value: turbine.agxPriceLabel || '0',
                },
                {
                  label: t.exchange.allowedSlippage,
                  // 涡轮无用户滑点 UI；稿演示 0.3% ≠ 钱路 — 诚实空
                  value: '—',
                },
                {
                  label: t.exchange.turbine.willReceiveAgx,
                  value: vm.willReceiveLabel,
                },
                {
                  label: t.exchange.turbine.unlockRatio,
                  value: turbine.unlockRatioLabel || '0',
                },
                {
                  label: t.exchange.turbine.cooldown,
                  value:
                    turbine.cooldownHours == null
                      ? '0'
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
                        className="duration-dapp-fast grid size-4 shrink-0 cursor-pointer place-items-center rounded-md border-0 bg-transparent p-0 transition-opacity ease-out hover:opacity-80"
                        onClick={() =>
                          window.open(
                            bscscanAddress(turbine.providerAddress),
                            '_blank',
                            'noopener,noreferrer',
                          )
                        }
                        type="button"
                      >
                        <DappIcon alt="" size="xs" src={flashExchangeAssets.externalLink} />
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
            {turbine.silences.length === 0 ? (
              <Text as="p" variant="copy" className="my-6 text-center text-black/40">
                {t.exchange.turbine.claimEmpty}
              </Text>
            ) : (
              turbine.silences.map((row) => (
                <div
                  key={`${row.index}-${row.startTime.toString()}`}
                  className={cn(
                    'flex items-center justify-between gap-3 rounded-lg border border-border p-3',
                  )}
                >
                  <div className="min-w-0">
                    <Text as="p" variant="detail" className="font-semibold">
                      <DappCountValue
                        text={`${formatTokenAmount(
                          row.silenceBalance,
                          // Handbook §16: silenceBalance axis = AGX decimals (UI leaf labels gAGX).
                          EXCHANGE_CONFIG.tokens.agx.decimals,
                          4,
                        )} gAGX`}
                      />
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
                  <DappActionButton
                    density="external"
                    disabled={
                      !vm.sessionReady ||
                      !turbine.walletReady ||
                      !row.vested ||
                      turbine.isSubmitting
                    }
                    loading={turbine.isSubmitting && turbine.claimingIndex === row.index}
                    onClick={() => void vm.handleClaim(row.index)}
                  >
                    {t.exchange.turbine.claimAction}
                  </DappActionButton>
                </div>
              ))
            )}
          </div>
        )}

        {!vm.sessionReady || !turbine.walletReady ? <DappWidgetConnectPromo /> : null}
      </DappWidgetStack>
    </>
  )
}
