/** 单轮中奖信息行（live 重闸 / Multicall 映射）。 */
export type LuckyRoundWinnerRow = {
  roundId: bigint
  won: boolean
  rewardAmount: bigint
  rewardClaimed: boolean
}

/**
 * 将 LuckyPool 单轮 Multicall 槽位映射为中奖行。
 *
 * `getWinnerInfo` 失败 → 当未中；`rewardClaimed` 失败 → 当未领
 * （主网 getter 可能空 revert；展示侧按未领，双领仍由合约写路径挡住）。
 *
 * @param args.roundId 轮次
 * @param args.infoOk getWinnerInfo 是否成功
 * @param args.won 是否中奖
 * @param args.rewardAmount 奖额
 * @param args.claimedOk rewardClaimed 是否成功
 * @param args.rewardClaimed 是否已领
 * @returns 供 live 重闸使用的行
 * @see 手册 §14.1 用户抽奖页
 */
export function mapLuckyClaimMulticallRow(args: {
  roundId: bigint
  infoOk: boolean
  won: boolean
  rewardAmount: bigint
  claimedOk: boolean
  rewardClaimed: boolean
}): LuckyRoundWinnerRow {
  if (!args.infoOk) {
    return {
      roundId: args.roundId,
      won: false,
      rewardAmount: 0n,
      rewardClaimed: false,
    }
  }
  return {
    roundId: args.roundId,
    won: args.won,
    rewardAmount: args.rewardAmount,
    rewardClaimed: args.claimedOk ? args.rewardClaimed : false,
  }
}
