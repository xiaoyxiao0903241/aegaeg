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

/** AGX 精度；与手册 `formatUnits(principal, 9)` 一致。 */
const AGX_WEI_DECIMALS = 9

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

const API_CLAIM_BY_NAME: Record<string, Exclude<ProposalClaimKind, 'expired' | 'none'>> = {
  IN_PROGRESS: 'in_progress',
  CLAIMABLE: 'claimable',
  CLAIMED: 'claimed',
}

/**
 * 奖励表状态：只认 my-operations 的 `claim_status`。
 *
 * @param raw API `IN_PROGRESS` / `CLAIMABLE` / `CLAIMED`
 * @returns 展示用档位；无法识别时 `none`
 * @see 用户文档 governance-apis #my-operations
 */
export function parseProposalClaimStatus(raw: unknown): ProposalClaimKind {
  if (typeof raw === 'string') {
    const mapped = API_CLAIM_BY_NAME[raw.trim().toUpperCase()]
    if (mapped != null) return mapped
  }
  return 'none'
}

/**
 * 提案奖励列是否加 `+`。
 *
 * 原型：进行中不加号；可领 / 已领金额前加 `+`。
 *
 * @param claim 奖励列状态
 */
export function proposalRewardHasPlus(claim: ProposalClaimKind): boolean {
  return claim === 'claimable' || claim === 'claimed'
}

/**
 * 后端票数字段收成 wei。
 *
 * 纯整数当最小单位；带小数点当 AGX（`18.00` → 18e9）。缺数或乱码返回 null。
 *
 * @param raw API `votes` / `reward`
 */
export function parseProposalWei(raw: string | number | null | undefined): bigint | null {
  if (raw == null || raw === '') return null
  if (typeof raw === 'number') {
    if (!Number.isFinite(raw) || raw < 0 || !Number.isInteger(raw)) return null
    return BigInt(raw)
  }
  const text = raw.trim()
  if (/^[0-9]+$/.test(text)) return BigInt(text)
  if (!/^[0-9]+\.[0-9]+$/.test(text)) return null
  const [whole = '0', fraction = ''] = text.split('.')
  const frac = fraction.slice(0, AGX_WEI_DECIMALS).padEnd(AGX_WEI_DECIMALS, '0')
  const combined = `${whole}${frac}`.replace(/^0+(?=\d)/, '')
  return combined === '' ? null : BigInt(combined)
}

/**
 * 提案 id 收成正整数。接口有时给字符串，仓位是 uint256。
 *
 * @param raw API `proposal_id` 或仓位 `proposalId`
 */
export function asProposalId(raw: unknown): number | null {
  if (typeof raw === 'bigint') {
    if (raw <= 0n || raw > BigInt(Number.MAX_SAFE_INTEGER)) return null
    return Number(raw)
  }
  if (typeof raw === 'number') {
    return Number.isInteger(raw) && raw > 0 ? raw : null
  }
  if (typeof raw === 'string' && /^[0-9]+$/.test(raw.trim())) {
    const n = Number(raw)
    return Number.isInteger(n) && n > 0 ? n : null
  }
  return null
}

export type OverlayMyVoteChain = {
  principal: bigint
  support: VoteSupportValue | null
  withdrawable: boolean
  withdrawalDeadline: number
  state: ProposalStateValue | null
}

/**
 * 我的投票表一行：后端给行与累计 `votes`；链上仓位 overlay 锁 / 方向 / 提案状态。
 *
 * 投票权只吃 API `votes`（累计质押）。仓位查询未完成时锁定列保持空，
 * 不能把缺行当成本金 0（否则闪「已解锁」）。仓位已到且该 id 不在页里：
 * 投票仍开放则锁定列空；已结束才视为已取回。
 *
 * @param args.positionsReady 仓位查询已返回（含空数组）
 * @param args.chain 该提案仓位；没有则为 null
 * @returns 展示用选项 / 投票权 / 提案状态 / 锁定
 * @see 用户文档 governance-apis #my-votes
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
  state: ProposalStateValue | null
  lock: ProposalLockKind
} {
  const power = parseProposalWei(args.votes)
  const apiSupport = displayVoteSupport(parseVoteSupport(args.voteType))
  const state = args.liveState ?? args.chain?.state ?? parseProposalState(args.proposalState)
  if (!args.positionsReady) {
    return { support: apiSupport, power, state, lock: 'none' }
  }
  if (args.chain == null) {
    const voting = isProposalVotingOpen(state) || state === PROPOSAL_STATE.pending
    return {
      support: apiSupport,
      power,
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
    }
  }
  const chain = args.chain
  return {
    support: displayVoteSupport(chain.support) ?? apiSupport,
    power,
    state,
    lock: proposalLockKind({
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
