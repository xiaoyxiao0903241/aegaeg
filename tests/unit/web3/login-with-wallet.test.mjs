import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('loginMessageFormats prefers siwe then simple by default', async () => {
  const { loginMessageFormats } = await loadModule('/src/web3/auth/login-with-wallet.ts')

  const formats = loginMessageFormats()
  assert.deepEqual(formats, ['siwe', 'simple'])
})

test('loginWithWallet falls back to simple message when siwe signing fails', async () => {
  const { loginWithWallet, createMemoryLoginSignatureStorage } = await loadModule(
    '/src/web3/auth/login-with-wallet.ts',
  )
  const { createMemoryAuthSessionStorage } = await loadModule('/src/web3/auth/session.ts')

  const address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
  const originalFetch = globalThis.fetch
  let loginBody = null

  globalThis.fetch = async (_url, init) => {
    loginBody = JSON.parse(String(init?.body))
    return Response.json({
      code: 0,
      data: { token: 'jwt-token' },
    })
  }

  const signMessage = async (message) => {
    if (message.includes('Chain ID:')) {
      throw new Error('wallet does not support typed data signing')
    }
    return `sig-${message.length}`
  }

  try {
    const result = await loginWithWallet({
      account: { address, signMessage },
      chainId: 56,
      storage: createMemoryAuthSessionStorage(),
      signatureStorage: createMemoryLoginSignatureStorage(),
      signMessage,
    })

    assert.match(result.message, /^Sign in to AEGIS X/)
    assert.match(result.message, /Address:/)
    assert.equal(loginBody.address, address)
    assert.equal(loginBody.signature, `sig-${result.message.length}`)
  } finally {
    globalThis.fetch = originalFetch
  }
})
