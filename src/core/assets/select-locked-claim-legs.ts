/**
 * 定期仓 Mixed 领取腿：普通奖励与额外利息为独立写入口。
 *
 * UI 经「领取产出」单选一腿后再组 target；写路径仍接受腿数组。
 */
export type LockedClaimLeg = {
  amount: bigint
  extra: boolean
}
