import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('walletProviderRequest rejects when wallet never responds', async () => {
  const { walletProviderRequest } = await loadModule('/src/web3/wallet/wallet-provider-request.ts')

  const provider = {
    request: () => new Promise(() => {}),
  }

  const started = Date.now()
  await assert.rejects(
    () =>
      walletProviderRequest({
        provider,
        method: 'eth_sendTransaction',
        timeoutMs: 50,
        timeoutMessage: 'Wallet closed',
      }),
    (error) => {
      assert.ok(error instanceof Error)
      assert.equal(error.message, 'Wallet closed')
      return true
    },
  )
  assert.ok(Date.now() - started < 200)
})
