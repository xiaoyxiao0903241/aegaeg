import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('auth sync helpers gate silent login and wallet mismatch', async () => {
  const { createMemoryLoginSignatureStorage } = await loadModule(
    '/src/lib/api/auth/login-signature-cache.ts',
  )
  const {
    buildSilentLoginAttemptKey,
    shouldAttemptSilentLogin,
    shouldClearSessionForWalletMismatch,
    shouldPurgeExpiredSession,
  } = await loadModule('/src/lib/api/auth/auth-sync.ts')
  const { createMemoryAuthSessionStorage } = await loadModule('/src/lib/api/auth/session.ts')

  const nowSec = Math.floor(Date.now() / 1000)
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url')
  const validBody = Buffer.from(JSON.stringify({ exp: nowSec + 3600 })).toString('base64url')
  const expiredBody = Buffer.from(JSON.stringify({ exp: nowSec - 60 })).toString('base64url')
  const validToken = `${header}.${validBody}.sig`
  const expiredToken = `${header}.${expiredBody}.sig`

  const sessionStorage = createMemoryAuthSessionStorage()
  sessionStorage.write({
    address: '0xAbC',
    token: validToken,
    savedAt: Date.now(),
  })

  const signatureStorage = createMemoryLoginSignatureStorage()
  const futureAt = new Date(Date.now() + 3600_000).toUTCString()
  signatureStorage.write({
    address: '0xabc',
    message: [
      'aegis-x.io wants you to sign in with your Ethereum account:',
      '0xabc',
      '',
      'Sign in to AEGIS X',
      '',
      'URI: https://aegis-x.io',
      'Version: 1',
      'Chain ID: 56',
      'Nonce: cached-nonce',
      'Issued At: 2026-01-01T00:00:00.000Z',
      `Expiration Time: ${futureAt}`,
    ].join('\n'),
    signature: '0xsig',
    savedAt: Date.now(),
  })

  assert.equal(
    shouldClearSessionForWalletMismatch(sessionStorage.read(), '0xdef'),
    true,
  )
  assert.equal(shouldPurgeExpiredSession({ address: '0x1', token: expiredToken, savedAt: 1 }), true)

  const attemptKey = buildSilentLoginAttemptKey('0xabc', null)
  assert.equal(
    shouldAttemptSilentLogin({
      hasHydrated: true,
      walletAddress: '0xabc',
      session: null,
      isLoggingIn: false,
      loginError: null,
      signatureStorage,
      attemptedKey: null,
    }),
    true,
  )
  assert.equal(
    shouldAttemptSilentLogin({
      hasHydrated: true,
      walletAddress: '0xabc',
      session: null,
      isLoggingIn: false,
      loginError: null,
      signatureStorage,
      attemptedKey: attemptKey,
    }),
    false,
  )
})
