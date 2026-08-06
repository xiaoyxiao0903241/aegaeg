import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { loadModule } from '../load-module.mjs'

describe('chainWalletQueryKey', () => {
  it('appends lowercased address to prefix', async () => {
    const { chainWalletQueryKey } = await loadModule(
      '/src/shared/api/query/chain-wallet-query-key.ts',
    )

    assert.deepEqual(chainWalletQueryKey(['chain', 'turbine', 'quota'], '0xAbC'), [
      'chain',
      'turbine',
      'quota',
      '0xabc',
    ])
  })

  it('empty address sentinel keeps prefix distinct', async () => {
    const { chainWalletQueryKey } = await loadModule(
      '/src/shared/api/query/chain-wallet-query-key.ts',
    )

    assert.deepEqual(chainWalletQueryKey(['chain', 'referral'], ''), ['chain', 'referral', ''])
  })
})
