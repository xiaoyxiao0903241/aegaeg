import {
  evaluateProposalVoteLive,
  evaluateProposalWithdrawLive,
  type ProposalVoteBlockReason,
  type ProposalWithdrawBlockReason,
} from '~/core/proposal/proposal-block-reasons'
import type { VoteSupportValue } from '~/core/proposal/proposal-state'
import {
  invalidateAfterProposalVote,
  invalidateAfterProposalWithdraw,
} from '~/shared/api/query/invalidate'
import { PROPOSAL_BLOCKED } from '~/web3/errors/write-block-errors'
import {
  readProposalVoteSnapshot,
  readProposalWithdrawSnapshot,
} from '~/web3/proposal/proposal-read'
import {
  approveAgxForProposal,
  voteOnProposal,
  withdrawProposal,
} from '~/web3/proposal/proposal-write'
import { approveThenLiveWrite } from '~/web3/wallet/approve-then-live-write'
import type { WriteSession } from '~/web3/wallet/require-write-session'

/**
 * 提交投票：预检 → 按需授权 → 实时复核 → vote。
 *
 * @param args.session 已就绪写会话
 * @param args.proposalId 提案 id
 * @param args.support 赞成 / 反对
 * @param args.amount 锁定 AGX
 */
export async function submitProposalVote(args: {
  session: WriteSession
  proposalId: number
  support: VoteSupportValue
  amount: bigint
}): Promise<void> {
  const { session, proposalId, support, amount } = args
  const { wallet, address } = session

  await approveThenLiveWrite({
    readSnapshot: () => readProposalVoteSnapshot({ user: address, proposalId }),
    evaluate: (snapshot) =>
      evaluateProposalVoteLive({
        amount,
        isBound: snapshot.isBound,
        state: snapshot.state,
        hasVoted: snapshot.hasVoted,
        existingSupport: snapshot.existingSupport,
        nextSupport: support,
        balance: snapshot.balance,
        allowance: snapshot.allowance,
        votedTotal: snapshot.votedTotal,
        maxQuorum: snapshot.maxQuorum,
      }),
    mapBlockError: (reason: ProposalVoteBlockReason) => PROPOSAL_BLOCKED[reason],
    softPreBlocks: ['insufficientAllowance'] as const,
    approve: async () => approveAgxForProposal({ wallet, amount }),
    write: async () => voteOnProposal({ wallet, proposalId, support, amount }),
  })
  invalidateAfterProposalVote()
}

/**
 * 提交领取：本金 + 收益同一笔 withdrawal。
 *
 * @param args.session 已就绪写会话
 * @param args.proposalId 提案 id
 */
export async function submitProposalWithdraw(args: {
  session: WriteSession
  proposalId: number
}): Promise<void> {
  const { session, proposalId } = args
  const { wallet, address } = session
  const nowSec = Math.floor(Date.now() / 1000)

  await approveThenLiveWrite({
    readSnapshot: () => readProposalWithdrawSnapshot({ user: address, proposalId }),
    evaluate: (snapshot) =>
      evaluateProposalWithdrawLive({
        principal: snapshot.principal,
        withdrawable: snapshot.withdrawable,
        nowSec,
        withdrawalDeadline: snapshot.withdrawalDeadline,
      }),
    mapBlockError: (reason: ProposalWithdrawBlockReason) => PROPOSAL_BLOCKED[reason],
    write: async () => withdrawProposal({ wallet, proposalId }),
  })
  invalidateAfterProposalWithdraw()
}
