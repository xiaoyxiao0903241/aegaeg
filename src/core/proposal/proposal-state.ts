/** 提案状态：与手册 queryProposalState / getProposal.proposalState 对齐（含 Expired=5）。 */
export const PROPOSAL_STATE = {
  pending: 0,
  active: 1,
  succeeded: 2,
  defeated: 3,
  canceled: 4,
  expired: 5,
  executed: 6,
} as const

export type ProposalStateValue = (typeof PROPOSAL_STATE)[keyof typeof PROPOSAL_STATE]

/** 投票方向：0 反对 / 1 赞成 / 2 弃权。 */
export const VOTE_SUPPORT = {
  against: 0,
  for: 1,
  abstain: 2,
} as const

export type VoteSupportValue = (typeof VOTE_SUPPORT)[keyof typeof VOTE_SUPPORT]

/** 单次投票下限：1 AGX = 1e9。 */
export const MIN_VOTE_WEI = 1_000_000_000n

const API_STATE_BY_NAME: Record<string, ProposalStateValue> = {
  PENDING: PROPOSAL_STATE.pending,
  ACTIVE: PROPOSAL_STATE.active,
  SUCCEEDED: PROPOSAL_STATE.succeeded,
  DEFEATED: PROPOSAL_STATE.defeated,
  CANCELED: PROPOSAL_STATE.canceled,
  CANCELLED: PROPOSAL_STATE.canceled,
  EXPIRED: PROPOSAL_STATE.expired,
  EXECUTED: PROPOSAL_STATE.executed,
}

const API_SUPPORT_BY_NAME: Record<string, VoteSupportValue> = {
  AGAINST: VOTE_SUPPORT.against,
  FOR: VOTE_SUPPORT.for,
  ABSTAIN: VOTE_SUPPORT.abstain,
}

/**
 * 把链上数值或后端字符串收成提案状态。
 *
 * 无法识别时返回 null，调用方按缺数空展示，不猜测。
 *
 * @param raw 链上 uint8 或 API `PENDING` / `ACTIVE` 等
 * @returns 0–6 或 null
 */
export function parseProposalState(raw: unknown): ProposalStateValue | null {
  if (typeof raw === 'number' && Number.isInteger(raw) && raw >= 0 && raw <= 6) {
    return raw as ProposalStateValue
  }
  if (typeof raw === 'bigint' && raw >= 0n && raw <= 6n) {
    return Number(raw) as ProposalStateValue
  }
  if (typeof raw === 'string') {
    const mapped = API_STATE_BY_NAME[raw.trim().toUpperCase()]
    if (mapped != null) return mapped
  }
  return null
}

/**
 * 把链上数值或后端字符串收成投票方向。
 *
 * @param raw 链上 uint8 或 API `FOR` / `AGAINST` / `ABSTAIN`
 * @returns 0–2 或 null
 */
export function parseVoteSupport(raw: unknown): VoteSupportValue | null {
  if (typeof raw === 'number' && Number.isInteger(raw) && raw >= 0 && raw <= 2) {
    return raw as VoteSupportValue
  }
  if (typeof raw === 'bigint' && raw >= 0n && raw <= 2n) {
    return Number(raw) as VoteSupportValue
  }
  if (typeof raw === 'string') {
    const mapped = API_SUPPORT_BY_NAME[raw.trim().toUpperCase()]
    if (mapped != null) return mapped
  }
  return null
}

/** 展示层忽略弃权：只保留赞成 / 反对。 */
export function displayVoteSupport(support: VoteSupportValue | null): VoteSupportValue | null {
  if (support === VOTE_SUPPORT.abstain) return null
  return support
}

/**
 * 展示用提案编号：`AIP-{id}`。
 *
 * @param id 链上 / API 提案 id
 */
export function formatProposalCode(id: number | bigint): string {
  return `AIP-${id.toString()}`
}

/**
 * 赞成 / 反对占比（不含弃权），与进度条一致。
 *
 * @param forVotes 赞成票
 * @param againstVotes 反对票
 * @returns 百分比 0–100；两边都为 0 时都为 0
 */
export function voteSharePercents(
  forVotes: bigint,
  againstVotes: bigint,
): { forPct: number; againstPct: number } {
  const total = forVotes + againstVotes
  if (total <= 0n) return { forPct: 0, againstPct: 0 }
  const forPct = Number((forVotes * 100n) / total)
  return { forPct, againstPct: 100 - forPct }
}

const PROPOSAL_STATE_KEYS = [
  'pending',
  'active',
  'succeeded',
  'defeated',
  'canceled',
  'expired',
  'executed',
] as const

export type ProposalStateKey = (typeof PROPOSAL_STATE_KEYS)[number]

/**
 * 提案状态的 i18n key，与 `PROPOSAL_STATE` 数值一一对应。
 *
 * @param state 0–6
 */
export function proposalStateKey(state: ProposalStateValue): ProposalStateKey {
  return PROPOSAL_STATE_KEYS[state]
}

/**
 * 关闭说明条文案 key。进行中出投票表单，不配关闭条。
 *
 * @param state 链上状态；缺数返回 null
 */
export function closedNoteKey(
  state: ProposalStateValue | null,
): Exclude<ProposalStateKey, 'active'> | null {
  if (state == null) return null
  const key = proposalStateKey(state)
  if (key === 'active') return null
  return key
}

export type ProposalLockKind = 'locked' | 'unlockable' | 'unlocked' | 'expired' | 'none'

/**
 * 锁定列：以链上本金与 `withdrawable` 为准，不采信 API lock_status。
 *
 * 合约已把 `block.timestamp` 编进 `withdrawable`。墙钟只在不可领时区分锁定中 / 已过期，
 * 不覆盖「现在能 withdrawal」。
 *
 * @param args.principal 该提案仍锁着的本金；0 表示已取回或未投
 * @param args.hasVoted 是否投过
 * @param args.withdrawable 现在能否调用 withdrawal
 * @param args.nowSec 当前 unix 秒
 * @param args.withdrawalDeadline 领取截止 unix 秒
 * @see docs/onchain-manual/contracts/governance.md
 */
export function proposalLockKind(args: {
  principal: bigint
  hasVoted: boolean
  withdrawable: boolean
  nowSec: number
  withdrawalDeadline: number
}): ProposalLockKind {
  if (args.principal <= 0n) {
    return args.hasVoted ? 'unlocked' : 'none'
  }
  if (args.withdrawable) return 'unlockable'
  if (args.withdrawalDeadline > 0 && args.nowSec > args.withdrawalDeadline) return 'expired'
  return 'locked'
}

export type ProposalClaimKind = 'in_progress' | 'claimable' | 'claimed' | 'expired' | 'none'

/**
 * 奖励列：进行中不领；可领与解锁共用同一笔 withdrawal。
 *
 * @param args.state 提案状态
 * @param args.principal 仍锁着的本金
 * @param args.hasVoted 是否投过
 * @param args.withdrawable 现在能否领取
 * @param args.nowSec 当前 unix 秒
 * @param args.withdrawalDeadline 领取截止
 */
export function proposalClaimKind(args: {
  state: ProposalStateValue | null
  principal: bigint
  hasVoted: boolean
  withdrawable: boolean
  nowSec: number
  withdrawalDeadline: number
}): ProposalClaimKind {
  if (!args.hasVoted) return 'none'
  if (args.state === PROPOSAL_STATE.pending || args.state === PROPOSAL_STATE.active) {
    return 'in_progress'
  }
  if (args.principal <= 0n) return 'claimed'
  if (args.withdrawable) return 'claimable'
  if (args.withdrawalDeadline > 0 && args.nowSec > args.withdrawalDeadline) return 'expired'
  return 'none'
}

/**
 * 提案奖励列是否加 `+`。
 *
 * 原型：投票期未结束不加号；结束后（可领 / 已领）金额前加 `+`。
 * 金额本身走链上 earnings，不是原型里 power×1% 的占位。
 *
 * @param claim 奖励列状态
 */
export function proposalRewardHasPlus(claim: ProposalClaimKind): boolean {
  return claim === 'claimable' || claim === 'claimed'
}

/**
 * 后端票数字符串收成 wei。只接受非负整数，缺数或乱码返回 null。
 *
 * @param raw API `votes` / 同类最小单位字段
 */
export function parseProposalWei(raw: string | number | null | undefined): bigint | null {
  if (raw == null || raw === '') return null
  const text = typeof raw === 'number' ? String(raw) : raw.trim()
  if (!/^[0-9]+$/.test(text)) return null
  return BigInt(text)
}

export type OverlayMyVoteChain = {
  principal: bigint
  earnings: bigint
  support: VoteSupportValue | null
  withdrawable: boolean
  withdrawalDeadline: number
  state: ProposalStateValue | null
}

/**
 * 我的投票表一行：后端给行，链上仓位 overlay 投票权 / 锁 / 领 / 收益。
 *
 * 投票权 1:1 锁定 AGX。仓位还在用 `principal`；已取回才退回 API `votes` 作历史。
 * 仓位查询未完成时不能把缺行当成本金 0（否则已领取 / 已解锁）。
 * 仓位已到且该 id 不在页里：投票仍开放则保持进行中；已结束才视为已取回。
 *
 * @param args.positionsReady 仓位查询已返回（含空数组）
 * @param args.chain 该提案仓位；没有则为 null
 * @returns 展示用选项 / 投票权 / 收益 / 锁领状态
 * @see docs/backend-api/api.md #governance/my-votes
 * @see docs/onchain-manual/contracts/governance.md
 */
export function overlayMyVoteRow(args: {
  voteType: string | null
  votes: string
  proposalState: string
  liveState: ProposalStateValue | null
  positionsReady: boolean
  chain: OverlayMyVoteChain | null
  nowSec: number
}): {
  support: VoteSupportValue | null
  power: bigint | null
  earnings: bigint | null
  state: ProposalStateValue | null
  lock: ProposalLockKind
  claim: ProposalClaimKind
} {
  const apiPower = parseProposalWei(args.votes)
  const chainPower = args.chain != null && args.chain.principal > 0n ? args.chain.principal : null
  const power = chainPower ?? apiPower
  const apiSupport = displayVoteSupport(parseVoteSupport(args.voteType))
  const state = args.liveState ?? args.chain?.state ?? parseProposalState(args.proposalState)
  if (!args.positionsReady) {
    return { support: apiSupport, power, earnings: null, state, lock: 'none', claim: 'none' }
  }
  if (args.chain == null) {
    const voting = isProposalVotingOpen(state) || state === PROPOSAL_STATE.pending
    return {
      support: apiSupport,
      power,
      earnings: voting ? null : 0n,
      state,
      lock: voting
        ? 'none'
        : proposalLockKind({
            principal: 0n,
            hasVoted: true,
            withdrawable: false,
            nowSec: args.nowSec,
            withdrawalDeadline: 0,
          }),
      claim: voting
        ? 'in_progress'
        : proposalClaimKind({
            state,
            principal: 0n,
            hasVoted: true,
            withdrawable: false,
            nowSec: args.nowSec,
            withdrawalDeadline: 0,
          }),
    }
  }
  const chain = args.chain
  return {
    support: displayVoteSupport(chain.support) ?? apiSupport,
    power,
    earnings: chain.earnings,
    state,
    lock: proposalLockKind({
      principal: chain.principal,
      hasVoted: true,
      withdrawable: chain.withdrawable,
      nowSec: args.nowSec,
      withdrawalDeadline: chain.withdrawalDeadline,
    }),
    claim: proposalClaimKind({
      state,
      principal: chain.principal,
      hasVoted: true,
      withdrawable: chain.withdrawable,
      nowSec: args.nowSec,
      withdrawalDeadline: chain.withdrawalDeadline,
    }),
  }
}

/**
 * 投票是否仍在进行中（可再加码）。
 *
 * Active 期间详情始终出锁定输入与赞成/反对；已投票只灰掉另一立场。
 *
 * @param state 提案状态
 */
export function isProposalVotingOpen(state: ProposalStateValue | null): boolean {
  return state === PROPOSAL_STATE.active
}
