import { decodeFunctionResult, encodeFunctionData, parseAbi } from 'viem'

import {
  parseProposalState,
  parseVoteSupport,
  type ProposalStateValue,
  type VoteSupportValue,
} from '~/core/proposal/proposal-state'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { AEGIS_PROPOSAL_METHODS, ERC20_METHODS, REFERRAL_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import { type Aggregate3Call, readAggregate3 } from '~/web3/multicall3-read'

const proposalAbi = parseAbi([
  AEGIS_PROPOSAL_METHODS.maxQuorumGlobal,
  AEGIS_PROPOSAL_METHODS.getProposal,
  AEGIS_PROPOSAL_METHODS.queryProposalState,
  AEGIS_PROPOSAL_METHODS.getProposalStateSummary,
  AEGIS_PROPOSAL_METHODS.getVoteReceipt,
  AEGIS_PROPOSAL_METHODS.getUserVotePositions,
])
const erc20Abi = parseAbi([ERC20_METHODS.balanceOf, ERC20_METHODS.allowance])
const referralAbi = parseAbi([REFERRAL_METHODS.isBindReferral])

/** 仓位翻页：满页继续，直到短页。 */
const POSITION_PAGE = 100n
const POSITION_PAGE_CAP = 20

export type ChainProposalLive = {
  state: ProposalStateValue | null
  voteStart: number
  voteEnd: number
  forVotes: bigint
  againstVotes: bigint
  abstainVotes: bigint
}

export type ChainVotePosition = {
  proposalId: number
  support: VoteSupportValue | null
  principal: bigint
  claimable: bigint
  state: ProposalStateValue | null
  withdrawable: boolean
  withdrawalDeadline: number
}

export type ProposalVoteSnapshot = {
  isBound: boolean
  balance: bigint
  allowance: bigint
  state: ProposalStateValue | null
  hasVoted: boolean
  existingSupport: VoteSupportValue | null
  votedTotal: bigint
  maxQuorum: bigint
  principal: bigint
}

export type ProposalWithdrawSnapshot = {
  principal: bigint
  withdrawable: boolean
  withdrawalDeadline: number
}

/** 右栏第一张卡：链上提案个数，不是票数。 */
export type ProposalStateSummary = {
  total: number
  pending: number
  active: number
}

function asNumber(value: unknown): number {
  if (typeof value === 'number') return value
  if (typeof value === 'bigint') return Number(value)
  return 0
}

/** 提案个数：超过安全整数就失败，避免卡片显示错数。 */
function asCount(value: unknown): number {
  if (typeof value === 'bigint') {
    if (value < 0n || value > BigInt(Number.MAX_SAFE_INTEGER)) {
      throw new Error('proposal-state-summary')
    }
    return Number(value)
  }
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0) return value
  throw new Error('proposal-state-summary')
}

/**
 * 解码 getProposalStateSummary 的七字段元组；卡片只用 total / pending / active。
 *
 * @param raw 合约返回值（具名或按下标）
 * @returns 提案个数
 */
export function decodeProposalStateSummary(raw: unknown): ProposalStateSummary {
  const row = raw as Record<string, unknown> & readonly unknown[]
  return {
    total: asCount(row.total ?? row[0]),
    pending: asCount(row.pending ?? row[1]),
    active: asCount(row.active ?? row[2]),
  }
}

/**
 * 一次 eth_call 读提案总数与六态数量，不扫列表。
 *
 * 六态是最近登记或同步时的快照，不保证与当前块实时一致。
 * 右栏第一张卡只用 total / pending / active。
 *
 * @returns 总数、即将开始、进行中
 */
export async function readProposalStateSummary(): Promise<ProposalStateSummary> {
  const raw = await bscReadClient.readContract({
    address: BSC_CONTRACTS.aegisProposal,
    abi: proposalAbi,
    functionName: 'getProposalStateSummary',
  })
  return decodeProposalStateSummary(raw)
}

function asPositionRows(page: unknown): readonly unknown[] {
  if (Array.isArray(page)) return page
  if (page && typeof page === 'object' && Array.isArray((page as { page?: unknown }).page)) {
    return (page as { page: unknown[] }).page
  }
  throw new Error('proposal-positions-page')
}

function decodeProposal(raw: unknown): ChainProposalLive {
  const row = raw as Record<string, unknown> & readonly unknown[]
  const stateSrc = row.proposalState ?? row[1]
  const startSrc = row.voteStart ?? row[2]
  const endSrc = row.voteEnd ?? row[3]
  const forSrc = row.forVotes ?? row[4]
  const againstSrc = row.againstVotes ?? row[5]
  const abstainSrc = row.abstainVotes ?? row[6]
  return {
    state: parseProposalState(stateSrc),
    voteStart: asNumber(startSrc),
    voteEnd: asNumber(endSrc),
    forVotes: (forSrc as bigint) ?? 0n,
    againstVotes: (againstSrc as bigint) ?? 0n,
    abstainVotes: (abstainSrc as bigint) ?? 0n,
  }
}

function decodeReceipt(raw: unknown): {
  hasVoted: boolean
  support: VoteSupportValue | null
  principal: bigint
} {
  const row = raw as Record<string, unknown> & readonly unknown[]
  return {
    hasVoted: Boolean(row.hasVoted ?? row[0]),
    support: parseVoteSupport(row.support ?? row[1]),
    principal: ((row.principal ?? row[2]) as bigint) ?? 0n,
  }
}

function decodePosition(raw: unknown): ChainVotePosition {
  const row = raw as Record<string, unknown> & readonly unknown[]
  return {
    proposalId: asNumber(row.proposalId ?? row[0]),
    support: parseVoteSupport(row.support ?? row[1]),
    principal: ((row.principal ?? row[2]) as bigint) ?? 0n,
    claimable: ((row.claimable ?? row[3]) as bigint) ?? 0n,
    state: parseProposalState(row.proposalState ?? row[5]),
    withdrawable: Boolean(row.withdrawable ?? row[6]),
    withdrawalDeadline: asNumber(row.withdrawalDeadline ?? row[8]),
  }
}

/**
 * 当前页提案的链上票数 / 时间 / 状态。
 *
 * 同批 Multicall3：`getProposal` + `queryProposalState`。展示状态信 query（存储态会滞后）；
 * 单槽失败跳过该 id，列表仍展示接口标题。
 *
 * @param ids 当前页提案 id
 */
export async function readProposalLiveByIds(
  ids: readonly number[],
): Promise<Record<number, ChainProposalLive>> {
  if (ids.length === 0) return {}
  const target = BSC_CONTRACTS.aegisProposal
  const calls: Aggregate3Call[] = ids.flatMap((id) => {
    const args = [BigInt(id)] as const
    return [
      {
        target,
        allowFailure: true,
        callData: encodeFunctionData({
          abi: proposalAbi,
          functionName: 'getProposal',
          args,
        }),
      },
      {
        target,
        allowFailure: true,
        callData: encodeFunctionData({
          abi: proposalAbi,
          functionName: 'queryProposalState',
          args,
        }),
      },
    ]
  })
  const results = await readAggregate3(calls)
  const out: Record<number, ChainProposalLive> = {}
  ids.forEach((id, index) => {
    const proposalSlot = results[index * 2]
    const stateSlot = results[index * 2 + 1]
    if (!proposalSlot?.success) return
    try {
      const live = decodeProposal(
        decodeFunctionResult({
          abi: proposalAbi,
          functionName: 'getProposal',
          data: proposalSlot.returnData,
        }),
      )
      if (stateSlot?.success) {
        try {
          const queried = parseProposalState(
            decodeFunctionResult({
              abi: proposalAbi,
              functionName: 'queryProposalState',
              data: stateSlot.returnData,
            }),
          )
          if (queried != null) live.state = queried
        } catch {
          /* 用 getProposal 存储态 */
        }
      }
      if (live.voteStart <= 0 && live.voteEnd <= 0) return
      out[id] = live
    } catch {
      /* 该 id 缺数 */
    }
  })
  return out
}

/**
 * 当前用户在提案合约上的全部仓位。
 *
 * 按 100 条一页翻到短页为止；连续满页超过上限视为读失败，不静默截断。
 *
 * @param user 钱包地址
 * @see docs/onchain-manual/contracts/governance.md
 */
export async function readProposalPositions(user: string): Promise<ChainVotePosition[]> {
  const out: ChainVotePosition[] = []
  for (let pageIndex = 0; pageIndex < POSITION_PAGE_CAP; pageIndex += 1) {
    const page = await bscReadClient.readContract({
      address: BSC_CONTRACTS.aegisProposal,
      abi: proposalAbi,
      functionName: 'getUserVotePositions',
      args: [user as `0x${string}`, BigInt(pageIndex) * POSITION_PAGE, POSITION_PAGE],
    })
    const rows = asPositionRows(page).map((row) => decodePosition(row))
    out.push(...rows)
    if (rows.length < Number(POSITION_PAGE)) return out
  }
  throw new Error('proposal-positions-page')
}

/**
 * 投票写前实时快照。
 *
 * 一次 multicall：绑定、余额、授权、提案、回执、上限、查询态。
 *
 * @param args.user 钱包
 * @param args.proposalId 提案 id
 */
export async function readProposalVoteSnapshot(args: {
  user: string
  proposalId: number
}): Promise<ProposalVoteSnapshot> {
  const { user, proposalId } = args
  const id = BigInt(proposalId)
  const owner = user as `0x${string}`
  const proposal = BSC_CONTRACTS.aegisProposal
  const calls: Aggregate3Call[] = [
    {
      target: BSC_CONTRACTS.referral,
      callData: encodeFunctionData({
        abi: referralAbi,
        functionName: 'isBindReferral',
        args: [owner],
      }),
    },
    {
      target: BSC_CONTRACTS.agx,
      callData: encodeFunctionData({
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [owner],
      }),
    },
    {
      target: BSC_CONTRACTS.agx,
      callData: encodeFunctionData({
        abi: erc20Abi,
        functionName: 'allowance',
        args: [owner, proposal],
      }),
    },
    {
      target: proposal,
      callData: encodeFunctionData({
        abi: proposalAbi,
        functionName: 'getProposal',
        args: [id],
      }),
    },
    {
      target: proposal,
      callData: encodeFunctionData({
        abi: proposalAbi,
        functionName: 'getVoteReceipt',
        args: [id, owner],
      }),
    },
    {
      target: proposal,
      callData: encodeFunctionData({
        abi: proposalAbi,
        functionName: 'maxQuorumGlobal',
      }),
    },
    {
      target: proposal,
      allowFailure: true,
      callData: encodeFunctionData({
        abi: proposalAbi,
        functionName: 'queryProposalState',
        args: [id],
      }),
    },
  ]
  const results = await readAggregate3(calls)

  const isBound = Boolean(decodeSlot(results, 0, referralAbi, 'isBindReferral', 'proposal-bind'))
  const balance = decodeSlot<bigint>(results, 1, erc20Abi, 'balanceOf', 'proposal-balance')
  const allowance = decodeSlot<bigint>(results, 2, erc20Abi, 'allowance', 'proposal-allowance')
  const live = decodeProposal(decodeSlot(results, 3, proposalAbi, 'getProposal', 'proposal-get'))
  const receipt = decodeReceipt(
    decodeSlot(results, 4, proposalAbi, 'getVoteReceipt', 'proposal-receipt'),
  )
  const maxQuorum = decodeSlot<bigint>(
    results,
    5,
    proposalAbi,
    'maxQuorumGlobal',
    'proposal-max-quorum',
  )
  const querySlot = results[6]
  let state = live.voteStart <= 0 && live.voteEnd <= 0 ? null : live.state
  if (querySlot?.success) {
    try {
      const queried = parseProposalState(
        decodeFunctionResult({
          abi: proposalAbi,
          functionName: 'queryProposalState',
          data: querySlot.returnData,
        }),
      )
      if (queried != null) state = queried
    } catch {
      /* 用 getProposal 存储态 */
    }
  }

  return {
    isBound,
    balance,
    allowance,
    state,
    hasVoted: receipt.hasVoted,
    existingSupport: receipt.support,
    votedTotal: live.forVotes + live.againstVotes + live.abstainVotes,
    maxQuorum,
    principal: receipt.principal,
  }
}

function decodeSlot<T>(
  results: Awaited<ReturnType<typeof readAggregate3>>,
  index: number,
  abi: typeof proposalAbi | typeof erc20Abi | typeof referralAbi,
  functionName: string,
  label: string,
): T {
  const slot = results[index]
  if (!slot?.success) throw new Error(label)
  return decodeFunctionResult({
    abi,
    functionName: functionName as never,
    data: slot.returnData,
  }) as T
}

/**
 * 领取写前：只读仓位页里该提案一行的本金与 withdrawable。
 *
 * @param user 钱包
 * @param proposalId 提案 id
 */
export async function readProposalWithdrawSnapshot(args: {
  user: string
  proposalId: number
}): Promise<ProposalWithdrawSnapshot> {
  const positions = await readProposalPositions(args.user)
  const position = positions.find((row) => row.proposalId === args.proposalId)
  return {
    principal: position?.principal ?? 0n,
    withdrawable: position?.withdrawable ?? false,
    withdrawalDeadline: position?.withdrawalDeadline ?? 0,
  }
}
