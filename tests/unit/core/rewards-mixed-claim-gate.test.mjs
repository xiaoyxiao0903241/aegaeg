import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const ready = {
  walletReady: true,
  writeReady: true,
  sessionReady: true,
  isLocked: false,
  isPending: false,
  contributionOk: true,
  plansOk: true,
  luckyOk: true,
  claimable: 10n,
  allowUnknownAmount: false,
}

test('evaluateRewardsMixedClaimConfirmGate requires session and writeReady', async () => {
  const { evaluateRewardsMixedClaimConfirmGate } = await loadModule(
    '/src/core/rewards/mixed-claim-gate.ts',
  )
  assert.equal(evaluateRewardsMixedClaimConfirmGate(ready), true)
  assert.equal(evaluateRewardsMixedClaimConfirmGate({ ...ready, sessionReady: false }), false)
  assert.equal(evaluateRewardsMixedClaimConfirmGate({ ...ready, writeReady: false }), false)
})

test('evaluateRewardsMixedClaimConfirmGate: Dao allows unknown amount; lucky needs positive', async () => {
  const { evaluateRewardsMixedClaimConfirmGate } = await loadModule(
    '/src/core/rewards/mixed-claim-gate.ts',
  )
  assert.equal(
    evaluateRewardsMixedClaimConfirmGate({
      ...ready,
      claimable: 0n,
      allowUnknownAmount: true,
    }),
    true,
  )
  assert.equal(
    evaluateRewardsMixedClaimConfirmGate({
      ...ready,
      claimable: 0n,
      allowUnknownAmount: false,
    }),
    false,
  )
})

test('evaluateRewardsMixedClaimWritePhase maps blocks to phase', async () => {
  const { evaluateRewardsMixedClaimConfirmGate, evaluateRewardsMixedClaimWritePhase } =
    await loadModule('/src/core/rewards/mixed-claim-gate.ts')
  assert.equal(
    evaluateRewardsMixedClaimWritePhase({
      walletReady: true,
      writeReady: true,
      sessionReady: true,
      isSubmitting: false,
      contributionOk: true,
      plansOk: true,
      luckyOk: true,
      claimable: 1n,
      allowUnknownAmount: false,
    }),
    'ready',
  )
  assert.equal(
    evaluateRewardsMixedClaimWritePhase({
      walletReady: true,
      writeReady: false,
      sessionReady: true,
      isSubmitting: false,
      contributionOk: true,
      plansOk: true,
      luckyOk: true,
      claimable: 1n,
      allowUnknownAmount: false,
    }),
    'wrong_network',
  )
  assert.equal(
    evaluateRewardsMixedClaimWritePhase({
      walletReady: true,
      writeReady: true,
      sessionReady: false,
      isSubmitting: false,
      contributionOk: true,
      plansOk: true,
      luckyOk: true,
      claimable: 1n,
      allowUnknownAmount: false,
    }),
    'need_wallet',
  )
  const phase = evaluateRewardsMixedClaimWritePhase({
    walletReady: ready.walletReady,
    writeReady: ready.writeReady,
    sessionReady: ready.sessionReady,
    isSubmitting: false,
    contributionOk: ready.contributionOk,
    plansOk: ready.plansOk,
    luckyOk: ready.luckyOk,
    claimable: ready.claimable,
    allowUnknownAmount: ready.allowUnknownAmount,
  })
  assert.equal(phase === 'ready', evaluateRewardsMixedClaimConfirmGate(ready))
})
