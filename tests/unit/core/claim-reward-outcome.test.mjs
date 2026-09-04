import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('claimRewardOutcome: confirm fail still success and invalidate', async () => {
  const { claimRewardOutcome } = await loadModule('/src/core/rewards/claim-reward-outcome.ts')

  const failedConfirm = claimRewardOutcome({
    confirmResult: null,
    txHash: '0xabc',
  })

  assert.equal(failedConfirm.status, 'success')
  assert.equal(failedConfirm.shouldInvalidate, true)
  assert.equal(failedConfirm.txHash, '0xabc')
})

test('claimRewardOutcome: success should invalidate', async () => {
  const { claimRewardOutcome } = await loadModule('/src/core/rewards/claim-reward-outcome.ts')

  const ok = claimRewardOutcome({
    confirmResult: { order: { amount: '1' } },
    txHash: '0xdef',
  })

  assert.equal(ok.status, 'success')
  assert.equal(ok.shouldInvalidate, true)
  assert.deepEqual(ok.confirmResult, { order: { amount: '1' } })
  assert.equal(ok.txHash, '0xdef')
})
