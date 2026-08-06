export type LockedClaimLeg = {
  amount: bigint
  extra: boolean
}

/**
 * 定期仓 Mixed 领取腿：普通奖励与额外利息为独立写入口。
 *
 * 并存时按顺序返回两腿，禁止静默丢弃 extraInterest。
 * 皆为 0 时保留单腿 0，供弹窗打开后由链上校验拦截。
 */
export function selectLockedClaimLegs(args: {
  blockReward: bigint
  extraInterest: bigint
}): LockedClaimLeg[] {
  const legs: LockedClaimLeg[] = []
  if (args.blockReward > 0n) legs.push({ amount: args.blockReward, extra: false })
  if (args.extraInterest > 0n) legs.push({ amount: args.extraInterest, extra: true })
  if (legs.length === 0) legs.push({ amount: 0n, extra: false })
  return legs
}
