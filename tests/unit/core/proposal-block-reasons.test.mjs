import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const ready = {
  amount: 2_000_000_000n,
  isBound: true,
  state: 1,
  hasVoted: false,
  existingSupport: null,
  nextSupport: 1,
  balance: 5_000_000_000n,
  allowance: 5_000_000_000n,
  votedTotal: 0n,
  maxQuorum: 100_000_000_000n,
}

test('evaluateProposalVoteLive blocks unbound / min / stance / quorum then allowance', async () => {
  const { evaluateProposalVoteLive } = await loadModule(
    '/src/core/proposal/proposal-block-reasons.ts',
  )
  const { MIN_VOTE_WEI } = await loadModule('/src/core/proposal/proposal-state.ts')

  assert.equal(evaluateProposalVoteLive({ ...ready, isBound: false }), 'notBound')
  assert.equal(evaluateProposalVoteLive({ ...ready, amount: MIN_VOTE_WEI - 1n }), 'belowMin')
  assert.equal(evaluateProposalVoteLive({ ...ready, state: 0 }), 'notActive')
  assert.equal(
    evaluateProposalVoteLive({
      ...ready,
      hasVoted: true,
      existingSupport: 1,
      nextSupport: 0,
    }),
    'supportMismatch',
  )
  assert.equal(
    evaluateProposalVoteLive({
      ...ready,
      votedTotal: 99_000_000_000n,
      amount: 2_000_000_000n,
      maxQuorum: 100_000_000_000n,
    }),
    'votesLimited',
  )
  assert.equal(
    evaluateProposalVoteLive({ ...ready, allowance: 1_000_000_000n }),
    'insufficientAllowance',
  )
  assert.equal(
    evaluateProposalVoteLive({
      ...ready,
      hasVoted: true,
      existingSupport: 1,
      nextSupport: 1,
    }),
    null,
  )
  assert.equal(
    evaluateProposalVoteLive({
      ...ready,
      hasVoted: true,
      existingSupport: null,
      nextSupport: 0,
    }),
    'supportMismatch',
  )
  assert.equal(
    evaluateProposalVoteLive({
      ...ready,
      hasVoted: true,
      existingSupport: 0,
      nextSupport: 0,
    }),
    null,
  )
})

test('evaluateProposalWithdrawLive requires live window', async () => {
  const { evaluateProposalWithdrawLive } = await loadModule(
    '/src/core/proposal/proposal-block-reasons.ts',
  )
  assert.equal(
    evaluateProposalWithdrawLive({
      principal: 0n,
      withdrawable: true,
      nowSec: 1,
      withdrawalDeadline: 9,
    }),
    'nothingToWithdraw',
  )
  assert.equal(
    evaluateProposalWithdrawLive({
      principal: 1n,
      withdrawable: false,
      nowSec: 10,
      withdrawalDeadline: 9,
    }),
    'expired',
  )
  assert.equal(
    evaluateProposalWithdrawLive({
      principal: 1n,
      withdrawable: false,
      nowSec: 1,
      withdrawalDeadline: 9,
    }),
    'notWithdrawable',
  )
  assert.equal(
    evaluateProposalWithdrawLive({
      principal: 1n,
      withdrawable: true,
      nowSec: 1,
      withdrawalDeadline: 9,
    }),
    null,
  )
  assert.equal(
    evaluateProposalWithdrawLive({
      principal: 1n,
      withdrawable: true,
      nowSec: 10,
      withdrawalDeadline: 9,
    }),
    null,
  )
})

test('isProposalVoteCtaEnabled grays empty/min/unready; bind and allowance stay clickable', async () => {
  const { isProposalVoteCtaEnabled } = await loadModule(
    '/src/core/proposal/proposal-block-reasons.ts',
  )
  const { MIN_VOTE_WEI } = await loadModule('/src/core/proposal/proposal-state.ts')
  const ready = {
    reason: null,
    amount: MIN_VOTE_WEI,
    snapshotReady: true,
    walletReady: true,
    writeReady: true,
    isPending: false,
  }
  assert.equal(isProposalVoteCtaEnabled(ready), true)
  assert.equal(isProposalVoteCtaEnabled({ ...ready, amount: 0n, reason: 'zeroAmount' }), false)
  assert.equal(
    isProposalVoteCtaEnabled({ ...ready, amount: MIN_VOTE_WEI - 1n, reason: 'belowMin' }),
    false,
  )
  assert.equal(isProposalVoteCtaEnabled({ ...ready, snapshotReady: false }), false)
  assert.equal(isProposalVoteCtaEnabled({ ...ready, amount: 0n, reason: 'notBound' }), true)
  assert.equal(isProposalVoteCtaEnabled({ ...ready, reason: 'insufficientAllowance' }), true)
  assert.equal(isProposalVoteCtaEnabled({ ...ready, reason: 'votesLimited' }), false)
  assert.equal(isProposalVoteCtaEnabled({ ...ready, reason: 'supportMismatch' }), false)
})
