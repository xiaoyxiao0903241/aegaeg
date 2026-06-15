import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('auth session storage roundtrips token for address', async () => {
  const { createMemoryAuthSessionStorage, isSessionForAddress } = await loadModule(
    '/src/lib/api/auth/session.ts',
  )

  const storage = createMemoryAuthSessionStorage()

  storage.write({
    address: '0xAbC',
    token: 'jwt-token',
    savedAt: 1,
  })

  const session = storage.read()
  assert.ok(session)
  assert.equal(session.token, 'jwt-token')
  assert.ok(isSessionForAddress(session, '0xabc'))

  storage.clear()
  assert.equal(storage.read(), null)
})

test('readWalletSession ignores mismatched address', async () => {
  const { createMemoryAuthSessionStorage } = await loadModule('/src/lib/api/auth/session.ts')
  const { readWalletSession } = await loadModule('/src/lib/api/auth/login-with-wallet.ts')

  const storage = createMemoryAuthSessionStorage()
  storage.write({
    address: '0x111',
    token: 'jwt',
    savedAt: Date.now(),
  })

  assert.equal(readWalletSession('0x222', storage), null)
  assert.equal(readWalletSession('0x111', storage)?.token, 'jwt')
})

test('loginWithWallet signs message and stores jwt', async () => {
  const { createMemoryAuthSessionStorage } = await loadModule('/src/lib/api/auth/session.ts')
  const { loginWithWallet } = await loadModule('/src/lib/api/auth/login-with-wallet.ts')

  const storage = createMemoryAuthSessionStorage()
  const calls = []

  const account = {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    async signMessage({ message }) {
      calls.push(message)
      return '0xsig'
    },
  }

  const originalFetch = globalThis.fetch
  globalThis.fetch = async (url, init) => {
    assert.equal(String(url).endsWith('/auth/login'), true)
    const body = JSON.parse(String(init.body))
    assert.equal(body.address, account.address)
    assert.equal(body.signature, '0xsig')
    assert.ok(body.message.includes('Nonce:'))

    return Response.json({ code: 0, data: { token: 'jwt-from-api' } })
  }

  try {
    const result = await loginWithWallet({
      account,
      chainId: 56,
      storage,
      signMessage: (message) => account.signMessage({ message }),
    })

    assert.equal(result.token, 'jwt-from-api')
    assert.equal(storage.read()?.token, 'jwt-from-api')
    assert.equal(calls.length, 1)
  } finally {
    globalThis.fetch = originalFetch
  }
})
