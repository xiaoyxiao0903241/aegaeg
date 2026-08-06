import { useEffect, useState } from 'react'

import { buildCalcEstimate } from '~/core/staking/build-calc-estimate'
import { CALC_MAX_DAYS, epochRebasePctFrom1e18 } from '~/core/staking/staking-yield'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useI18n } from '~/i18n/use-i18n'
import { formatNumber } from '~/shared/presenters/format'
import { type CalcProduct, useCalcEstimateStore } from '~/stores/calc-estimate-store'
import { useStakingViewStore } from '~/stores/staking-view-store'
import {
  useStakingHubOverviewQuery,
  useXmineOverviewQuery,
} from '~/web3/staking/use-staking-queries'

/**
 * 计算器表单状态
 *
 * 维护产品 / 周期 / 金额 / 价格 / 天数；
 * 点「计算」才写入右侧结果仓库（对齐设计稿的显式触发）。
 *
 * @returns 表单状态与各变更回调
 */
export function useCalcDock() {
  const { messages: t } = useI18n()
  const setView = useStakingViewStore((state) => state.setView)
  const setResult = useCalcEstimateStore((state) => state.setResult)
  const spotUsd = useAgxPriceUsd()
  const overviewQuery = useStakingHubOverviewQuery()
  const xmineOverviewQuery = useXmineOverviewQuery()
  const [product, setProduct] = useState<CalcProduct>('stake')
  const [period, setPeriod] = useState<string>('liquid')
  const [amount, setAmount] = useState('1')
  const [price, setPrice] = useState('0')
  const [days, setDays] = useState(100)
  const [priceSeeded, setPriceSeeded] = useState(false)

  const epochRebasePct = epochRebasePctFrom1e18(overviewQuery.data?.rebaseRate1e18)
  const xmineDailyPct =
    xmineOverviewQuery.data != null ? Number(xmineOverviewQuery.data.yieldRateBP) / 100 : null

  // 价格字段仅在首次拿到实时行情时写入一次，之后不覆盖用户输入。
  useEffect(() => {
    if (priceSeeded || spotUsd == null) return
    setPrice(formatNumber(spotUsd, { digits: 2 }).replace(/,/g, ''))
    setPriceSeeded(true)
  }, [priceSeeded, spotUsd])

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
      ? formatNumber(spotUsd, { digits: 2, prefix: '$' })
      : formatNumber(0, { digits: 2, prefix: '$' })

  function onProductChange(next: string) {
    if (next !== 'stake' && next !== 'lpbond' && next !== 'burnbond' && next !== 'xmine') return
    setProduct(next)
    setPeriod(next === 'stake' || next === 'xmine' ? 'liquid' : '180')
  }

  function onDaysChange(next: number) {
    setDays(Math.min(CALC_MAX_DAYS, Math.max(1, next)))
  }

  function onCalculate() {
    setResult(
      buildCalcEstimate({
        product,
        period,
        amount,
        price,
        days,
        epochRebasePct,
        xmineDailyPct: product === 'xmine' ? xmineDailyPct : null,
      }),
    )
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
    onCalculate,
  }
}
