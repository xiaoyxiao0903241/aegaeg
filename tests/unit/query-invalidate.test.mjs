import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

const queryKeysModule = await loadModule('/src/lib/query/query-keys.ts')
const { queryKeys } = queryKeysModule

test('query keys normalize addresses and tokens to lowercase', () => {
  const checksummed = '0xA0b86a33E6441E6C7D3D4B4C6f8B9a2D5e7C1F3a'
  const lower = checksummed.toLowerCase()

  assert.deepEqual(queryKeys.chain.referral(checksummed), ['chain', 'referral', lower])
  assert.deepEqual(queryKeys.chain.referralIsBound(checksummed), ['chain', 'referral', 'isBound', lower])
  assert.deepEqual(queryKeys.chain.presaleUserTotal(checksummed), ['chain', 'presale', 'userTotal', lower])
  assert.deepEqual(
    queryKeys.chain.erc20Balance(checksummed, checksummed),
    ['chain', 'erc20', 'balance', lower, lower],
  )
  assert.deepEqual(
    queryKeys.chain.erc20Allowance(checksummed, checksummed, checksummed),
    ['chain', 'erc20', 'allowance', lower, lower, lower],
  )
  assert.deepEqual(
    queryKeys.chain.swapBalances(checksummed, checksummed, checksummed),
    ['chain', 'swap', 'balances', lower, lower, lower],
  )
  assert.deepEqual(
    queryKeys.chain.swapQuote(checksummed, checksummed, '1000'),
    ['chain', 'swap', 'quote', lower, lower, '1000'],
  )
})
