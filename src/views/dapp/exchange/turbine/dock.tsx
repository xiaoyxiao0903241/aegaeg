/**
 * Turbine 左栏 Dock
 *
 * 解锁段：输入 gAGX 数量并预览等值的 USD1 / AGX 换算；
 * 领取段：冷却卡列表，到期后可提取。
 * 应付 USD1 按报价加用户滑点，满额不超过全配额报价。
 */
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { dappAssets, turbineExchangeAssets } from '~/shared/assets/dapp'
import { AmountBox } from '~/shared/components/amount-box'
import { FormActions } from '~/shared/components/form-actions'
import { FormInfoCard } from '~/shared/components/form-info-card'
import { Icon } from '~/shared/components/icon'
import { Segment } from '~/shared/components/segment'
import { Text } from '~/shared/components/text'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { bscscanAddress } from '~/shared/config/explorer'
import type { TurbineExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import { formatExchangeBalanceLabel } from '~/views/dapp/exchange/labels'
import { ExchangeSlippagePanel } from '~/views/dapp/exchange/market-trade/slippage-panel'
import { ExchangeOneWayFlowIndicator, PercentButtonRow } from '~/views/dapp/exchange/primitives'
import { TokenChip } from '~/views/dapp/exchange/primitives'
import { TurbineClaimCard, TurbineEqBuyTokenCell } from '~/views/dapp/exchange/turbine/primitives'
import { useTurbine } from '~/views/dapp/exchange/turbine/use-turbine'
import { DockConnectPromo } from '~/views/dapp/shared/dock-connect-promo'
import { DockStack } from '~/views/dapp/shared/dock-frame'
import { SessionButton } from '~/views/dapp/shared/session-button'
import { TabHeader } from '~/views/dapp/shared/tab-header'

export function TurbineDock({ turbine }: { turbine: TurbineExchangeState }) {
  const vm = useTurbine(turbine)
  const { t } = vm
  const unlock = turbine.pair.unlock

  const unlockableBalance = formatExchangeBalanceLabel({
    label: t.exchange.turbine.unlockable,
    value: vm.unlockableAmountLabel,
  })
  const usd1Balance = (
    <>
      <span className="whitespace-nowrap">{t.exchange.balance} </span>
      <span className="break-all">{vm.usd1AmountLabel}</span>
    </>
  )

  return (
    <TabHeader
      backText={t.exchange.backToHub}
      onBack={vm.onBack}
      subtitle={t.exchange.hub.modes.turbine.body}
      title={t.exchange.turbine.title}
    >
      <DockStack>
        <Segment
          aria-label={t.exchange.turbine.segmentAriaLabel}
          disabled={turbine.isSubmitting}
          onChange={(value) => turbine.setSegment(value as 'unlock' | 'claim')}
          options={vm.segmentOptions}
          size="lg"
          tone="ink"
          value={turbine.segment}
        />

        {turbine.segment === 'unlock' ? (
          <>
            <div className="flex flex-col gap-1.5">
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
                disabled={(!vm.exchangePreview && !turbine.walletReady) || turbine.isSubmitting}
                formatLabel={(percent) => (percent === 100 ? 'Max' : `${percent}%`)}
                onSelect={(percent) => turbine.fillPercent(percent)}
              />
            </div>

            <div className="flex items-center justify-center py-1.5">
              <ExchangeOneWayFlowIndicator />
            </div>

            {/* 等值买入卡片：提示文字弱化 */}
            <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
              <Text as="p" variant="copy" className="text-foreground/40">
                {t.exchange.turbine.equivalentBuyHint}
              </Text>
              <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-3 max-dapp:grid-cols-1">
                <TurbineEqBuyTokenCell
                  footer={usd1Balance}
                  icon={turbine.pair.pay.icon}
                  label={t.exchange.turbine.payUsd1Label}
                  value={turbine.payUsd1Label}
                />
                <Icon
                  alt=""
                  className="size-3.5 shrink-0 self-center max-dapp:rotate-90 max-dapp:justify-self-center"
                  size="base"
                  src={turbineExchangeAssets.eqBuyArrow}
                />
                <TurbineEqBuyTokenCell
                  footer={t.exchange.turbine.buyToBoundWallet}
                  icon={turbine.pair.buy.icon}
                  label={t.exchange.turbine.buyAgxLabel}
                  value={turbine.buyAgxLabel}
                />
              </div>
            </div>

            <FormInfoCard>
              <FormInfoCard.Rows
                items={[
                  {
                    label: t.exchange.turbine.agxPrice,
                    value: turbine.agxPriceLabel || '—',
                  },
                  {
                    label: t.exchange.allowedSlippage,
                    value: (
                      <ExchangeSlippagePanel
                        autoPercent={turbine.autoSlippagePercent}
                        customText={turbine.slippageCustomText}
                        disabled={vm.sessionReady && !turbine.walletReady}
                        hint={t.exchange.turbine.slippageHint}
                        mode={turbine.slippageMode}
                        onCustomTextChange={turbine.setSlippageCustomText}
                        onModeChange={turbine.setSlippageMode}
                        slippage={turbine.slippage}
                      />
                    ),
                    valueClassName: 'inline-flex items-center justify-end gap-1',
                  },
                  {
                    label: t.exchange.turbine.willReceiveAgx,
                    value: vm.willReceiveLabel,
                  },
                  {
                    label: t.exchange.turbine.unlockRatio,
                    value: t.exchange.turbine.unlockRatioValue,
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
                          <Icon alt="" className="size-2.5" src={dappAssets.arrowUpRight} />
                        </button>
                      </>
                    ),
                    valueClassName: 'inline-flex items-center justify-end gap-1',
                  },
                ]}
              />
            </FormInfoCard>

            <FormActions>
              <SessionButton
                className="col-span-full"
                density="external"
                disabled={!turbine.canUnlock}
                loading={turbine.isSubmitting && turbine.claimingIndex == null}
                onClick={() => void vm.handleUnlock()}
              >
                {t.exchange.turbine.unlockAction}
              </SessionButton>
            </FormActions>
          </>
        ) : (
          <div className="flex flex-col gap-2.5">
            {turbine.silences.length === 0 ? (
              <Text as="p" variant="copy" className="my-6 text-center text-foreground/40">
                {t.exchange.turbine.claimEmpty}
              </Text>
            ) : (
              turbine.silences.map((row) => (
                <TurbineClaimCard
                  amountLabel={formatTokenAmount(
                    row.silenceBalance,
                    EXCHANGE_CONFIG.tokens.agx.decimals,
                    {
                      digits: 4,
                      trimZeros: false,
                      suffix: ' gAGX',
                    },
                  )}
                  claimLabel={t.exchange.turbine.claimAction}
                  claimableLabel={t.exchange.turbine.claimable}
                  coolingLabel={t.exchange.turbine.cooling}
                  cooldownDoneLabel={t.exchange.turbine.cooldownDone}
                  countdownLabel={t.exchange.turbine.countdownLabel}
                  disabled={!row.vested || turbine.isSubmitting}
                  hourUnit={t.exchange.turbine.countdownHours}
                  icon={unlock.icon}
                  key={`${row.index}-${row.startTime.toString()}`}
                  loading={turbine.isSubmitting && turbine.claimingIndex === row.index}
                  minuteUnit={t.exchange.turbine.countdownMinutes}
                  onClaim={() => void vm.handleClaim(row.index)}
                  unlockAt={row.unlockAt}
                  vested={row.vested}
                />
              ))
            )}
          </div>
        )}

        {!turbine.walletReady ? <DockConnectPromo /> : null}
      </DockStack>
    </TabHeader>
  )
}
