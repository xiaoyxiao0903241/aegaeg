import { useEffect, useState } from 'react'

import { buildCalcEstimate } from '~/core/staking/build-calc-estimate'
import { CALC_MAX_DAYS, epochRebasePctFrom1e18 } from '~/core/staking/staking-yield-display'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useI18n } from '~/i18n/use-i18n'
import { formatGroupedNumber } from '~/shared/api/format-display'
import { type CalcProduct, useCalcEstimateStore } from '~/stores/calc-estimate-store'
import { useStakingViewStore } from '~/stores/staking-view-store'
import { useStakingHubOverviewQuery } from '~/web3/staking/use-staking-queries'

/**
 * 计算器表单状态
 *
 * 维护产品 / 周期 / 金额 / 价格 / 天数，
 * 任一变化即重新计算并写入结果仓库。
 *
 * @returns 表单状态与各变更回调
 */
export function useCalcView() {
  const { messages: t } = useI18n()
  const setView = useStakingViewStore((state) => state.setView)
  const setResult = useCalcEstimateStore((state) => state.setResult)
  const spotUsd = useAgxPriceUsd()
  const overviewQuery = useStakingHubOverviewQuery()
  const [product, setProduct] = useState<CalcProduct>('stake')
  const [period, setPeriod] = useState<string>('liquid')
  const [amount, setAmount] = useState('1')
  const [price, setPrice] = useState('0')
  const [days, setDays] = useState(100)
  const [priceSeeded, setPriceSeeded] = useState(false)

  const epochRebasePct = epochRebasePctFrom1e18(overviewQuery.data?.rebaseRate1e18)

  // 价格字段仅在首次拿到实时行情时写入一次，之后不覆盖用户输入。
  useEffect(() => {
    if (priceSeeded || spotUsd == null) return
    setPrice(formatGroupedNumber(spotUsd, { digits: 2 }).replace(/,/g, ''))
    setPriceSeeded(true)
  }, [priceSeeded, spotUsd])

  // 实时联动：左侧任一输入变化即重算右侧结果。
  useEffect(() => {
    setResult(
      buildCalcEstimate({
        product,
        period,
        amount,
        price,
        days,
        epochRebasePct,
      }),
    )
  }, [product, period, amount, price, days, epochRebasePct, setResult])

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

  const spotLabel =
    spotUsd != null
      ? formatGroupedNumber(spotUsd, { digits: 2, prefix: '$' })
      : formatGroupedNumber(0, { digits: 2, prefix: '$' })

  function onProductChange(next: string) {
    if (next !== 'stake' && next !== 'lpbond' && next !== 'burnbond' && next !== 'xmine') return
    setProduct(next)
    setPeriod(next === 'stake' || next === 'xmine' ? 'liquid' : '180')
  }

  function onDaysChange(next: number) {
    setDays(Math.min(CALC_MAX_DAYS, Math.max(1, next)))
  }

  const tokenSrc = product === 'xmine' ? 'gagx' : product === 'stake' ? 'agx' : 'usd1'

  return {
    t,
    setView,
    product,
    period,
    amount,
    price,
    days,
    spotLabel,
    periodOptions,
    productOptions: [
      { label: t.staking.calc.products.stake, value: 'stake' },
      { label: t.staking.calc.products.lpbond, value: 'lpbond' },
      { label: t.staking.calc.products.burnbond, value: 'burnbond' },
      { label: t.staking.calc.products.xmine, value: 'xmine' },
    ],
    tokenLabel: product === 'xmine' ? 'gAGX' : product === 'stake' ? 'AGX' : 'USD1',
    tokenSrc,
    onProductChange,
    onPeriodChange: setPeriod,
    onAmountChange: setAmount,
    onPriceChange: setPrice,
    onDaysChange,
  }
}
