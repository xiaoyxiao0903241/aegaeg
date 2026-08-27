import { useEffect } from 'react'

import { ZERO_ADDRESS } from '~/core/constants'
import { isBondPeriod } from '~/core/staking/staking-period'
import { epochRebasePctFrom1e18 } from '~/core/staking/staking-yield'
import { useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import { useCalcEstimateStore } from '~/stores/calc-estimate-store'
import {
  burnBondDepositoryAddress,
  lpBondDepositoryAddress,
} from '~/web3/staking/staking-addresses'
import { readBondMarketMeta } from '~/web3/staking/staking-read'
import {
  useLatestSagxRebaseRateQuery,
  useXmineOverviewQuery,
} from '~/web3/staking/use-staking-queries'

/**
 * 计算器实时估算胶水
 *
 * 表单字段由 UI 直订 `useCalcEstimateStore`；本 hook 只把链上利率灌进 store。
 * rebase 与日频同一查询；债券再读当前档 `discountRateBP`。缺数保持 loading。
 */
export function useCalcEstimateLive() {
  const product = useCalcEstimateStore((s) => s.product)
  const period = useCalcEstimateStore((s) => s.period)
  const rebaseQuery = useLatestSagxRebaseRateQuery()
  const xmineOverviewQuery = useXmineOverviewQuery()
  const liveSync = useCalcEstimateStore((s) => s.liveSync)
  const isBond = product === 'lpbond' || product === 'burnbond'
  let depository: ReturnType<typeof lpBondDepositoryAddress> | null = null
  if (isBond && isBondPeriod(period)) {
    depository =
      product === 'burnbond' ? burnBondDepositoryAddress(period) : lpBondDepositoryAddress(period)
  }
  const bondMarketQuery = useChainQuery({
    queryKey: queryKeys.chain.bondMarketMeta(depository ?? ZERO_ADDRESS),
    scope: 'public',
    freshness: 'quote',
    enabled: depository != null,
    queryFn: () => {
      if (depository == null) throw new Error('BOND_MARKET_DISABLED')
      return readBondMarketMeta(depository)
    },
  })

  const epochRebasePct = epochRebasePctFrom1e18(rebaseQuery.data?.rebaseRate1e18)
  const xmineDailyPct =
    xmineOverviewQuery.data != null ? Number(xmineOverviewQuery.data.yieldRateBP) / 100 : null
  const epochsPerDay = rebaseQuery.data?.epochsPerDay ?? null
  const liveDiscount = bondMarketQuery.data?.discountRateBP
  let discountRateBP: number | null = null
  if (isBond && liveDiscount != null) {
    const n = Number(liveDiscount)
    if (Number.isFinite(n) && n > 0) discountRateBP = n
  }

  useEffect(() => {
    liveSync({ epochRebasePct, xmineDailyPct, epochsPerDay, discountRateBP })
  }, [liveSync, epochRebasePct, xmineDailyPct, epochsPerDay, discountRateBP])
}
