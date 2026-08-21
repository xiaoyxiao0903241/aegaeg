import type { LockedClaimEntry } from '~/core/assets/locked-claim-entry'
import { ZERO_BI } from '~/core/constants'
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

/**
 * 产出种类对应的可领数量。
 *
 * @param args.kind 所选产出种类
 * @param args.blockReward 普通奖励
 * @param args.extraInterest 额外利息
 */
export function claimOutputAmountForKind(args: {
  kind: ClaimOutputKind
  blockReward: bigint
  extraInterest: bigint
}): bigint {
  return args.kind === 'boost' ? args.extraInterest : args.blockReward
}

/** 可领额达到展示位 0.01 才允许进入金额确认。 */
export function canSelectClaimOutput(amount: bigint, decimals: number): boolean {
  return isAssetsActionableAmount(amount, decimals)
}

/**
 * 产出种类 → 定期仓写入口参数。
 *
 * @param kind 产出选择
 * @param amount 已确认的正数量
 */
export function lockedClaimEntryFromOutput(
  kind: ClaimOutputKind,
  amount: bigint,
): LockedClaimEntry {
  return { amount, extra: kind === 'boost' }
}

/**
 * 缺数展示：贡献需求未取到按 0。
 *
 * @param required 链上所需贡献；缺省视为 0
 */
export function claimContribRequiredOrZero(required: bigint | null | undefined): bigint {
  return required ?? ZERO_BI
}

/**
 * 活期 / 定期仓 → Mixed 领取目标。
 *
 * 活期禁止加成（手册仅 `claimRewardMixed`）；定期须有 stakeIndex。
 * 金额低于 0.01 或非法组合返回 null。
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
  const amount = claimOutputAmountForKind({
    kind: args.outputKind,
    blockReward: args.blockReward,
    extraInterest: args.extraInterest,
  })
  if (!canSelectClaimOutput(amount, args.decimals)) return null

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
    entries: [lockedClaimEntryFromOutput(args.outputKind, amount)],
  }
}

/**
 * 资产 Mixed 确认门闸 → 写按钮资金阻断码。
 *
 * 贡献 / 计划失败统一 `unavailable`（细因在写路径再判）。
 */
export function assetsClaimMoneyBlock(args: {
  contributionOk: boolean
  plansOk: boolean
  claimable: bigint
  decimals: number
}): 'zeroAmount' | 'unavailable' | null {
  if (!isAssetsActionableAmount(args.claimable, args.decimals)) return 'zeroAmount'
  if (!args.plansOk || !args.contributionOk) return 'unavailable'
  return null
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
  if (assetsClaimMoneyBlock(args) != null) return false
  return canClaimWhen({
    walletReady: args.walletReady,
    writeReady: args.writeReady,
    isPending: args.isPending,
    claimable: args.claimable,
    planIndexOk: true,
  })
}
