import {
  isProposalVotingOpen,
  MIN_VOTE_WEI,
  type ProposalStateValue,
  type VoteSupportValue,
} from '~/core/proposal/proposal-state'

export type ProposalVoteBlockReason =
  | 'zeroAmount'
  | 'belowMin'
  | 'notBound'
  | 'notActive'
  | 'supportMismatch'
  | 'votesLimited'
  | 'insufficientBalance'
  | 'insufficientAllowance'
  | 'unavailable'

export type ProposalWithdrawBlockReason = 'notWithdrawable' | 'expired' | 'nothingToWithdraw'

/**
 * 投票写前实时门闸。
 *
 * 先硬门（数量 / 绑定 / 状态 / 立场 / 票数上限 / 余额），再授权不足，
 * 避免用户先补授权后才发现这笔投不了。
 *
 * @param args.amount 拟锁定的 AGX
 * @param args.isBound 是否已绑定推荐关系
 * @param args.state 提案状态
 * @param args.hasVoted 该提案是否已投过
 * @param args.existingSupport 已投方向；未投为 null
 * @param args.nextSupport 本笔方向
 * @param args.balance 钱包 AGX（链上已扣锁定额）
 * @param args.allowance 对提案合约的授权
 * @param args.votedTotal 该提案已累计票数
 * @param args.maxQuorum 单提案票数上限
 * @returns 首个阻断原因
 */
export function evaluateProposalVoteLive(args: {
  amount: bigint
  isBound: boolean
  state: ProposalStateValue | null
  hasVoted: boolean
  existingSupport: VoteSupportValue | null
  nextSupport: VoteSupportValue
  balance: bigint
  allowance: bigint
  votedTotal: bigint
  maxQuorum: bigint
}): ProposalVoteBlockReason | null {
  if (args.amount <= 0n) return 'zeroAmount'
  if (args.amount < MIN_VOTE_WEI) return 'belowMin'
  if (!args.isBound) return 'notBound'
  if (args.state == null) return 'unavailable'
  if (!isProposalVotingOpen(args.state)) return 'notActive'
  if (args.hasVoted && args.existingSupport !== args.nextSupport) {
    return 'supportMismatch'
  }
  if (args.balance < args.amount) return 'insufficientBalance'
  if (args.maxQuorum > 0n && args.votedTotal + args.amount > args.maxQuorum) {
    return 'votesLimited'
  }
  if (args.allowance < args.amount) return 'insufficientAllowance'
  return null
}

/**
 * 详情赞成/反对是否可点。
 *
 * 空数量 / 低于 1 AGX / 超过余额等硬门只灰钮，不改按钮文案。
 * 未绑定仍可点（去绑推荐）；授权不足仍可点（先补授权）。
 *
 * @param args.reason 写前阻断；null = 无硬门
 * @param args.amount 拟锁定的 AGX
 * @param args.snapshotReady 链上投票快照是否已到
 * @param args.walletReady 钱包已连接
 * @param args.writeReady 链与会话可写
 * @param args.isPending 本笔投票仍在发送
 */
export function isProposalVoteCtaEnabled(args: {
  reason: ProposalVoteBlockReason | null
  amount: bigint
  snapshotReady: boolean
  walletReady: boolean
  writeReady: boolean
  isPending: boolean
}): boolean {
  if (args.isPending || !args.writeReady || !args.walletReady || !args.snapshotReady) {
    return false
  }
  if (args.reason === 'notBound') return true
  if (args.amount < MIN_VOTE_WEI) return false
  return args.reason == null || args.reason === 'insufficientAllowance'
}

/**
 * 取回本金+收益写前实时门闸。
 *
 * 能领就发：`withdrawable` 已含链上时间。墙钟只在不可领时区分过期 / 尚未到窗。
 *
 * @param args.principal 仍锁着的本金
 * @param args.withdrawable 合约现在是否允许 withdrawal
 * @param args.nowSec 当前 unix 秒
 * @param args.withdrawalDeadline 领取截止
 * @see docs/onchain-manual/contracts/governance.md
 */
export function evaluateProposalWithdrawLive(args: {
  principal: bigint
  withdrawable: boolean
  nowSec: number
  withdrawalDeadline: number
}): ProposalWithdrawBlockReason | null {
  if (args.principal <= 0n) return 'nothingToWithdraw'
  if (args.withdrawable) return null
  if (args.withdrawalDeadline > 0 && args.nowSec > args.withdrawalDeadline) return 'expired'
  return 'notWithdrawable'
}
