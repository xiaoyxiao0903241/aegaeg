import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url')

function makeToken(expSeconds) {
  const body = Buffer.from(JSON.stringify({ exp: expSeconds })).toString('base64url')
  return `${header}.${body}.sig`
}

test('isPermanentLoginErrorMessage covers all LOGIN_ERROR sentinels', async () => {
  const { isPermanentLoginErrorMessage } = await loadModule('/src/core/auth/auth-machine.ts')
  const { LOGIN_ERROR, ACCOUNT_BANNED_SENTINEL } = await loadModule(
    '/src/shared/api/account-banned.ts',
  )

  assert.equal(isPermanentLoginErrorMessage(ACCOUNT_BANNED_SENTINEL), true)
  assert.equal(isPermanentLoginErrorMessage(LOGIN_ERROR.ACCOUNT_BANNED), true)
  assert.equal(isPermanentLoginErrorMessage(LOGIN_ERROR.USER_REJECTED), true)
  assert.equal(isPermanentLoginErrorMessage(LOGIN_ERROR.SIGNATURE_REJECTED), true)
  assert.equal(isPermanentLoginErrorMessage(LOGIN_ERROR.FAILED), true)
  assert.equal(isPermanentLoginErrorMessage(LOGIN_ERROR.WALLET_NOT_CONNECTED), false)
  assert.equal(isPermanentLoginErrorMessage(null), false)
  assert.equal(isPermanentLoginErrorMessage('Network request failed'), false)
})

test('shouldClearLoginAttemptAfterFailure mirrors permanent latch', async () => {
  const { shouldClearLoginAttemptAfterFailure } = await loadModule(
    '/src/core/auth/auth-machine.ts',
  )
  const { LOGIN_ERROR } = await loadModule('/src/shared/api/account-banned.ts')

  assert.equal(shouldClearLoginAttemptAfterFailure(LOGIN_ERROR.USER_REJECTED), false)
  assert.equal(shouldClearLoginAttemptAfterFailure(LOGIN_ERROR.WALLET_NOT_CONNECTED), true)
  assert.equal(shouldClearLoginAttemptAfterFailure(null), true)
  assert.equal(shouldClearLoginAttemptAfterFailure('timeout'), true)
})

test('401-style attempt key stays latched when session purged but signature kept', async () => {
  const { buildLoginAttemptKey, deriveAuthAction } = await loadModule(
    '/src/core/auth/auth-machine.ts',
  )

  const signature = { address: '0xabc', message: 'm', signature: 's', savedAt: 42 }
  const after401Key = buildLoginAttemptKey('0xabc', null, signature)

  // First silent retry after 401 purge is allowed once.
  assert.deepEqual(
    deriveAuthAction({
      state: { kind: 'needsLogin' },
      isLoggingIn: false,
      loginError: null,
      lastAttemptKey: null,
      attemptKey: after401Key,
      renewThresholdMs: 60_000,
    }),
    { type: 'login' },
  )

  // Same fingerprint after another 401 → idle (no silent loop).
  assert.deepEqual(
    deriveAuthAction({
      state: { kind: 'needsLogin' },
      isLoggingIn: false,
      loginError: null,
      lastAttemptKey: after401Key,
      attemptKey: after401Key,
      renewThresholdMs: 60_000,
    }),
    { type: 'idle' },
  )
})

test('renewAt schedules before expiry threshold', async () => {
  const { deriveAuthAction } = await loadModule('/src/core/auth/auth-machine.ts')
  const now = Date.now()
  const expiresAt = now + 10 * 60_000
  const renewThresholdMs = 60_000

  assert.deepEqual(
    deriveAuthAction({
      state: {
        kind: 'sessionReady',
        session: {
          address: '0x1',
          token: makeToken(Math.floor(expiresAt / 1000)),
          savedAt: now,
          expiresAt,
        },
      },
      isLoggingIn: false,
      loginError: null,
      lastAttemptKey: null,
      attemptKey: 'k',
      renewThresholdMs,
    }),
    { type: 'renewAt', at: expiresAt - renewThresholdMs },
  )
})
