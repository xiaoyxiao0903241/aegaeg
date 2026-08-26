import { useEffect } from 'react'

import { epochRebasePctFrom1e18 } from '~/core/staking/staking-yield'
import { useCalcEstimateStore } from '~/stores/calc-estimate-store'
import {
  useStakingHubOverviewQuery,
  useXmineOverviewQuery,
} from '~/web3/staking/use-staking-queries'

/**
 * 计算器实时估算胶水
 *
 * 表单字段由 UI 直订 `useCalcEstimateStore`；本 hook 只把链上利率灌进 store。
 * 利率就绪后自动提交默认质押/活期/第 100 天；之后点「计算」才刷新。
 */
export function useCalcEstimateLive() {
  const overviewQuery = useStakingHubOverviewQuery()
  const xmineOverviewQuery = useXmineOverviewQuery()
  const liveSync = useCalcEstimateStore((s) => s.liveSync)

  const epochRebasePct = epochRebasePctFrom1e18(overviewQuery.data?.rebaseRate1e18)
  const xmineDailyPct =
    xmineOverviewQuery.data != null ? Number(xmineOverviewQuery.data.yieldRateBP) / 100 : null
  const epochsPerDay = overviewQuery.data?.epochsPerDay ?? null

  useEffect(() => {
    liveSync({ epochRebasePct, xmineDailyPct, epochsPerDay })
  }, [liveSync, epochRebasePct, xmineDailyPct, epochsPerDay])
}
