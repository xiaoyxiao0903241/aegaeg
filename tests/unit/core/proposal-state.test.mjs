import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('parseProposalState accepts chain numbers and API names', async () => {
  const { parseProposalState, PROPOSAL_STATE } = await loadModule(
    '/src/core/proposal/proposal-state.ts',
  )
  assert.equal(parseProposalState(1), PROPOSAL_STATE.active)
  assert.equal(parseProposalState(5n), PROPOSAL_STATE.expired)
  assert.equal(parseProposalState(6), PROPOSAL_STATE.executed)
  assert.equal(parseProposalState('SUCCEEDED'), PROPOSAL_STATE.succeeded)
  assert.equal(parseProposalState('cancelled'), PROPOSAL_STATE.canceled)
  assert.equal(parseProposalState('EXPIRED'), PROPOSAL_STATE.expired)
  assert.equal(parseProposalState('nope'), null)
})

test('parseVoteSupport maps FOR / AGAINST and rejects unknown', async () => {
  const { parseVoteSupport, VOTE_SUPPORT } = await loadModule(
    '/src/core/proposal/proposal-state.ts',
  )
  assert.equal(parseVoteSupport('FOR'), VOTE_SUPPORT.for)
  assert.equal(parseVoteSupport(0), VOTE_SUPPORT.against)
  assert.equal(parseVoteSupport('maybe'), null)
})

test('displayVoteSupport drops abstain', async () => {
  const { displayVoteSupport, VOTE_SUPPORT } = await loadModule(
    '/src/core/proposal/proposal-state.ts',
  )
  assert.equal(displayVoteSupport(VOTE_SUPPORT.for), VOTE_SUPPORT.for)
  assert.equal(displayVoteSupport(VOTE_SUPPORT.against), VOTE_SUPPORT.against)
  assert.equal(displayVoteSupport(VOTE_SUPPORT.abstain), null)
  assert.equal(displayVoteSupport(null), null)
})

test('formatProposalCode and voteSharePercents', async () => {
  const { formatProposalCode, voteSharePercents } = await loadModule(
    '/src/core/proposal/proposal-state.ts',
  )
  assert.equal(formatProposalCode(9), 'AIP-9')
  assert.deepEqual(voteSharePercents(75n, 25n), { forPct: 75, againstPct: 25 })
  assert.deepEqual(voteSharePercents(0n, 0n), { forPct: 0, againstPct: 0 })
})

test('proposalLockKind prefers chain principal and deadline', async () => {
  const { proposalLockKind } = await loadModule('/src/core/proposal/proposal-state.ts')
  assert.equal(
    proposalLockKind({
      principal: 10n,
      hasVoted: true,
      withdrawable: false,
      nowSec: 100,
      withdrawalDeadline: 200,
    }),
    'locked',
  )
  assert.equal(
    proposalLockKind({
      principal: 10n,
      hasVoted: true,
      withdrawable: true,
      nowSec: 100,
      withdrawalDeadline: 200,
    }),
    'unlockable',
  )
  assert.equal(
    proposalLockKind({
      principal: 10n,
      hasVoted: true,
      withdrawable: false,
      nowSec: 201,
      withdrawalDeadline: 200,
    }),
    'expired',
  )
  assert.equal(
    proposalLockKind({
      principal: 0n,
      hasVoted: true,
      withdrawable: false,
      nowSec: 100,
      withdrawalDeadline: 200,
    }),
    'unlocked',
  )
  assert.equal(
    proposalLockKind({
      principal: 10n,
      hasVoted: true,
      withdrawable: true,
      nowSec: 201,
      withdrawalDeadline: 200,
    }),
    'unlockable',
  )
  assert.equal(
    proposalLockKind({
      principal: 0n,
      hasVoted: false,
      withdrawable: false,
      nowSec: 1,
      withdrawalDeadline: 0,
    }),
    'none',
  )
})

test('proposalClaimKind hides claim until voting ends', async () => {
  const { proposalClaimKind, PROPOSAL_STATE } = await loadModule(
    '/src/core/proposal/proposal-state.ts',
  )
  assert.equal(
    proposalClaimKind({
      state: PROPOSAL_STATE.active,
      principal: 10n,
      hasVoted: true,
      withdrawable: false,
      nowSec: 1,
      withdrawalDeadline: 9,
    }),
    'in_progress',
  )
  assert.equal(
    proposalClaimKind({
      state: PROPOSAL_STATE.succeeded,
      principal: 10n,
      hasVoted: true,
      withdrawable: true,
      nowSec: 1,
      withdrawalDeadline: 9,
    }),
    'claimable',
  )
  assert.equal(
    proposalClaimKind({
      state: PROPOSAL_STATE.succeeded,
      principal: 0n,
      hasVoted: true,
      withdrawable: false,
      nowSec: 1,
      withdrawalDeadline: 9,
    }),
    'claimed',
  )
  assert.equal(
    proposalClaimKind({
      state: PROPOSAL_STATE.defeated,
      principal: 10n,
      hasVoted: true,
      withdrawable: true,
      nowSec: 1,
      withdrawalDeadline: 9,
    }),
    'claimable',
  )
  assert.equal(
    proposalClaimKind({
      state: PROPOSAL_STATE.succeeded,
      principal: 10n,
      hasVoted: true,
      withdrawable: false,
      nowSec: 20,
      withdrawalDeadline: 9,
    }),
    'expired',
  )
  assert.equal(
    proposalClaimKind({
      state: PROPOSAL_STATE.succeeded,
      principal: 10n,
      hasVoted: true,
      withdrawable: false,
      nowSec: 1,
      withdrawalDeadline: 9,
    }),
    'none',
  )
})

test('overlayMyVoteRow does not treat missing position as claimed', async () => {
  const { overlayMyVoteRow, PROPOSAL_STATE } = await loadModule(
    '/src/core/proposal/proposal-state.ts',
  )
  const api = {
    voteType: 'FOR',
    votes: '1000000000',
    proposalState: 'SUCCEEDED',
    liveState: PROPOSAL_STATE.succeeded,
    nowSec: 50,
  }
  const missing = overlayMyVoteRow({ ...api, positionsReady: false, chain: null })
  assert.equal(missing.lock, 'none')
  assert.equal(missing.claim, 'none')
  assert.equal(missing.power, 1000000000n)
  assert.equal(missing.earnings, null)
  assert.equal(missing.support, 1)

  const withdrawn = overlayMyVoteRow({ ...api, positionsReady: true, chain: null })
  assert.equal(withdrawn.lock, 'unlocked')
  assert.equal(withdrawn.claim, 'claimed')
  assert.equal(withdrawn.earnings, 0n)

  const activeMissing = overlayMyVoteRow({
    ...api,
    proposalState: 'ACTIVE',
    liveState: PROPOSAL_STATE.active,
    positionsReady: true,
    chain: null,
  })
  assert.equal(activeMissing.lock, 'none')
  assert.equal(activeMissing.claim, 'in_progress')
  assert.equal(activeMissing.earnings, null)

  const live = overlayMyVoteRow({
    ...api,
    positionsReady: true,
    chain: {
      principal: 5n,
      earnings: 2n,
      support: 1,
      withdrawable: true,
      withdrawalDeadline: 90,
      state: PROPOSAL_STATE.succeeded,
    },
  })
  assert.equal(live.lock, 'unlockable')
  assert.equal(live.claim, 'claimable')
  assert.equal(live.power, 5n)
  assert.equal(live.earnings, 2n)

  const emptyApi = overlayMyVoteRow({
    ...api,
    votes: '',
    positionsReady: true,
    chain: {
      principal: 8n,
      earnings: 1n,
      support: 1,
      withdrawable: false,
      withdrawalDeadline: 90,
      state: PROPOSAL_STATE.active,
    },
  })
  assert.equal(emptyApi.power, 8n)
})

test('closedNoteKey skips active and missing state', async () => {
  const { closedNoteKey, PROPOSAL_STATE } = await loadModule('/src/core/proposal/proposal-state.ts')
  assert.equal(closedNoteKey(null), null)
  assert.equal(closedNoteKey(PROPOSAL_STATE.active), null)
  assert.equal(closedNoteKey(PROPOSAL_STATE.pending), 'pending')
  assert.equal(closedNoteKey(PROPOSAL_STATE.canceled), 'canceled')
})

test('proposalRewardHasPlus only after voting ends for claimable/claimed', async () => {
  const { proposalRewardHasPlus } = await loadModule('/src/core/proposal/proposal-state.ts')
  assert.equal(proposalRewardHasPlus('in_progress'), false)
  assert.equal(proposalRewardHasPlus('none'), false)
  assert.equal(proposalRewardHasPlus('expired'), false)
  assert.equal(proposalRewardHasPlus('claimable'), true)
  assert.equal(proposalRewardHasPlus('claimed'), true)
})

test('isProposalVotingOpen only while active', async () => {
  const { isProposalVotingOpen, PROPOSAL_STATE } = await loadModule(
    '/src/core/proposal/proposal-state.ts',
  )
  assert.equal(isProposalVotingOpen(PROPOSAL_STATE.active), true)
  assert.equal(isProposalVotingOpen(PROPOSAL_STATE.pending), false)
  assert.equal(isProposalVotingOpen(PROPOSAL_STATE.succeeded), false)
  assert.equal(isProposalVotingOpen(null), false)
})
