import { useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappActionRow } from '~/app/shell/dapp-action-row'
import { AmountBox } from '~/shared/ui/amount-box'
import { Segment } from '~/shared/ui/segment'
import { Text } from '~/shared/ui/text'
import { Input } from '~/shared/ui/input'
import {
  calcStakingEstimate,
  defaultAprForBondPeriod,
  defaultAprForStakePeriod,
} from '~/core/staking/calc-staking-yield'
import type { BondPeriod, StakePeriod } from '~/core/staking/staking-period'
import { ExchangeMetaPanel } from '~/views/dapp/exchange/exchange-meta-panel'
import { ExchangeWidgetBody } from '~/views/dapp/exchange/exchange-widget-composites'
import { StakingSubpageHeader } from '~/views/dapp/staking/staking-subpage-header'

type CalcProduct = 'stake' | 'lpbond' | 'burnbond'

/** Local-only calculator — zero chain writes. */
export function CalcWidget() {
  const { messages: t } = useI18n()
  const [product, setProduct] = useState<CalcProduct>('stake')
  const [period, setPeriod] = useState<string>('180')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('1')
  const [days, setDays] = useState(180)
  const [result, setResult] = useState<{ interest: number; total: number } | null>(null)

  const periodOptions =
    product === 'stake'
      ? [
          { label: t.staking.stake.periods.liquid, value: 'liquid' },
          { label: t.staking.stake.periods.d180, value: '180' },
          { label: t.staking.stake.periods.d360, value: '360' },
          { label: t.staking.stake.periods.d540, value: '540' },
        ]
      : [
          { label: t.staking.stake.periods.d180, value: '180' },
          { label: t.staking.stake.periods.d360, value: '360' },
          { label: t.staking.stake.periods.d540, value: '540' },
        ]

  function handleProductChange(next: string) {
    if (next !== 'stake' && next !== 'lpbond' && next !== 'burnbond') return
    setProduct(next)
    setPeriod(next === 'stake' ? 'liquid' : '180')
    setResult(null)
  }

  function handleCalculate() {
    const principal = Number.parseFloat(amount.replace(/,/g, '')) || 0
    const apr =
      product === 'stake'
        ? defaultAprForStakePeriod(period as StakePeriod)
        : defaultAprForBondPeriod(period as BondPeriod)
    setResult(calcStakingEstimate({ principal, apr, days }))
  }

  return (
    <>
      <StakingSubpageHeader subtitle={t.staking.calc.intro} title={t.staking.calc.title} />
      <ExchangeWidgetBody>
        <Segment
          aria-label={t.staking.calc.productAria}
          onChange={handleProductChange}
          options={[
            { label: t.staking.hub.modes.stake.title, value: 'stake' },
            { label: t.staking.hub.modes.lpbond.title, value: 'lpbond' },
            { label: t.staking.hub.modes.burnbond.title, value: 'burnbond' },
          ]}
          tone="ink"
          value={product}
        />

        <Segment
          aria-label={t.staking.calc.periodAria}
          onChange={(value) => {
            setPeriod(value)
            setResult(null)
          }}
          options={periodOptions}
          tone="coral"
          value={period}
        />

        <AmountBox
          amountProps={{
            'aria-label': t.staking.calc.amountAria,
            inputMode: 'decimal',
            onChange: (event) => {
              setAmount(event.target.value)
              setResult(null)
            },
            placeholder: '0',
            value: amount,
          }}
          label={t.staking.amount}
          sessionReady
          startAdornment={
            <Text as="span" className="font-semibold" variant="copy">
              {product === 'stake' ? 'AGX' : 'USD1'}
            </Text>
          }
        />

        <label className="grid gap-1">
          <Text as="span" tone="muted-foreground" variant="support">
            {t.staking.calc.price}
          </Text>
          <Input
            aria-label={t.staking.calc.priceAria}
            inputMode="decimal"
            onChange={(event) => {
              setPrice(event.target.value)
              setResult(null)
            }}
            value={price}
          />
        </label>

        <label className="grid gap-1">
          <Text as="span" tone="muted-foreground" variant="support">
            {t.staking.calc.days}: {days}
          </Text>
          <input
            aria-label={t.staking.calc.daysAria}
            className="w-full accent-primary"
            max={730}
            min={1}
            onChange={(event) => {
              setDays(Number(event.target.value))
              setResult(null)
            }}
            type="range"
            value={days}
          />
        </label>

        <ExchangeMetaPanel
          items={[
            {
              label: t.staking.calc.result.interest,
              value: result ? result.interest.toFixed(4) : '—',
            },
            {
              label: t.staking.calc.result.total,
              value: result ? result.total.toFixed(4) : '—',
            },
          ]}
        />

        <DappActionRow>
          <DappActionButton density="external" onClick={handleCalculate}>
            {t.staking.calc.submit}
          </DappActionButton>
        </DappActionRow>
      </ExchangeWidgetBody>
    </>
  )
}
