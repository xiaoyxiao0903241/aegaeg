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
import { ExchangeWidgetBody } from '~/views/dapp/exchange/exchange-widget-composites'
import { StakingSubpageHeader } from '~/views/dapp/staking/staking-subpage-header'
import { useCalcEstimateStore, type CalcProduct } from '~/stores/calc-estimate-store'

const XMINE_APR = 0.1

/** Local-only calculator — zero chain writes. */
export function CalcWidget() {
  const { messages: t } = useI18n()
  const setResult = useCalcEstimateStore((state) => state.setResult)
  const [product, setProduct] = useState<CalcProduct>('stake')
  const [period, setPeriod] = useState<string>('liquid')
  const [amount, setAmount] = useState('1')
  const [price, setPrice] = useState('65')
  const [days, setDays] = useState(100)

  const periodOptions =
    product === 'stake'
      ? [
          { label: t.staking.stake.periods.liquid, value: 'liquid' },
          { label: t.staking.stake.periods.d180, value: '180' },
          { label: t.staking.stake.periods.d360, value: '360' },
          { label: t.staking.stake.periods.d540, value: '540' },
        ]
      : product === 'xmine'
        ? [{ label: t.staking.stake.periods.liquid, value: 'liquid' }]
        : [
            { label: t.staking.stake.periods.d180, value: '180' },
            { label: t.staking.stake.periods.d360, value: '360' },
            { label: t.staking.stake.periods.d540, value: '540' },
          ]

  function handleProductChange(next: string) {
    if (next !== 'stake' && next !== 'lpbond' && next !== 'burnbond' && next !== 'xmine') return
    setProduct(next)
    setPeriod(next === 'stake' || next === 'xmine' ? 'liquid' : '180')
    setResult(null)
  }

  function handleCalculate() {
    const principal = Number.parseFloat(amount.replace(/,/g, '')) || 0
    const priceN = Number.parseFloat(price.replace(/,/g, '')) || 0
    const apr =
      product === 'stake'
        ? defaultAprForStakePeriod(period as StakePeriod)
        : product === 'xmine'
          ? XMINE_APR
          : defaultAprForBondPeriod(period as BondPeriod)
    const estimate = calcStakingEstimate({ principal, apr, days })
    const interestUsd = estimate.interest * priceN
    const investedUsd = principal * priceN
    const ratePct = investedUsd > 0 ? (interestUsd / investedUsd) * 100 : 0
    setResult({
      product,
      period,
      days,
      principal,
      price: priceN,
      interestTokens: estimate.interest,
      totalTokens: estimate.total,
      interestUsd,
      totalUsd: interestUsd,
      ratePct,
    })
  }

  const tokenLabel = product === 'xmine' ? 'gAGX' : product === 'stake' ? 'AGX' : 'USD1'

  return (
    <>
      <StakingSubpageHeader subtitle={t.staking.calc.intro} title={t.staking.calc.title} />
      <ExchangeWidgetBody>
        <Segment
          aria-label={t.staking.calc.productAria}
          onChange={handleProductChange}
          options={[
            { label: t.staking.calc.products.stake, value: 'stake' },
            { label: t.staking.calc.products.lpbond, value: 'lpbond' },
            { label: t.staking.calc.products.burnbond, value: 'burnbond' },
            { label: t.staking.calc.products.xmine, value: 'xmine' },
          ]}
          tone="coral"
          value={product}
        />

        <div className="grid gap-2">
          <Text as="span" tone="muted-foreground" variant="detail">
            {t.staking.calc.periodLabel}
          </Text>
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
        </div>

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
          label={t.staking.calc.amountLabel}
          sessionReady
          startAdornment={
            <Text as="span" className="font-semibold" variant="copy">
              {tokenLabel}
            </Text>
          }
        />

        <label className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <Text as="span" tone="muted-foreground" variant="support">
              {t.staking.calc.price}
            </Text>
            <Text as="span" className="font-semibold text-primary" variant="support">
              {t.staking.calc.priceCurrent.replace('{price}', price || '—')}
            </Text>
          </div>
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

        <label className="grid gap-2">
          <Text as="span" tone="muted-foreground" variant="support">
            {t.staking.calc.days}
          </Text>
          <div className="grid gap-1">
            <Text as="span" className="text-center font-semibold text-primary" variant="detail">
              {t.staking.calc.dayBubble.replace('{day}', String(days))}
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
          </div>
        </label>

        <DappActionRow>
          <DappActionButton density="external" onClick={handleCalculate}>
            {t.staking.calc.submit}
          </DappActionButton>
        </DappActionRow>
      </ExchangeWidgetBody>
    </>
  )
}
