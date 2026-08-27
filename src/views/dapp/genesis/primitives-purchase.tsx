/**
 * 创世购买表单与份额输入
 */

import type { RefObject } from 'react'

import { formatTokenAmount } from '~/core/exchange/token-amount'
import { USD1_DECIMALS } from '~/core/presale/presale-math'
import { interpolate } from '~/i18n/interpolate'
import { FieldActionChip } from '~/shared/components/chip'
import { FormActions } from '~/shared/components/form-actions'
import { FormInfoCard } from '~/shared/components/form-info-card'
import { Input } from '~/shared/components/input'
import { MainButton } from '~/shared/components/main-button'
import { Text } from '~/shared/components/text'
import { Tooltip } from '~/shared/components/tooltip'
import { cn, revealClass } from '~/shared/lib/utils'
import { formatNumber } from '~/shared/presenters/format'
import type { GenesisSessionState } from '~/views/dapp/genesis/genesis-session-host'
import { GenesisSeasonCarousel, SeasonOptionSkeleton } from '~/views/dapp/genesis/primitives-season'
import { useGenesisDock } from '~/views/dapp/genesis/use-genesis-dock'
import { DockConnectPromo } from '~/views/dapp/shared/dock-connect-promo'
import { goBindReferral } from '~/views/dapp/shared/navigation'

export function GenesisPurchaseSharesField({
  disabled,
  inputRef,
  label,
  max,
  maxLabel,
  min,
  onBlur,
  onChange,
  onMax,
  shareUnit,
  value,
}: {
  disabled: boolean
  inputRef: RefObject<HTMLInputElement | null>
  label: string
  max: number
  maxLabel: string
  min: number
  onBlur: () => void
  onChange: (value: string) => void
  onMax: () => void
  shareUnit: string
  value: string
}) {
  return (
    <label className="mt-1.5 grid gap-2">
      <Text as="span" variant="support" tone="muted-foreground">
        {label}
      </Text>
      <div className="flex gap-2">
        <div className="relative flex min-w-0 flex-1">
          <Input
            ref={inputRef}
            variant="numeric"
            className="pr-10 text-base font-bold"
            disabled={disabled}
            max={max}
            min={min}
            onBlur={onBlur}
            onChange={(event) => onChange(event.currentTarget.value)}
            placeholder="0"
            type="number"
            value={value}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-sm text-muted-foreground"
          >
            {shareUnit}
          </span>
        </div>
        <FieldActionChip disabled={disabled} onClick={onMax}>
          {maxLabel}
        </FieldActionChip>
      </div>
    </label>
  )
}

/**
 * 创世购买表单
 *
 * 顶部为季度选择轮播，下方为份额输入与购买清单；
 * 钱包切换时由父级以 key={address} 重建本组件以清空草稿，
 * 无需用副作用去镜像 genesis.shares。
 */
export function GenesisPurchaseForm({ genesis }: { genesis: GenesisSessionState }) {
  const vm = useGenesisDock(genesis)
  const { t } = vm

  return (
    <>
      {genesis.isLoading && genesis.seasonOptions.length === 0 ? (
        <div aria-busy="true" className={cn(revealClass(), 'mb-1.5 overflow-hidden')} data-reveal>
          <div className="flex gap-2.5">
            <SeasonOptionSkeleton />
            <SeasonOptionSkeleton />
            <SeasonOptionSkeleton />
          </div>
        </div>
      ) : genesis.seasonOptions.length > 0 ? (
        <GenesisSeasonCarousel
          activePhaseIndex={genesis.activeSeasonNumber - 1}
          seasons={genesis.seasonOptions}
        />
      ) : null}

      <GenesisPurchaseSharesField
        disabled={!vm.walletReady || genesis.maxShares <= 0 || genesis.isSubmitting}
        inputRef={vm.sharesInputRef}
        label={interpolate(t.genesis.shares, {
          min: formatTokenAmount(genesis.minAmount, USD1_DECIMALS, 0),
          max: formatNumber(genesis.maxShares, { digits: 0, trimZeros: true }),
        })}
        max={Math.max(genesis.maxShares, 1)}
        maxLabel={t.common.max}
        min={1}
        onBlur={vm.handleSharesBlur}
        onChange={vm.handleSharesChange}
        onMax={vm.handleSharesMax}
        shareUnit={t.common.shareUnit}
        value={vm.sharesTextDisplay}
      />

      <FormInfoCard>
        <FormInfoCard.Rows
          items={[
            { label: t.genesis.quota, value: genesis.quotaLabel },
            { label: t.genesis.pay, value: genesis.payUsd1Label },
            { label: t.genesis.receive, value: `${genesis.estimatedAgxLabel} AGX` },
            { label: t.genesis.value, value: genesis.contributionValueLabel },
            {
              // 该行 Label 已自带样式，内层勿再套 Text variant/tone
              label: (
                <span className="inline-flex items-center gap-1">
                  {t.genesis.xTokenAirdrop}
                  <Tooltip.Info content={vm.xTokenAirdropHint} />
                </span>
              ),
              value: genesis.xTokenAirdropLabel,
            },
          ]}
        />
      </FormInfoCard>

      {vm.walletReady ? (
        <FormActions className="grid-cols-1">
          {vm.programEnded ? (
            <MainButton className="min-h-11" density="card" disabled variant="primary">
              {t.genesis.joinEnded}
            </MainButton>
          ) : genesis.needsReferralBind ? (
            <MainButton density="card" onClick={() => goBindReferral()} variant="primary">
              {t.genesis.goBindReferrer}
            </MainButton>
          ) : (
            <MainButton
              className="min-h-11"
              density="card"
              disabled={!genesis.canPurchase || genesis.isSubmitting}
              loading={genesis.isSubmitting}
              onClick={() => void vm.handlePurchase()}
              variant="primary"
            >
              {vm.purchaseCtaLabel}
            </MainButton>
          )}
        </FormActions>
      ) : (
        <DockConnectPromo />
      )}
    </>
  )
}
