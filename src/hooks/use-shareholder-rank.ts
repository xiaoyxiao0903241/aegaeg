import { useEffect, useMemo, useState } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { buildRewardTierRows } from '../lib/presale/tier-table'
import {
  formatPresaleRank,
  formatShareholderHintForRank,
} from '../lib/api/format-display'
import { resolveDisplayPresaleRank } from '../lib/presale/rank'
import { formatTokenAmount } from '../lib/swap/token-amount'
import { useAuth } from '../providers/auth-provider'
import { readUserPresaleTotal } from '../web3/presale-read'
import { usePerformance } from './use-api-data'
import { useDappShell } from '../app/dapp-shell-context'

export function useShareholderRank() {
  const { connected } = useDappShell()
  const account = useActiveAccount()
  const { isAuthenticated, isLoggingIn, loginError } = useAuth()
  const apiEnabled = connected && isAuthenticated
  const { data: performance, isLoading: performanceLoading } = usePerformance(apiEnabled)
  const [chainVolumeUsd, setChainVolumeUsd] = useState(0)
  const [isChainVolumeLoading, setIsChainVolumeLoading] = useState(false)

  useEffect(() => {
    if (!connected || !account?.address) {
      setChainVolumeUsd(0)
      setIsChainVolumeLoading(false)
      return
    }

    let cancelled = false
    setIsChainVolumeLoading(true)

    void readUserPresaleTotal(account.address)
      .then((total) => {
        if (cancelled) return
        setChainVolumeUsd(Number(formatTokenAmount(total, 18, 0)))
      })
      .catch(() => {
        if (!cancelled) setChainVolumeUsd(0)
      })
      .finally(() => {
        if (!cancelled) setIsChainVolumeLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [account?.address, connected])

  const personalVolumeUsd = useMemo(() => {
    const apiVolume = Number(performance?.presale_volume ?? 0)
    return Math.max(apiVolume, chainVolumeUsd)
  }, [chainVolumeUsd, performance?.presale_volume])

  const displayRank = useMemo(
    () => resolveDisplayPresaleRank(performance?.presale_rank ?? 0, personalVolumeUsd),
    [performance?.presale_rank, personalVolumeUsd],
  )

  const authPending = connected && !isAuthenticated && !loginError

  const isRankLoading =
    connected &&
    (isLoggingIn ||
      isChainVolumeLoading ||
      authPending ||
      (apiEnabled && performanceLoading && performance == null))

  return {
    apiEnabled,
    connected,
    displayRank,
    isAuthenticated,
    isChainVolumeLoading,
    isLoggingIn,
    isRankLoading,
    loginError,
    performance,
    performanceLoading,
    personalVolumeUsd,
  }
}

export function useShareholderRankLabels(t: {
  rewards: {
    heroBody: string
    rankSignInRequired: string
    shareholder: string
    shareholderHintForRank: string
    shareholderHintNoRank: string
    shareholderTitleForRank: string
  }
}) {
  const rankState = useShareholderRank()

  const rankLabel = (() => {
    if (!rankState.connected || rankState.isRankLoading) return ''
    if (!rankState.isAuthenticated) return '—'
    if (rankState.displayRank <= 0) return '—'
    return t.rewards.shareholderTitleForRank.replace(
      '{rank}',
      formatPresaleRank(rankState.displayRank),
    )
  })()

  const rankHint = (() => {
    if (!rankState.connected) return t.rewards.shareholderHintNoRank
    if (rankState.isRankLoading) return ''
    if (!rankState.isAuthenticated) return t.rewards.rankSignInRequired
    return formatShareholderHintForRank(
      rankState.displayRank,
      t.rewards.shareholderHintForRank,
      t.rewards.shareholderHintNoRank,
      buildRewardTierRows(),
    )
  })()

  const heroTitle = (() => {
    if (!rankState.connected) return t.rewards.shareholder
    if (rankState.isRankLoading) return ''
    if (!rankState.isAuthenticated) return t.rewards.shareholderHintNoRank
    if (rankState.displayRank <= 0) return t.rewards.shareholderHintNoRank
    return t.rewards.shareholderTitleForRank.replace(
      '{rank}',
      formatPresaleRank(rankState.displayRank),
    )
  })()

  const heroBody = rankState.isRankLoading ? '' : t.rewards.heroBody

  return {
    ...rankState,
    heroBody,
    heroTitle,
    rankHint,
    rankLabel,
  }
}
