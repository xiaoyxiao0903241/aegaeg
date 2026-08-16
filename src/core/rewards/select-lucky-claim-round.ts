import { isLuckyClaimable } from '~/core/rewards/rewards-block-reasons'

/** 单轮中奖信息行（须按 roundId 降序排列）。 */
export type LuckyRoundWinnerRow = {
  roundId: bigint
  won: boolean
  rewardAmount: bigint
  rewardClaimed: boolean
}

/** 抽奖轮选择结果：优先可领轮，否则回退最近闭轮供展示。 */
export type LuckyClaimRoundSelection = {
  roundId: bigint
  won: boolean
  rewardAmount: bigint
  rewardClaimed: boolean
  claimable: boolean
}

/**
 * 从新到旧选择第一个可领的闭轮；皆不可领时回退最近闭轮供展示。
 *
 * `rows` 必须按 `roundId` 降序排列；回退轮为 `openRoundId - 1`，
 * 缺失时取 rows[0]。
 *
 * @param args.openRoundId 当前进行中轮次
 * @param args.paused 池是否暂停
 * @param args.rows 历史轮次（降序）
 * @returns 选中的轮次与是否可领
 * @see 手册 §14.1 用户抽奖页
 */
export function selectLuckyClaimRound(args: {
  openRoundId: bigint
  paused: boolean
  rows: readonly LuckyRoundWinnerRow[]
}): LuckyClaimRoundSelection {
  const { openRoundId, paused, rows } = args
  for (const row of rows) {
    if (
      isLuckyClaimable({
        paused,
        won: row.won,
        rewardClaimed: row.rewardClaimed,
        rewardAmount: row.rewardAmount,
      })
    ) {
      return {
        roundId: row.roundId,
        won: row.won,
        rewardAmount: row.rewardAmount,
        rewardClaimed: row.rewardClaimed,
        claimable: true,
      }
    }
  }

  const fallbackId = openRoundId > 0n ? openRoundId - 1n : 0n
  const fallback = rows.find((row) => row.roundId === fallbackId) ?? rows[0]
  if (fallback == null) {
    return {
      roundId: fallbackId,
      won: false,
      rewardAmount: 0n,
      rewardClaimed: false,
      claimable: false,
    }
  }
  return {
    roundId: fallback.roundId,
    won: fallback.won,
    rewardAmount: fallback.rewardAmount,
    rewardClaimed: fallback.rewardClaimed,
    // 上方循环已穷尽可领行，回退仅供展示。
    claimable: false,
  }
}
