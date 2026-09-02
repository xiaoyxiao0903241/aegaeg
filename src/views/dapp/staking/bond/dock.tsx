import { bondSoldUsd } from '~/core/staking/bond-sold-usd'
import { BOND_PERIODS, type BondKind, type BondPeriod } from '~/core/staking/staking-period'
import {
  epochRebasePctFrom1e18,
  scenarioPeriodYieldPct,
  YIELD_EPOCHS_PER_DAY,
} from '~/core/staking/staking-yield'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { interpolate } from '~/i18n/interpolate'
import { dappAssets } from '~/shared/assets/dapp'
import { AmountBox } from '~/shared/components/amount-box'
import { AmountTokenEnd } from '~/shared/components/amount-token-end'
import { AmountMaxChip } from '~/shared/components/chip'
import { ExplorerLink } from '~/shared/components/explorer-link'
import { FormActions } from '~/shared/components/form-actions'
import { FormInfoCard } from '~/shared/components/form-info-card'
import { MainButton } from '~/shared/components/main-button'
import { Text } from '~/shared/components/text'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { formatNumber } from '~/shared/presenters/format'
import { DockConnectPromo } from '~/views/dapp/shared/dock-connect-promo'
import { DockStack } from '~/views/dapp/shared/dock-frame'
import { TabHeader } from '~/views/dapp/shared/tab-header'
import { WriteBlockAlert } from '~/views/dapp/shared/write-block-alert'
import { BondPeriodList } from '~/views/dapp/staking/bond/primitives'
import { useBondDock } from '~/views/dapp/staking/bond/use-bond'
import { formatYieldPct } from '~/views/dapp/staking/shared'
import { useLatestSagxRebaseRateQuery } from '~/web3/staking/use-staking-queries'

function parseDiscountPct(label: string): number | null {
  const n = Number(label.replace(/%$/, '').trim())
  return Number.isFinite(n) ? n : null
}

/** 现价 × (折扣% / 100) 得折扣后单价；缺失 → `$0.00`。 */
function formatBondDiscountUsd(spot: number | null, discountLabel: string): string {
  const pct = parseDiscountPct(discountLabel)
  if (spot == null || pct == null) return formatNumber(0, { digits: 2, prefix: '$' })
  return formatNumber(spot * (pct / 100), { digits: 2, prefix: '$' })
}

/**
 * 债券买入表单（LP / 燃烧债券共用）
 *
 * 选择锁定期、输入 USD1 数量后提交买入；
 * 未连接钱包时展示连接引导。
 */
export function BondDock({ kind }: { kind: BondKind }) {
  const {
    t,
    bond,
    copy,
    sessionReady,
    walletReady,
    setView,
    amountLabel,
    ctaLabel,
    blockHint,
    onSubmit,
    periodLabels,
  } = useBondDock(kind)
  const spotUsd = useAgxPriceUsd()
  const rebaseQuery = useLatestSagxRebaseRateQuery()
  const epochPct = epochRebasePctFrom1e18(rebaseQuery.data?.rebaseRate1e18)
  const epochsPerDay = YIELD_EPOCHS_PER_DAY
  const agxDecimals = EXCHANGE_CONFIG.tokens.agx.decimals
  const discountPrices = Object.fromEntries(
    BOND_PERIODS.map((period) => [
      period,
      formatBondDiscountUsd(spotUsd, bond.periodDiscounts[period] || '0'),
    ]),
  ) as Record<BondPeriod, string>
  const soldLabels = Object.fromEntries(
    BOND_PERIODS.map((period) => [
      period,
      formatNumber(bondSoldUsd(bond.periodTotalDeposits[period], spotUsd, agxDecimals) ?? 0, {
        digits: 2,
        prefix: '$',
      }),
    ]),
  ) as Record<BondPeriod, string>
  const yieldLabels = Object.fromEntries(
    BOND_PERIODS.map((period) => {
      const discPct = parseDiscountPct(bond.periodDiscounts[period] || '')
      const pct = scenarioPeriodYieldPct(
        epochPct,
        epochsPerDay,
        period,
        'bond',
        discPct != null && discPct > 0 ? discPct * 100 : null,
      )
      return [period, `${copy.card.yield} ${formatYieldPct(pct)}`]
    }),
  ) as Record<BondPeriod, string>
  const discountUsd = formatBondDiscountUsd(spotUsd, bond.discountLabel)
  const spotLabel =
    spotUsd != null
      ? formatNumber(spotUsd, { digits: 2, prefix: '$' })
      : formatNumber(0, { digits: 2, prefix: '$' })

  return (
    <TabHeader
      backText={t.staking.backToHub}
      onBack={() => setView('hub')}
      subtitle={copy.intro}
      title={copy.title}
    >
      <DockStack>
        <BondPeriodList
          ariaLabel={copy.periodAria}
          copy={copy.card}
          discountPrices={discountPrices}
          discounts={bond.periodDiscounts}
          onChange={bond.setPeriod}
          periodLabel={copy.periodLabel}
          periodLabels={periodLabels}
          soldLabels={soldLabels}
          value={bond.period}
          yieldLabels={yieldLabels}
        />

        <AmountBox
          amountProps={{
            'aria-label': copy.amountAria,
            inputMode: 'decimal',
            onChange: (event) => bond.setAmount(event.target.value),
            placeholder: '0.00',
            value: bond.amountDisplay,
          }}
          endAdornment={
            <AmountTokenEnd>
              <AmountTokenEnd.Token iconSrc={dappAssets.tokenUsd1} symbol="USD1" />
              <AmountMaxChip disabled={!walletReady || bond.isSubmitting} onClick={bond.fillMax}>
                {t.staking.max}
              </AmountMaxChip>
            </AmountTokenEnd>
          }
          headerOutside
          label={amountLabel}
          sessionReady={sessionReady}
          startAdornment={null}
        />

        <FormInfoCard>
          <FormInfoCard.Rows
            items={[
              {
                label: copy.meta.discount.replace(
                  '{pct}',
                  bond.discountLabel === '0' || bond.discountLabel === ''
                    ? '0'
                    : bond.discountLabel.replace(/%$/, ''),
                ),
                value: (
                  <span className="flex items-center gap-2">
                    <Text as="span" className="font-semibold" variant="detail">
                      {discountUsd}
                    </Text>
                    <Text
                      as="span"
                      className="line-through"
                      tone="muted-foreground"
                      variant="support"
                    >
                      {spotLabel}
                    </Text>
                  </span>
                ),
              },
              {
                label: copy.meta.pay,
                value: bond.amountDisplay ? `${bond.amountDisplay} USD1` : '0 USD1',
              },
              {
                label: copy.meta.receive,
                value: bond.isPayoutQuoting
                  ? '0 AGX'
                  : bond.receiveLabel === '0' || bond.receiveLabel === ''
                    ? '0 AGX'
                    : `${bond.receiveLabel} AGX`,
              },
              {
                label: copy.meta.cap,
                value: bond.isMarketLoading
                  ? '0 AGX'
                  : bond.capLabel === '0' || bond.capLabel === ''
                    ? '0 AGX'
                    : `${bond.capLabel} AGX`,
              },
              {
                label: copy.meta.release,
                value: interpolate(copy.meta.releaseLinear, { days: bond.period }),
              },
              {
                label: copy.meta.contract,
                value: <ExplorerLink value={bond.depository} />,
                valueClassName: 'text-coral-emphasis',
              },
            ]}
          />
        </FormInfoCard>

        <Text as="p" className="m-0 text-foreground/40" variant="support">
          {copy.footnote}
        </Text>

        {!walletReady ? (
          <DockConnectPromo />
        ) : (
          <>
            <WriteBlockAlert hint={blockHint} />
            <FormActions>
              <MainButton
                density="external"
                disabled={!bond.canSubmit && bond.blockReason !== 'notBound'}
                loading={bond.isSubmitting}
                onClick={() => void onSubmit()}
              >
                {ctaLabel}
              </MainButton>
            </FormActions>
          </>
        )}
      </DockStack>
    </TabHeader>
  )
}
