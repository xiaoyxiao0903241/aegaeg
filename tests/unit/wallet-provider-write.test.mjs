import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { loadModule } from './load-module.mjs'

describe('resolveWalletEip1193Provider', () => {
  it('uses window.ethereum when eth_accounts matches the connected wallet', async () => {
    const { resolveWalletEip1193Provider } = await loadModule(
      '/src/web3/resolve-wallet-eip1193-provider.ts',
    )

    const address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'

    globalThis.window = {
      ethereum: {
        request: async ({ method }) => {
          if (method === 'eth_accounts') return [address]
          if (method === 'eth_chainId') return 'legacy'
          return null
        },
      },
    }

    const provider = resolveWalletEip1193Provider({
      id: 'com.tokenpocket.wallet',
      getAccount: () => ({ address }),
    })

    assert.equal(await provider.request({ method: 'eth_chainId' }), 'legacy')

    delete globalThis.window
  })
})
