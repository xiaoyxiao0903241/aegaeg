import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('resolveClaimRewardOutcome: confirm_failed must not invalidate', async () => {
  const { resolveClaimRewardOutcome } = await loadModule(
    '/src/core/rewards/resolve-claim-reward-outcome.ts',
  )

  const failed = resolveClaimRewardOutcome({
    confirmError: new Error('backend sync failed'),
    confirmResult: null,
    txHash: '0xabc',
  })

  assert.equal(failed.status, 'confirm_failed')
  assert.equal(failed.shouldInvalidate, false)
  assert.equal(failed.confirmResult, null)
  assert.equal(failed.txHash, '0xabc')
})

test('resolveClaimRewardOutcome: success should invalidate', async () => {
  const { resolveClaimRewardOutcome } = await loadModule(
    '/src/core/rewards/resolve-claim-reward-outcome.ts',
  )

  const ok = resolveClaimRewardOutcome({
    confirmResult: { order: { amount: '1' } },
    txHash: '0xdef',
  })

  assert.equal(ok.status, 'success')
  assert.equal(ok.shouldInvalidate, true)
  assert.deepEqual(ok.confirmResult, { order: { amount: '1' } })
  assert.equal(ok.txHash, '0xdef')
})
