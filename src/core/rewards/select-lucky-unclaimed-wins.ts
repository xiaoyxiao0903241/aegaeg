export type LuckyUnclaimedRound = {
  roundId: bigint
  rewardAmount: bigint
}

/**
 * 根据中奖轮与已领集合算出未领合计与待领轮列表。
 *
 * 轮次按 roundId 降序（最新在前）。领取按列表逐轮 `claimRewardMixed`。
 *
 * @param args.paused 池是否暂停
 * @param args.wins 中奖轮（可含重复 roundId，按 round 去重留首次）
 * @param args.claimedRoundIds 已领 roundId 集合
 * @returns 未领合计 / 待领轮列表（降序）/ 是否可领
 * @see 手册 §14.1 用户抽奖页
 */
export function selectLuckyUnclaimedWins(args: {
  paused: boolean
  wins: readonly { roundId: bigint; rewardAmount: bigint }[]
  claimedRoundIds: ReadonlySet<bigint>
}): {
  totalUnclaimedAmount: bigint
  unclaimedRounds: LuckyUnclaimedRound[]
  /** 最新一笔未领轮；无可领为 0 */
  roundId: bigint
  rewardAmount: bigint
  won: boolean
  rewardClaimed: boolean
  claimable: boolean
} {
  const byRound = new Map<bigint, bigint>()
  for (const win of args.wins) {
    if (win.roundId <= 0n || win.rewardAmount <= 0n) continue
    if (!byRound.has(win.roundId)) byRound.set(win.roundId, win.rewardAmount)
  }

  const unclaimedRounds: LuckyUnclaimedRound[] = [...byRound.entries()]
    .filter(([roundId]) => !args.claimedRoundIds.has(roundId))
    .sort((a, b) => (a[0] > b[0] ? -1 : a[0] < b[0] ? 1 : 0))
    .map(([roundId, rewardAmount]) => ({ roundId, rewardAmount }))

  let totalUnclaimedAmount = 0n
  for (const row of unclaimedRounds) totalUnclaimedAmount += row.rewardAmount

  const next = unclaimedRounds[0]
  if (next == null) {
    return {
      totalUnclaimedAmount: 0n,
      unclaimedRounds: [],
      roundId: 0n,
      rewardAmount: 0n,
      won: false,
      rewardClaimed: false,
      claimable: false,
    }
  }

  const claimable = !args.paused && totalUnclaimedAmount > 0n
  return {
    totalUnclaimedAmount,
    unclaimedRounds,
    roundId: next.roundId,
    rewardAmount: next.rewardAmount,
    won: true,
    rewardClaimed: false,
    claimable,
  }
}
