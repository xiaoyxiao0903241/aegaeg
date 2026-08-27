import { useEffect } from 'react'

import { epochRebasePctFrom1e18 } from '~/core/staking/staking-yield'
import { useCalcEstimateStore } from '~/stores/calc-estimate-store'
import {
  useLatestSagxRebaseRateQuery,
  useXmineOverviewQuery,
} from '~/web3/staking/use-staking-queries'

/**
 * 计算器实时估算胶水
 *
 * 表单字段由 UI 直订 `useCalcEstimateStore`；本 hook 只把链上利率灌进 store。
 * rebase 与日频同一查询；缺 rebase 保持 loading。
 */
export function useCalcEstimateLive() {
  const rebaseQuery = useLatestSagxRebaseRateQuery()
  const xmineOverviewQuery = useXmineOverviewQuery()
  const liveSync = useCalcEstimateStore((s) => s.liveSync)

  const epochRebasePct = epochRebasePctFrom1e18(rebaseQuery.data?.rebaseRate1e18)
  const xmineDailyPct =
    xmineOverviewQuery.data != null ? Number(xmineOverviewQuery.data.yieldRateBP) / 100 : null
  const epochsPerDay = rebaseQuery.data?.epochsPerDay ?? null

  useEffect(() => {
    liveSync({ epochRebasePct, xmineDailyPct, epochsPerDay })
  }, [liveSync, epochRebasePct, xmineDailyPct, epochsPerDay])
}
