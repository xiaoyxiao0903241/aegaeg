/**
 * 定期仓 Mixed：普通奖励与额外利息是两条独立写入口。
 *
 * UI 先选「收益 / 加成」再组提交目标；写路径用数组承载（通常只含一项）。
 */
export type LockedClaimEntry = {
  amount: bigint
  /** true = 额外利息入口；false = 普通奖励入口 */
  extra: boolean
}
