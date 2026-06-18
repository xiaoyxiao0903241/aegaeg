import { useMemo } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { buildRewardTierRows } from '~/lib/presale/tier-table'
import {
  formatPresaleRank,
  formatShareholderHintForRank,
} from '~/lib/api/format-display'
import { resolveDisplayPresaleRank } from '~/lib/presale/rank'
import { formatTokenAmount } from '~/lib/swap/token-amount'
import { useAuth } from '~/providers/auth-provider'
import { usePerformance } from '~/hooks/use-api-data'
import { useDappShell } from '~/app/dapp-shell-context'
import { usePresaleUserTotalQuery } from '~/hooks/queries/use-presale-queries'

export function useShareholderRank() {
  const { sessionReady } = useDappShell()
  const account = useActiveAccount()
  const { loginError } = useAuth()
  const { data: performance, isLoading: performanceLoading } = usePerformance(sessionReady)

  const address = account?.address
  const userTotalQuery = usePresaleUserTotalQuery(address)

  const chainVolumeUsd = useMemo(() => {
    if (!userTotalQuery.data) return 0
    return Number(formatTokenAmount(userTotalQuery.data, 18, 0))
  }, [userTotalQuery.data])

  const personalVolumeUsd = useMemo(() => {
    const apiVolume = Number(performance?.presale_volume ?? 0)
    return Math.max(apiVolume, chainVolumeUsd)
  }, [chainVolumeUsd, performance?.presale_volume])

  const displayRank = useMemo(
    () => resolveDisplayPresaleRank(performance?.presale_rank ?? 0, personalVolumeUsd),
    [performance?.presale_rank, personalVolumeUsd],
  )

  const isChainVolumeLoading = Boolean(address) && userTotalQuery.isLoading

  const isRankLoading =
    sessionReady &&
    (isChainVolumeLoading || (performanceLoading && performance == null))

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

export function useShareholderRankLabels(t: {
  rewards: {
    heroBodyForRank: string
    heroBody: string
    shareholder: string
    shareholderHintForRank: string
    shareholderHintNoRank: string
    shareholderTitleForRank: string
  }
}) {
  const rankState = useShareholderRank()

  const rankLabel = (() => {
    if (!rankState.sessionReady || rankState.isRankLoading) return ''
    if (rankState.displayRank <= 0) return '—'
    return t.rewards.shareholderTitleForRank.replace(
      '{rank}',
      formatPresaleRank(rankState.displayRank),
    )
  })()

  const rankHint = (() => {
    if (!rankState.sessionReady) return t.rewards.shareholderHintNoRank
    if (rankState.isRankLoading) return ''
    return formatShareholderHintForRank(
      rankState.displayRank,
      t.rewards.shareholderHintForRank,
      t.rewards.shareholderHintNoRank,
      buildRewardTierRows(),
    )
  })()

  const heroTitle = (() => {
    if (!rankState.sessionReady) return t.rewards.shareholder
    if (rankState.isRankLoading) return ''
    if (rankState.displayRank <= 0) return t.rewards.shareholderHintNoRank
    return t.rewards.shareholderTitleForRank.replace(
      '{rank}',
      formatPresaleRank(rankState.displayRank),
    )
  })()

  const heroBody = (() => {
    if (rankState.isRankLoading) return ''
    if (!rankState.sessionReady || rankState.displayRank <= 0) {
      return t.rewards.shareholderHintNoRank
    }
    return formatShareholderHintForRank(
      rankState.displayRank,
      t.rewards.heroBodyForRank,
      t.rewards.shareholderHintNoRank,
      buildRewardTierRows(),
    )
  })()

  return {
    ...rankState,
    heroBody,
    heroTitle,
    rankHint,
    rankLabel,
  }
}
