import { useMemo } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { formatPresaleRank } from '~/shared/api/format-display'
import { resolveCommitmentFloorRank } from '~/core/presale/tier-table'
import { resolveDisplayPresaleRank } from '~/core/presale/rank'
import { formatTokenAmountToNumber } from '~/core/swap/token-amount'
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
    return formatTokenAmountToNumber(userTotalQuery.data, 18)
  }, [userTotalQuery.data])

  const personalVolumeUsd = useMemo(() => {
    const apiVolume = Number(performance?.presale_volume ?? 0)
    return Math.max(apiVolume, chainVolumeUsd)
  }, [chainVolumeUsd, performance?.presale_volume])

  const displayRank = useMemo(
    () => resolveDisplayPresaleRank(performance?.presale_rank ?? 0),
    [performance?.presale_rank],
  )

  const commitmentFloorRank = useMemo(
    () => resolveCommitmentFloorRank(performance?.presale_commitment_floor_rank ?? 0),
    [performance?.presale_commitment_floor_rank],
  )

  const commitmentFloorTeamUsd = useMemo(() => {
    const raw = performance?.presale_commitment_floor_performance
    if (raw == null || raw === '') return 0
    const parsed = Number(raw)
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0
  }, [performance?.presale_commitment_floor_performance])

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
    commitmentFloorRank,
    commitmentFloorTeamUsd,
  }
}

export function useShareholderRankLabels(t: {
  rewards: {
    shareholderNoRankTitle: string
    shareholderTitleForRank: string
  }
}) {
  const rankState = useShareholderRank()

  const effectiveDisplayRank = rankState.sessionReady ? rankState.displayRank : 0

  const rankLabel = (() => {
    if (rankState.sessionReady && rankState.isRankLoading) return ''
    if (effectiveDisplayRank <= 0) return t.rewards.shareholderNoRankTitle
    return t.rewards.shareholderTitleForRank.replace(
      '{rank}',
      formatPresaleRank(effectiveDisplayRank),
    )
  })()

  const heroTitle = (() => {
    if (rankState.sessionReady && rankState.isRankLoading) return ''
    if (effectiveDisplayRank <= 0) return t.rewards.shareholderNoRankTitle
    return t.rewards.shareholderTitleForRank.replace(
      '{rank}',
      formatPresaleRank(effectiveDisplayRank),
    )
  })()

  return {
    ...rankState,
    displayRank: effectiveDisplayRank,
    heroTitle,
    rankLabel,
  }
}
