import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { loadModule } from './load-module.mjs'

describe('resolveWalletEip1193Provider', () => {
  it('uses window.ethereum when no injected EIP-6963 provider is installed', async () => {
    const { resolveWalletEip1193Provider } = await loadModule(
      '/src/web3/resolve-wallet-eip1193-provider.ts',
    )

    globalThis.window = {
      ethereum: {
        request: async () => 'legacy',
      },
    }

    const provider = resolveWalletEip1193Provider({
      id: 'com.tokenpocket.wallet',
    })

    assert.equal(await provider.request({ method: 'eth_chainId' }), 'legacy')

    delete globalThis.window
  })
})
