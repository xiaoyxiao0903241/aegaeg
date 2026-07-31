import { useActiveAccount } from '~/web3/thirdweb-react'
import { displayPresaleRank } from '~/core/presale/rank'
import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { useAuth } from '~/hooks/use-auth'
import { usePerformance } from '~/hooks/use-api-data'
import { usePresaleUserTotalQuery } from '~/web3/presale/use-presale-queries'

/** Cross-tab shareholder rank — pass sessionReady from shell (hooks ↛ app). */
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
