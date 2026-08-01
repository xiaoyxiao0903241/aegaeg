import { formatPresaleRank } from '~/shared/api/format-display'
import { useDappShell } from '~/app/use-dapp-shell'
import { useShareholderRank } from '~/hooks/use-shareholder-rank'

export function useShareholderRankLabels(t: {
  rewards: {
    shareholderNoRankTitle: string
    shareholderTitleForRank: string
  }
}) {
  const { sessionReady } = useDappShell()
  const rankState = useShareholderRank(sessionReady)

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
