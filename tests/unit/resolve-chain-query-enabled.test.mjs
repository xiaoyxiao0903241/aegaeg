import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { loadModule } from './load-module.mjs'

describe('resolveChainQueryEnabled', () => {
  it('public: respects enabled only', async () => {
    const { resolveChainQueryEnabled } = await loadModule(
      '/src/core/wallet/resolve-chain-query-enabled.ts',
    )

    assert.equal(resolveChainQueryEnabled({ scope: 'public', address: undefined }), true)
    assert.equal(
      resolveChainQueryEnabled({ scope: 'public', enabled: false, address: undefined }),
      false,
    )
  })

  it('wallet: requires address', async () => {
    const { resolveChainQueryEnabled } = await loadModule(
      '/src/core/wallet/resolve-chain-query-enabled.ts',
    )

    assert.equal(resolveChainQueryEnabled({ scope: 'wallet', address: undefined }), false)
    assert.equal(resolveChainQueryEnabled({ scope: 'wallet', address: '0xabc' }), true)
    assert.equal(
      resolveChainQueryEnabled({ scope: 'wallet', enabled: false, address: '0xabc' }),
      false,
    )
  })
})
