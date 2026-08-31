import type { LockedClaimEntry } from '~/core/assets/locked-claim-entry'
import { isAssetsActionableAmount } from '~/core/exchange/token-amount'
import { canClaimWhen } from '~/core/wallet/write-cta'

/** 领取产出可选种类：普通奖励 / 额外加成。 */
export type ClaimOutputKind = 'reward' | 'boost'

export type StakeClaimKind = 'liquid' | 'locked'

/** 由产出选择拼出的 Mixed 目标（活期单入口；定期带写入口列表）。 */
export type BuiltStakeMixedClaimTarget =
  | { source: 'liquid'; amount: bigint }
  | {
      source: 'locked'
      pool: `0x${string}`
      stakeIndex: number
      amount: bigint
      entries: ReadonlyArray<LockedClaimEntry>
    }

/** 产出弹层关闭动画用的仓位快照；金额变了必须换，不能只看仓位 id。 */
export type ClaimOutputHeldRow = {
  id: string
  blockReward: bigint
  extraInterest: bigint
}

/**
 * 产出弹层是否该换掉关闭动画缓存。
 *
 * 关闭时父组件会把 row 置空，缓存上一帧以免卸掉动画。
 * 同一仓位领完加成后再打开时 id 不变、extraInterest 已是 0；只比 id 会继续显示可领按钮。
 *
 * @param held 当前缓存；尚未缓存视为需要写入
 * @param next 本次打开的地址与仓位
 * @returns 地址、仓位或可领金额任一不同则为 true
 * @see src/views/dapp/assets/claim-modal/output-modal.tsx
 */
export function shouldReplaceHeldClaimOutput(args: {
  held: { capturedAddress: string; row: ClaimOutputHeldRow } | null
  next: { capturedAddress: string; row: ClaimOutputHeldRow }
}): boolean {
  const { held, next } = args
  if (held == null) return true
  return (
    held.capturedAddress !== next.capturedAddress ||
    held.row.id !== next.row.id ||
    held.row.blockReward !== next.row.blockReward ||
    held.row.extraInterest !== next.row.extraInterest
  )
}

/**
 * 活期 Mixed 可领额。
 *
 * 预热未到期只算主仓利息；到期后把预热利息算进去。
 * `claimRewardMixed` 传入预热利息会激活预热仓并领取。
 *
 * @param warmupReward `getStakeRewards` 预热利息
 * @param activeReward `getStakeRewards` 主仓利息
 * @param warmupExpired `isWarmupExpired`
 * @returns 本次 Mixed 应传入的总领取量
 */
export function liquidMixedClaimable(
  warmupReward: bigint,
  activeReward: bigint,
  warmupExpired: boolean,
): bigint {
  return warmupExpired ? warmupReward + activeReward : activeReward
}

/**
 * 质押仓位「领取」是否可点。
 *
 * 预热未到期不可领；到期后只要普通收益（或定期加成）达到 0.01 即可。
 *
 * @param row 仓位收益与预热状态
 * @param decimals gAGX 精度
 * @returns 可点领取为 true
 */
export function isStakeRowClaimEnabled(
  row: {
    kind: StakeClaimKind
    blockReward: bigint
    extraInterest: bigint
    inWarmup?: boolean
    warmupExpired?: boolean
  },
  decimals: number,
): boolean {
  if (row.inWarmup && !row.warmupExpired) return false
  if (isAssetsActionableAmount(row.blockReward, decimals)) return true
  return row.kind !== 'liquid' && isAssetsActionableAmount(row.extraInterest, decimals)
}

/**
 * 活期 / 定期仓 → Mixed 领取目标。
 *
 * 活期禁止加成（手册仅 `claimRewardMixed`）；定期须有 stakeIndex。
 * 金额低于 0.01 或非法组合返回 null。
 * `amount` 只决定能否打开确认弹窗；上链数量由提交时链上可领决定。
 */
export function buildStakeMixedClaimTarget(args: {
  stakeKind: StakeClaimKind
  outputKind: ClaimOutputKind
  blockReward: bigint
  extraInterest: bigint
  pool: `0x${string}`
  stakeIndex: number | null
  decimals: number
}): BuiltStakeMixedClaimTarget | null {
  const amount = args.outputKind === 'boost' ? args.extraInterest : args.blockReward
  if (!isAssetsActionableAmount(amount, args.decimals)) return null

  if (args.stakeKind === 'liquid') {
    if (args.outputKind === 'boost') return null
    return { source: 'liquid', amount }
  }

  if (args.stakeIndex == null) return null
  return {
    source: 'locked',
    pool: args.pool,
    stakeIndex: args.stakeIndex,
    amount,
    entries: [{ extra: args.outputKind === 'boost' }],
  }
}

/**
 * 资产 Mixed 确认是否可点（钱包 / 链 / 提交中 / 贡献 / 计划 / 可领额）。
 */
export function evaluateAssetsClaimConfirmGate(args: {
  walletReady: boolean
  writeReady: boolean
  isPending: boolean
  contributionOk: boolean
  plansOk: boolean
  claimable: bigint
  decimals: number
}): boolean {
  if (!isAssetsActionableAmount(args.claimable, args.decimals)) return false
  if (!args.plansOk || !args.contributionOk) return false
  return canClaimWhen({
    walletReady: args.walletReady,
    writeReady: args.writeReady,
    isPending: args.isPending,
    claimable: args.claimable,
    planIndexOk: true,
  })
}
