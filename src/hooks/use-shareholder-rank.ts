import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { displayPresaleRank } from '~/core/presale/rank'
import { usePerformance } from '~/hooks/use-api-data'
import { useAuth } from '~/hooks/use-auth'
import { usePresaleUserTotalQuery } from '~/web3/presale/use-presale-queries'
import { useActiveAccount } from '~/web3/thirdweb-react'

/**
 * 股东等级展示数据
 *
 * 同时读取链上预售累计金额与后端做市业绩，取两者较大值作为个人交易额，
 * 避免数据源异步差异造成等级波动。
 *
 * @param sessionReady 会话是否就绪，由外壳页面传入（本 hook 不依赖 app 层）
 * @returns 展示用等级、个人交易额、加载状态与登录错误等
 * @see 手册 §6 PreSale
 * @see docs/backend-api/api.md #performance
 */
export function useShareholderRank(sessionReady: boolean) {
  const account = useActiveAccount()
  const { loginError } = useAuth()
  const { data: performance, isLoading: performanceLoading } = usePerformance(sessionReady)

  const address = account?.address
  const userTotalQuery = usePresaleUserTotalQuery()

  const chainVolumeUsd = userTotalQuery.data
    ? formatTokenAmountToNumber(userTotalQuery.data, 18)
    : 0

  const apiVolume = Number(performance?.presale_volume ?? 0)
  const personalVolumeUsd = Math.max(apiVolume, chainVolumeUsd)

  const displayRank = displayPresaleRank(performance?.presale_rank ?? 0)

  const isChainVolumeLoading = Boolean(address) && userTotalQuery.isLoading

  const isRankLoading = sessionReady && performanceLoading && performance == null

  return {
    sessionReady,
    displayRank,
    isChainVolumeLoading,
    isRankLoading,
    loginError,
    performance,
    performanceLoading,
    personalVolumeUsd,
  }
}
