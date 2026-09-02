import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('isLoginChainReady: only known live === expected', async () => {
  const { isLoginChainReady } = await loadModule('/src/core/auth/auth-machine.ts')

  assert.equal(isLoginChainReady(56, 56), true)
  assert.equal(isLoginChainReady(1, 56), false)
  assert.equal(isLoginChainReady(undefined, 56), false)
  assert.equal(isLoginChainReady(null, 56), false)
})

test('deriveAuthAction: !loginChainReady → idle (unknown and wrong share path)', async () => {
  const { deriveAuthAction } = await loadModule('/src/core/auth/auth-machine.ts')
  const now = Date.now()
  const expiresAt = now + 10 * 60_000
  const session = {
    address: '0x1',
    token: 't',
    savedAt: now,
    expiresAt,
  }

  assert.deepEqual(
    deriveAuthAction({
      state: { kind: 'needsSignIn' },
      isLoggingIn: false,
      loginError: null,
      lastAttemptKey: null,
      attemptKey: 'k',
      renewThresholdMs: 60_000,
      loginChainReady: false,
    }),
    { type: 'idle' },
  )
  assert.deepEqual(
    deriveAuthAction({
      state: { kind: 'sessionReady', session },
      isLoggingIn: false,
      loginError: null,
      lastAttemptKey: null,
      attemptKey: 'k',
      renewThresholdMs: 60_000,
      loginChainReady: false,
    }),
    { type: 'idle' },
  )
})

test('deriveAuthAction: loginChainReady allows login and renewAt', async () => {
  const { deriveAuthAction } = await loadModule('/src/core/auth/auth-machine.ts')
  const now = Date.now()
  const expiresAt = now + 10 * 60_000
  const renewThresholdMs = 60_000

  assert.deepEqual(
    deriveAuthAction({
      state: { kind: 'needsSignIn' },
      isLoggingIn: false,
      loginError: null,
      lastAttemptKey: null,
      attemptKey: 'k',
      renewThresholdMs,
      loginChainReady: true,
    }),
    { type: 'login' },
  )

  assert.deepEqual(
    deriveAuthAction({
      state: {
        kind: 'sessionReady',
        session: {
          address: '0x1',
          token: 't',
          savedAt: now,
          expiresAt,
        },
      },
      isLoggingIn: false,
      loginError: null,
      lastAttemptKey: null,
      attemptKey: 'k',
      renewThresholdMs,
      loginChainReady: true,
    }),
    { type: 'renewAt', at: expiresAt - renewThresholdMs },
  )
})
