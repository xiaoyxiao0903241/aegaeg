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

test('login signature cache respects SIWE expiration', async () => {
  const { createMemoryLoginSignatureStorage, isLoginSignatureUsable } = await loadModule(
    '/src/lib/api/auth/login-signature-cache.ts',
  )

  const storage = createMemoryLoginSignatureStorage()
  const expiredAt = new Date(Date.now() + 60_000).toUTCString()
  const expiredMessage = [
    'aegis-x.io wants you to sign in with your Ethereum account:',
    '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    '',
    'Sign in to AEGIS X',
    '',
    'URI: https://aegis-x.io',
    'Version: 1',
    'Chain ID: 56',
    'Nonce: test-nonce',
    'Issued At: 2026-01-01T00:00:00.000Z',
    `Expiration Time: ${expiredAt}`,
  ].join('\n')

  storage.write({
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    message: expiredMessage,
    signature: '0xsig',
    savedAt: Date.now(),
  })

  assert.equal(
    isLoginSignatureUsable(
      storage.readForAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'),
      Date.now() + 120_000,
    ),
    false,
  )

  const futureAt = new Date(Date.now() + 3600_000).toUTCString()
  const validMessage = expiredMessage.replace(expiredAt, futureAt)
  storage.write({
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    message: validMessage,
    signature: '0xsig',
    savedAt: Date.now(),
  })

  assert.equal(
    isLoginSignatureUsable(storage.readForAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')),
    true,
  )
})

test('loginWithWallet reuses cached signature without re-signing', async () => {
  const { createMemoryAuthSessionStorage } = await loadModule('/src/lib/api/auth/session.ts')
  const { createMemoryLoginSignatureStorage } = await loadModule(
    '/src/lib/api/auth/login-signature-cache.ts',
  )
  const { loginWithWallet } = await loadModule('/src/lib/api/auth/login-with-wallet.ts')

  const storage = createMemoryAuthSessionStorage()
  const signatureStorage = createMemoryLoginSignatureStorage()
  const futureAt = new Date(Date.now() + 3600_000).toUTCString()
  const cachedMessage = [
    'aegis-x.io wants you to sign in with your Ethereum account:',
    '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    '',
    'Sign in to AEGIS X',
    '',
    'URI: https://aegis-x.io',
    'Version: 1',
    'Chain ID: 56',
    'Nonce: cached-nonce',
    'Issued At: 2026-01-01T00:00:00.000Z',
    `Expiration Time: ${futureAt}`,
  ].join('\n')

  signatureStorage.write({
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    message: cachedMessage,
    signature: '0xcached',
    savedAt: Date.now(),
  })

  const account = {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    async signMessage() {
      throw new Error('should not sign when cache is usable')
    },
  }

  const originalFetch = globalThis.fetch
  globalThis.fetch = async (url, init) => {
    assert.equal(String(url).endsWith('/auth/login'), true)
    const body = JSON.parse(String(init.body))
    assert.equal(body.signature, '0xcached')
    assert.equal(body.message, cachedMessage)

    return Response.json({ code: 0, data: { token: 'jwt-from-cache' } })
  }

  try {
    const result = await loginWithWallet({
      account,
      chainId: 56,
      storage,
      signatureStorage,
    })

    assert.equal(result.token, 'jwt-from-cache')
    assert.equal(storage.read()?.token, 'jwt-from-cache')
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('login signature cache keeps entries per wallet address', async () => {
  const { createMemoryLoginSignatureStorage, readUsableLoginSignature } = await loadModule(
    '/src/lib/api/auth/login-signature-cache.ts',
  )

  const storage = createMemoryLoginSignatureStorage()
  const futureAt = new Date(Date.now() + 3600_000).toUTCString()
  const messageFor = (address) =>
    [
      'aegis-x.io wants you to sign in with your Ethereum account:',
      address,
      '',
      'Sign in to AEGIS X',
      '',
      'URI: https://aegis-x.io',
      'Version: 1',
      'Chain ID: 56',
      'Nonce: cached-nonce',
      'Issued At: 2026-01-01T00:00:00.000Z',
      `Expiration Time: ${futureAt}`,
    ].join('\n')

  storage.write({
    address: '0x111',
    message: messageFor('0x111'),
    signature: '0xsig111',
    savedAt: Date.now(),
  })
  storage.write({
    address: '0x222',
    message: messageFor('0x222'),
    signature: '0xsig222',
    savedAt: Date.now(),
  })

  assert.equal(readUsableLoginSignature('0x111', storage)?.signature, '0xsig111')
  assert.equal(readUsableLoginSignature('0x222', storage)?.signature, '0xsig222')
})

test('loginWithWallet signs message and stores jwt', async () => {
  const { createMemoryAuthSessionStorage } = await loadModule('/src/lib/api/auth/session.ts')
  const { createMemoryLoginSignatureStorage } = await loadModule(
    '/src/lib/api/auth/login-signature-cache.ts',
  )
  const { loginWithWallet } = await loadModule('/src/lib/api/auth/login-with-wallet.ts')

  const storage = createMemoryAuthSessionStorage()
  const signatureStorage = createMemoryLoginSignatureStorage()
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
      signatureStorage,
      signMessage: (message) => account.signMessage({ message }),
    })

    assert.equal(result.token, 'jwt-from-api')
    assert.equal(storage.read()?.token, 'jwt-from-api')
    assert.equal(
      signatureStorage.readForAddress(account.address)?.signature,
      '0xsig',
    )
    assert.equal(calls.length, 1)
  } finally {
    globalThis.fetch = originalFetch
  }
})
