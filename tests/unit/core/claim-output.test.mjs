import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const pool = '0x1111111111111111111111111111111111111111'
const GAGX_DECIMALS = 9
const GAGX_ACTION_FLOOR = 10n ** 7n

test('claimOutputAmountForKind picks reward vs boost', async () => {
  const { claimOutputAmountForKind } = await loadModule('/src/core/assets/claim-output.ts')
  assert.equal(
    claimOutputAmountForKind({ kind: 'reward', blockReward: 10n, extraInterest: 3n }),
    10n,
  )
  assert.equal(claimOutputAmountForKind({ kind: 'boost', blockReward: 10n, extraInterest: 3n }), 3n)
})

test('canSelectClaimOutput requires amount at the 0.01 display floor', async () => {
  const { canSelectClaimOutput } = await loadModule('/src/core/assets/claim-output.ts')
  assert.equal(canSelectClaimOutput(0n, GAGX_DECIMALS), false)
  assert.equal(canSelectClaimOutput(1n, GAGX_DECIMALS), false)
  assert.equal(canSelectClaimOutput(GAGX_ACTION_FLOOR - 1n, GAGX_DECIMALS), false)
  assert.equal(canSelectClaimOutput(GAGX_ACTION_FLOOR, GAGX_DECIMALS), true)
})

test('claimContribRequiredOrZero treats missing as 0', async () => {
  const { claimContribRequiredOrZero } = await loadModule('/src/core/assets/claim-output.ts')
  assert.equal(claimContribRequiredOrZero(undefined), 0n)
  assert.equal(claimContribRequiredOrZero(null), 0n)
  assert.equal(claimContribRequiredOrZero(12n), 12n)
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
      entries: [{ amount: GAGX_ACTION_FLOOR * 8n, extra: false }],
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
      entries: [{ amount: GAGX_ACTION_FLOOR * 2n, extra: true }],
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
