import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const ready = {
  walletReady: true,
  writeReady: true,
  sessionReady: true,
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
