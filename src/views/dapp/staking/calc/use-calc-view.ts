import { useState } from 'react'

import {
  calcStakingEstimate,
  defaultAprForBondPeriod,
  defaultAprForStakePeriod,
} from '~/core/staking/calc-staking-yield'
import type { BondPeriod, StakePeriod } from '~/core/staking/staking-period'
import { useI18n } from '~/i18n/use-i18n'
import { type CalcProduct, useCalcEstimateStore } from '~/stores/calc-estimate-store'
import { useStakingViewStore } from '~/stores/staking-view-store'

const XMINE_APR = 0.1

export function useCalcView() {
  const { messages: t } = useI18n()
  const setView = useStakingViewStore((state) => state.setView)
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

  function onProductChange(next: string) {
    if (next !== 'stake' && next !== 'lpbond' && next !== 'burnbond' && next !== 'xmine') return
    setProduct(next)
    setPeriod(next === 'stake' || next === 'xmine' ? 'liquid' : '180')
    setResult(null)
  }

  function onPeriodChange(value: string) {
    setPeriod(value)
    setResult(null)
  }

  function onAmountChange(value: string) {
    setAmount(value)
    setResult(null)
  }

  function onPriceChange(value: string) {
    setPrice(value)
    setResult(null)
  }

  function onDaysChange(value: number) {
    setDays(value)
    setResult(null)
  }

  function onCalculate() {
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
    const sellUsd = investedUsd + interestUsd
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
      investedUsd,
      sellUsd,
      ratePct,
    })
  }

  return {
    t,
    setView,
    product,
    period,
    amount,
    price,
    days,
    periodOptions,
    productOptions: [
      { label: t.staking.calc.products.stake, value: 'stake' },
      { label: t.staking.calc.products.lpbond, value: 'lpbond' },
      { label: t.staking.calc.products.burnbond, value: 'burnbond' },
      { label: t.staking.calc.products.xmine, value: 'xmine' },
    ],
    tokenLabel: product === 'xmine' ? 'gAGX' : product === 'stake' ? 'AGX' : 'USD1',
    onProductChange,
    onPeriodChange,
    onAmountChange,
    onPriceChange,
    onDaysChange,
    onCalculate,
  }
}
