import { dappAssets } from '~/app/assets'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappActionRow } from '~/app/shell/dapp-action-row'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappMetaPanel } from '~/app/shell/dapp-meta-panel'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import type { BondPeriod } from '~/core/staking/staking-period'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { formatGroupedNumber, formatShortAddress } from '~/shared/api/format-display'
import { bscscanAddress } from '~/shared/config/explorer'
import { AmountBox } from '~/shared/ui/amount-box'
import { AmountMaxChip } from '~/shared/ui/chip'
import { Text } from '~/shared/ui/text'
import { BondPeriodList } from '~/views/dapp/staking/bond/bond-period-list'
import type { BondKind } from '~/views/dapp/staking/bond/submit-bond-zap'
import { useBondView } from '~/views/dapp/staking/bond/use-bond-view'

const BOND_PERIODS: BondPeriod[] = ['180', '360', '540']

function parseDiscountPct(label: string): number | null {
  const n = Number(label.replace(/%$/, '').trim())
  return Number.isFinite(n) ? n : null
}

/** Market spot × (discount%/100) — Figma dual price; missing → `$0.00`. */
function formatBondDiscountUsd(spot: number | null, discountLabel: string): string {
  const pct = parseDiscountPct(discountLabel)
  if (spot == null || pct == null) return formatGroupedNumber(0, { digits: 2, prefix: '$' })
  return formatGroupedNumber(spot * (pct / 100), { digits: 2, prefix: '$' })
}

export function BondWidget({ kind }: { kind: BondKind }) {
  const {
    t,
    bond,
    copy,
    sessionReady,
    walletReady,
    setView,
    amountLabel,
    ctaLabel,
    onSubmit,
    periodLabels,
  } = useBondView(kind)
  const spotUsd = useAgxPriceUsd()
  const discountPrices = Object.fromEntries(
    BOND_PERIODS.map((period) => [
      period,
      formatBondDiscountUsd(spotUsd, bond.periodDiscounts[period] || '0'),
    ]),
  ) as Record<BondPeriod, string>
  const discountUsd = formatBondDiscountUsd(spotUsd, bond.discountLabel)
  const spotLabel =
    spotUsd != null
      ? formatGroupedNumber(spotUsd, { digits: 2, prefix: '$' })
      : formatGroupedNumber(0, { digits: 2, prefix: '$' })

  return (
    <>
      <DappTabHeader
        backText={t.staking.backToHub}
        onBack={() => setView('hub')}
        subtitle={copy.intro}
        title={copy.title}
      />
      <DappWidgetStack>
        <BondPeriodList
          ariaLabel={copy.periodAria}
          copy={copy.card}
          discountPrices={discountPrices}
          discounts={bond.periodDiscounts}
          onChange={bond.setPeriod}
          periodLabel={copy.periodLabel}
          periodLabels={periodLabels}
          value={bond.period}
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
            <span className="flex items-center gap-2.5">
              <span className="flex items-center gap-1.5">
                <DappIcon alt="" className="size-[1.375rem]" src={dappAssets.tokenUsd1} />
                <Text as="span" className="font-semibold" variant="detail">
                  USD1
                </Text>
              </span>
              <AmountMaxChip disabled={!walletReady || bond.isSubmitting} onClick={bond.fillMax}>
                {t.staking.max}
              </AmountMaxChip>
            </span>
          }
          headerOutside
          label={amountLabel}
          sessionReady={sessionReady}
          startAdornment={null}
        />

        <DappMetaPanel
          className="mt-0 gap-3 p-4"
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
              label: copy.meta.slippage,
              value: bond.isSlippageLoading ? '' : bond.slippageLabel || '0',
            },
            {
              label: copy.meta.pay,
              value: bond.amountDisplay ? `${bond.amountDisplay} USD1` : '0 USD1',
            },
            {
              label: copy.meta.receive,
              value: bond.isPayoutQuoting
                ? ''
                : bond.receiveLabel === '0' || bond.receiveLabel === ''
                  ? '0 AGX'
                  : `${bond.receiveLabel} AGX`,
            },
            {
              label: copy.meta.cap,
              value: bond.isMarketLoading
                ? ''
                : bond.capLabel === '0' || bond.capLabel === ''
                  ? '0 USD1'
                  : `${bond.capLabel} USD1`,
            },
            {
              label: copy.meta.release,
              value: copy.meta.releaseLinear.replace('{days}', bond.period),
            },
            {
              label: copy.meta.contract,
              value: (
                <a href={bscscanAddress(bond.depository)} rel="noreferrer" target="_blank">
                  {formatShortAddress(bond.depository)}
                </a>
              ),
              // Figma accent/coral #e9785a → coral-emphasis；稿无下划线
              valueClassName: 'text-coral-emphasis',
            },
          ]}
        />

        <Text as="p" className="m-0 text-foreground/40" variant="support">
          {copy.footnote}
        </Text>

        {walletReady ? (
          <DappActionRow>
            <DappActionButton
              density="external"
              disabled={!bond.canSubmit && bond.blockReason !== 'notBound'}
              loading={bond.isSubmitting}
              onClick={() => void onSubmit()}
            >
              {ctaLabel}
            </DappActionButton>
          </DappActionRow>
        ) : (
          <DappWidgetConnectPromo />
        )}
      </DappWidgetStack>
    </>
  )
}
