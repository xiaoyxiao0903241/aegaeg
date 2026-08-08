import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const pool = '0x1111111111111111111111111111111111111111'

test('claimOutputAmountForKind picks reward vs boost', async () => {
  const { claimOutputAmountForKind } = await loadModule('/src/core/assets/claim-output.ts')
  assert.equal(
    claimOutputAmountForKind({ kind: 'reward', blockReward: 10n, extraInterest: 3n }),
    10n,
  )
  assert.equal(claimOutputAmountForKind({ kind: 'boost', blockReward: 10n, extraInterest: 3n }), 3n)
})

test('canSelectClaimOutput requires positive amount', async () => {
  const { canSelectClaimOutput } = await loadModule('/src/core/assets/claim-output.ts')
  assert.equal(canSelectClaimOutput(0n), false)
  assert.equal(canSelectClaimOutput(1n), true)
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
      blockReward: 5n,
      extraInterest: 9n,
      pool,
      stakeIndex: null,
    }),
    { source: 'liquid', amount: 5n },
  )
  assert.equal(
    buildStakeMixedClaimTarget({
      stakeKind: 'liquid',
      outputKind: 'boost',
      blockReward: 5n,
      extraInterest: 9n,
      pool,
      stakeIndex: null,
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
      blockReward: 8n,
      extraInterest: 2n,
      pool,
      stakeIndex: 3,
    }),
    {
      source: 'locked',
      pool,
      stakeIndex: 3,
      amount: 8n,
      entries: [{ amount: 8n, extra: false }],
    },
  )
  assert.deepEqual(
    buildStakeMixedClaimTarget({
      stakeKind: 'locked',
      outputKind: 'boost',
      blockReward: 8n,
      extraInterest: 2n,
      pool,
      stakeIndex: 3,
    }),
    {
      source: 'locked',
      pool,
      stakeIndex: 3,
      amount: 2n,
      entries: [{ amount: 2n, extra: true }],
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
      isLocked: false,
      isPending: false,
      contributionOk: true,
      plansOk: true,
      claimable: 1n,
    }),
    false,
  )
  assert.equal(
    evaluateAssetsClaimConfirmGate({
      walletReady: true,
      writeReady: true,
      isLocked: false,
      isPending: false,
      contributionOk: false,
      plansOk: true,
      claimable: 1n,
    }),
    false,
  )
  assert.equal(
    evaluateAssetsClaimConfirmGate({
      walletReady: true,
      writeReady: true,
      isLocked: false,
      isPending: false,
      contributionOk: true,
      plansOk: true,
      claimable: 1n,
    }),
    true,
  )
})
