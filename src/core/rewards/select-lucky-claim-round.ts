import { isLuckyClaimable } from '~/core/rewards/rewards-block-reasons'

export type LuckyRoundWinnerRow = {
  roundId: bigint
  won: boolean
  rewardAmount: bigint
  rewardClaimed: boolean
}

export type LuckyClaimRoundSelection = {
  roundId: bigint
  won: boolean
  rewardAmount: bigint
  rewardClaimed: boolean
  claimable: boolean
}

/**
 * 从新到旧选第一个可领闭轮；皆不可领则回退最近闭轮（`openRoundId - 1`，或 rows[0]）供展示。
 * `rows` 须按 `roundId` 降序。
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
    claimable: isLuckyClaimable({
      paused,
      won: fallback.won,
      rewardClaimed: fallback.rewardClaimed,
      rewardAmount: fallback.rewardAmount,
    }),
  }
}
