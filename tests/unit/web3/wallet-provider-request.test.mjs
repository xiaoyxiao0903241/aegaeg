import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('walletProviderRequest returns when the wallet resolves after a delay', async () => {
  const { walletProviderRequest } = await loadModule('/src/web3/wallet/wallet-provider-request.ts')

  const hash = await walletProviderRequest({
    provider: {
      request: () => new Promise((resolve) => setTimeout(() => resolve('0xabc'), 80)),
    },
    method: 'eth_sendTransaction',
  })

  assert.equal(hash, '0xabc')
})

test('walletProviderRequest normalizes rejected wallet errors', async () => {
  const { walletProviderRequest } = await loadModule('/src/web3/wallet/wallet-provider-request.ts')

  await assert.rejects(
    () =>
      walletProviderRequest({
        provider: {
          request: async () => {
            throw { code: 4001, message: 'User rejected the request' }
          },
        },
        method: 'eth_sendTransaction',
      }),
    (error) => {
      assert.ok(error instanceof Error)
      assert.equal(error.message, 'User rejected the request')
      assert.equal(error.code, 4001)
      return true
    },
  )
})
