import { useDappHost } from '~/hooks/use-dapp-host'
import { useShareholderRank } from '~/hooks/use-shareholder-rank'
import { formatPresaleRank } from '~/shared/presenters/format-display'

/**
 * 股东等级标题文案
 *
 * 依据股东等级（displayRank）生成标题：无等级 → 未定级标题；
 * 有等级 → 用 A# 档位文本替换标题模板。加载中返回空串由调用方自行占位。
 *
 * @param t 文案字典（需含 rewards.shareholderNoRankTitle / shareholderTitleForRank）
 */
export function useShareholderRankLabels(t: {
  rewards: {
    shareholderNoRankTitle: string
    shareholderTitleForRank: string
  }
}) {
  const { sessionReady } = useDappHost()
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
