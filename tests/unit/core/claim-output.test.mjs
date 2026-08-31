import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const pool = '0x1111111111111111111111111111111111111111'
const GAGX_DECIMALS = 9
const GAGX_ACTION_FLOOR = 10n ** 7n

test('shouldReplaceHeldClaimOutput refreshes when extraInterest zeros on same stake', async () => {
  const { shouldReplaceHeldClaimOutput } = await loadModule('/src/core/assets/claim-output.ts')
  const address = '0xabc'
  const held = {
    capturedAddress: address,
    row: { id: 'locked-180-0', blockReward: GAGX_ACTION_FLOOR, extraInterest: GAGX_ACTION_FLOOR },
  }
  assert.equal(
    shouldReplaceHeldClaimOutput({
      held,
      next: {
        capturedAddress: address,
        row: {
          id: 'locked-180-0',
          blockReward: GAGX_ACTION_FLOOR,
          extraInterest: GAGX_ACTION_FLOOR,
        },
      },
    }),
    false,
  )
  assert.equal(
    shouldReplaceHeldClaimOutput({
      held,
      next: {
        capturedAddress: address,
        row: { id: 'locked-180-0', blockReward: GAGX_ACTION_FLOOR, extraInterest: 0n },
      },
    }),
    true,
  )
  assert.equal(
    shouldReplaceHeldClaimOutput({
      held,
      next: {
        capturedAddress: address,
        row: { id: 'locked-180-0', blockReward: 0n, extraInterest: GAGX_ACTION_FLOOR },
      },
    }),
    true,
  )
})

test('buildStakeMixedClaimTarget: liquid reward only; boost rejected', async () => {
  const { buildStakeMixedClaimTarget } = await loadModule('/src/core/assets/claim-output.ts')
  assert.deepEqual(
    buildStakeMixedClaimTarget({
      stakeKind: 'liquid',
      outputKind: 'reward',
      blockReward: GAGX_ACTION_FLOOR * 5n,
      extraInterest: GAGX_ACTION_FLOOR * 9n,
      pool,
      stakeIndex: null,
      decimals: GAGX_DECIMALS,
    }),
    { source: 'liquid', amount: GAGX_ACTION_FLOOR * 5n },
  )
  assert.equal(
    buildStakeMixedClaimTarget({
      stakeKind: 'liquid',
      outputKind: 'boost',
      blockReward: GAGX_ACTION_FLOOR * 5n,
      extraInterest: GAGX_ACTION_FLOOR * 9n,
      pool,
      stakeIndex: null,
      decimals: GAGX_DECIMALS,
    }),
    null,
  )
})

test('buildStakeMixedClaimTarget: locked maps reward/boost to write entry', async () => {
  const { buildStakeMixedClaimTarget } = await loadModule('/src/core/assets/claim-output.ts')
  assert.deepEqual(
    buildStakeMixedClaimTarget({
      stakeKind: 'locked',
      outputKind: 'reward',
      blockReward: GAGX_ACTION_FLOOR * 8n,
      extraInterest: GAGX_ACTION_FLOOR * 2n,
      pool,
      stakeIndex: 3,
      decimals: GAGX_DECIMALS,
    }),
    {
      source: 'locked',
      pool,
      stakeIndex: 3,
      amount: GAGX_ACTION_FLOOR * 8n,
      entries: [{ extra: false }],
    },
  )
  assert.deepEqual(
    buildStakeMixedClaimTarget({
      stakeKind: 'locked',
      outputKind: 'boost',
      blockReward: GAGX_ACTION_FLOOR * 8n,
      extraInterest: GAGX_ACTION_FLOOR * 2n,
      pool,
      stakeIndex: 3,
      decimals: GAGX_DECIMALS,
    }),
    {
      source: 'locked',
      pool,
      stakeIndex: 3,
      amount: GAGX_ACTION_FLOOR * 2n,
      entries: [{ extra: true }],
    },
  )
})

test('buildStakeMixedClaimTarget fail-closed on zero / missing stakeIndex', async () => {
  const { buildStakeMixedClaimTarget } = await loadModule('/src/core/assets/claim-output.ts')
  assert.equal(
    buildStakeMixedClaimTarget({
      stakeKind: 'locked',
      outputKind: 'reward',
      blockReward: 0n,
      extraInterest: 0n,
      pool,
      stakeIndex: 0,
      decimals: GAGX_DECIMALS,
    }),
    null,
  )
  assert.equal(
    buildStakeMixedClaimTarget({
      stakeKind: 'locked',
      outputKind: 'reward',
      blockReward: GAGX_ACTION_FLOOR - 1n,
      extraInterest: 0n,
      pool,
      stakeIndex: 0,
      decimals: GAGX_DECIMALS,
    }),
    null,
  )
  assert.equal(
    buildStakeMixedClaimTarget({
      stakeKind: 'locked',
      outputKind: 'reward',
      blockReward: 1n,
      extraInterest: 0n,
      pool,
      stakeIndex: null,
      decimals: GAGX_DECIMALS,
    }),
    null,
  )
})

test('evaluateAssetsClaimConfirmGate requires writeReady and contribution', async () => {
  const { evaluateAssetsClaimConfirmGate } = await loadModule('/src/core/assets/claim-output.ts')
  assert.equal(
    evaluateAssetsClaimConfirmGate({
      walletReady: true,
      writeReady: false,
      isPending: false,
      contributionOk: true,
      plansOk: true,
      claimable: GAGX_ACTION_FLOOR,
      decimals: GAGX_DECIMALS,
    }),
    false,
  )
  assert.equal(
    evaluateAssetsClaimConfirmGate({
      walletReady: true,
      writeReady: true,
      isPending: false,
      contributionOk: false,
      plansOk: true,
      claimable: GAGX_ACTION_FLOOR,
      decimals: GAGX_DECIMALS,
    }),
    false,
  )
  assert.equal(
    evaluateAssetsClaimConfirmGate({
      walletReady: true,
      writeReady: true,
      isPending: false,
      contributionOk: true,
      plansOk: true,
      claimable: 1n,
      decimals: GAGX_DECIMALS,
    }),
    false,
  )
  assert.equal(
    evaluateAssetsClaimConfirmGate({
      walletReady: true,
      writeReady: true,
      isPending: false,
      contributionOk: true,
      plansOk: true,
      claimable: GAGX_ACTION_FLOOR,
      decimals: GAGX_DECIMALS,
    }),
    true,
  )
})

test('liquidMixedClaimable includes warmup only after expiry', async () => {
  const { liquidMixedClaimable } = await loadModule('/src/core/assets/claim-output.ts')
  assert.equal(liquidMixedClaimable(10n, 3n, false), 3n)
  assert.equal(liquidMixedClaimable(10n, 3n, true), 13n)
  assert.equal(liquidMixedClaimable(10n, 0n, true), 10n)
  assert.equal(liquidMixedClaimable(0n, 3n, true), 3n)
})

test('isStakeRowClaimEnabled: expired warmup with reward can claim; active warmup cannot', async () => {
  const { isStakeRowClaimEnabled } = await loadModule('/src/core/assets/claim-output.ts')
  const warmup = {
    kind: 'liquid',
    blockReward: GAGX_ACTION_FLOOR,
    extraInterest: 0n,
    inWarmup: true,
    warmupExpired: false,
  }
  assert.equal(isStakeRowClaimEnabled(warmup, GAGX_DECIMALS), false)
  assert.equal(isStakeRowClaimEnabled({ ...warmup, warmupExpired: true }, GAGX_DECIMALS), true)
  assert.equal(
    isStakeRowClaimEnabled({ ...warmup, warmupExpired: true, blockReward: 0n }, GAGX_DECIMALS),
    false,
  )
})
