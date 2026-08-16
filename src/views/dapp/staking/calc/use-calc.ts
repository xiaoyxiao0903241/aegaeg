import { useEffect } from 'react'

import { epochRebasePctFrom1e18 } from '~/core/staking/staking-yield'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useCalcEstimateStore } from '~/stores/calc-estimate-store'
import {
  useStakingHubOverviewQuery,
  useXmineOverviewQuery,
} from '~/web3/staking/use-staking-queries'

/**
 * 计算器实时估算胶水
 *
 * 表单字段由 UI 直订 `useCalcEstimateStore`；本 hook 只把链上利率 / 行情
 * 灌进 store（含首次价格 seed）。「计算」按钮暂隐藏，逻辑由 liveSync 保留。
 */
export function useCalcEstimateLive() {
  const spotUsd = useAgxPriceUsd()
  const overviewQuery = useStakingHubOverviewQuery()
  const xmineOverviewQuery = useXmineOverviewQuery()
  const product = useCalcEstimateStore((s) => s.product)
  const period = useCalcEstimateStore((s) => s.period)
  const amount = useCalcEstimateStore((s) => s.amount)
  const price = useCalcEstimateStore((s) => s.price)
  const days = useCalcEstimateStore((s) => s.days)
  const liveSync = useCalcEstimateStore((s) => s.liveSync)

  const epochRebasePct = epochRebasePctFrom1e18(overviewQuery.data?.rebaseRate1e18)
  const xmineDailyPct =
    xmineOverviewQuery.data != null ? Number(xmineOverviewQuery.data.yieldRateBP) / 100 : null
  const epochsPerDay = overviewQuery.data?.epochsPerDay ?? null

  useEffect(() => {
    liveSync({ spotUsd, epochRebasePct, xmineDailyPct, epochsPerDay })
  }, [
    liveSync,
    spotUsd,
    epochRebasePct,
    xmineDailyPct,
    epochsPerDay,
    product,
    period,
    amount,
    price,
    days,
  ])
}
