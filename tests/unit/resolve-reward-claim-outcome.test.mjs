import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('resolveRewardClaimOutcome: confirm_failed must not invalidate', async () => {
  const { resolveRewardClaimOutcome } = await loadModule(
    '/src/core/rewards/resolve-reward-claim-outcome.ts',
  )

  const failed = resolveRewardClaimOutcome({
    confirmError: new Error('backend sync failed'),
    confirmResult: null,
    txHash: '0xabc',
  })

  assert.equal(failed.status, 'confirm_failed')
  assert.equal(failed.shouldInvalidate, false)
  assert.equal(failed.confirmResult, null)
  assert.equal(failed.txHash, '0xabc')
})

test('resolveRewardClaimOutcome: success should invalidate', async () => {
  const { resolveRewardClaimOutcome } = await loadModule(
    '/src/core/rewards/resolve-reward-claim-outcome.ts',
  )

  const ok = resolveRewardClaimOutcome({
    confirmResult: { order: { amount: '1' } },
    txHash: '0xdef',
  })

  assert.equal(ok.status, 'success')
  assert.equal(ok.shouldInvalidate, true)
  assert.deepEqual(ok.confirmResult, { order: { amount: '1' } })
  assert.equal(ok.txHash, '0xdef')
})
