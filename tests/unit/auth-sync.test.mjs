import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('auth sync helpers gate auto login and wallet mismatch', async () => {
  const { createMemoryAuthSessionStorage } = await loadModule('/src/lib/api/auth/session.ts')
  const {
    buildSilentLoginAttemptKey,
    shouldAttemptAutoLogin,
    shouldClearSessionForWalletMismatch,
    shouldPurgeExpiredSession,
  } = await loadModule('/src/lib/api/auth/auth-sync.ts')

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

  assert.equal(
    shouldClearSessionForWalletMismatch(sessionStorage.read(), '0xdef'),
    true,
  )
  assert.equal(shouldPurgeExpiredSession({ address: '0x1', token: expiredToken, savedAt: 1 }), true)

  const attemptKey = buildSilentLoginAttemptKey('0xabc', null)
  assert.equal(
    shouldAttemptAutoLogin({
      hasHydrated: true,
      walletAddress: '0xabc',
      session: null,
      isLoggingIn: false,
      loginError: null,
      attemptedKey: null,
    }),
    true,
    'auto login without cached signature',
  )
  assert.equal(
    shouldAttemptAutoLogin({
      hasHydrated: true,
      walletAddress: '0xabc',
      session: null,
      isLoggingIn: false,
      loginError: null,
      attemptedKey: attemptKey,
    }),
    false,
    'skip duplicate auto login attempt',
  )
  assert.equal(
    shouldAttemptAutoLogin({
      hasHydrated: true,
      walletAddress: '0xabc',
      session: null,
      isLoggingIn: false,
      loginError: 'User rejected',
      attemptedKey: null,
    }),
    false,
    'skip auto login after user rejection',
  )
})
