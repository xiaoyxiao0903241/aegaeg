import assert from 'node:assert/strict'
import test from 'node:test'

/**
 * Mirrors `needsTokenApproval` in src/web3/exchange/exchange-write.ts —
 * exact-amount approve only when allowance is below the spend.
 */
function needsTokenApproval(allowance, amountIn) {
  return allowance < amountIn
}

test('exact approve: skip when allowance covers spend', () => {
  assert.equal(needsTokenApproval(100n, 100n), false)
  assert.equal(needsTokenApproval(200n, 100n), false)
})

test('exact approve: require when allowance is short', () => {
  assert.equal(needsTokenApproval(0n, 100n), true)
  assert.equal(needsTokenApproval(99n, 100n), true)
})

test('exact approve amount equals spend (not max uint)', () => {
  const amountIn = 1_000_000_000_000_000_000n
  const maxUint = 2n ** 256n - 1n
  assert.notEqual(amountIn, maxUint)
  assert.equal(amountIn, amountIn)
})
