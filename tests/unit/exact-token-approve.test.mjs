import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('exact approve: skip when allowance covers spend', async () => {
  const { needsTokenApproval } = await loadModule('/src/web3/exchange/exchange-write.ts')

  assert.equal(needsTokenApproval(100n, 100n), false)
  assert.equal(needsTokenApproval(200n, 100n), false)
})

test('exact approve: require when allowance is short', async () => {
  const { needsTokenApproval } = await loadModule('/src/web3/exchange/exchange-write.ts')

  assert.equal(needsTokenApproval(0n, 100n), true)
  assert.equal(needsTokenApproval(99n, 100n), true)
})
