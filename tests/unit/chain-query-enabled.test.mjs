import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { loadModule } from './load-module.mjs'

describe('chainQueryEnabled', () => {
  it('public: respects enabled only', async () => {
    const { chainQueryEnabled } = await loadModule('/src/core/wallet/chain-query-enabled.ts')

    assert.equal(chainQueryEnabled({ scope: 'public', address: undefined }), true)
    assert.equal(chainQueryEnabled({ scope: 'public', enabled: false, address: undefined }), false)
  })

  it('wallet: requires address', async () => {
    const { chainQueryEnabled } = await loadModule('/src/core/wallet/chain-query-enabled.ts')

    assert.equal(chainQueryEnabled({ scope: 'wallet', address: undefined }), false)
    assert.equal(chainQueryEnabled({ scope: 'wallet', address: '0xabc' }), true)
    assert.equal(chainQueryEnabled({ scope: 'wallet', enabled: false, address: '0xabc' }), false)
  })
})
