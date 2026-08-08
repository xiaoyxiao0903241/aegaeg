import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url')

function makeToken(expSeconds) {
  const body = Buffer.from(JSON.stringify({ exp: expSeconds })).toString('base64url')
  return `${header}.${body}.sig`
}

function makeSession(address, expSeconds) {
  return {
    address,
    token: makeToken(expSeconds),
    savedAt: 0,
    expiresAt: expSeconds * 1000,
  }
}

test('deriveAuthState reduces wallet + jwt cache to a single state', async () => {
  const { deriveAuthState } = await loadModule('/src/core/auth/auth-machine.ts')
  const nowSec = 1_000_000
  const now = nowSec * 1000
  const validSession = makeSession('0xAbC', nowSec + 3600)
  const expiredSession = makeSession('0xAbC', nowSec - 60)

  // No wallet → disconnected
  assert.deepEqual(deriveAuthState({ walletAddress: undefined, sessionsByAddress: {}, now }), {
    kind: 'disconnected',
  })

  // Wallet + valid cached jwt → sessionReady (session is derived from the table)
  const authed = deriveAuthState({
    walletAddress: '0xabc',
    sessionsByAddress: { '0xabc': validSession },
    now,
  })
  assert.equal(authed.kind, 'sessionReady')
  assert.equal(authed.session.token, validSession.token)

  // Wallet but no cached jwt → needsLogin
  assert.deepEqual(deriveAuthState({ walletAddress: '0xabc', sessionsByAddress: {}, now }), {
    kind: 'needsLogin',
  })

  // Wallet + expired cached jwt → needsLogin
  assert.deepEqual(
    deriveAuthState({
      walletAddress: '0xAbC',
      sessionsByAddress: { '0xabc': expiredSession },
      now,
    }),
    { kind: 'needsLogin' },
  )
})

test('loginAttemptKey fingerprints address + token + signature', async () => {
  const { loginAttemptKey } = await loadModule('/src/core/auth/auth-machine.ts')
  const session = makeSession('0xAbC', 2_000_000)
  const signature = { address: '0xabc', message: 'm', signature: 's', savedAt: 42 }

  const key = loginAttemptKey('0xABC', session, signature)
  // Case-insensitive on address, stable for identical inputs.
  assert.equal(key, loginAttemptKey('0xabc', session, signature))

  // Losing the session (e.g. after a 401 purge) changes the key → one new attempt allowed.
  assert.notEqual(key, loginAttemptKey('0xabc', null, signature))

  // Same null-session + same signature → identical key → no repeated attempt (loop guard).
  assert.equal(loginAttemptKey('0xabc', null, signature), loginAttemptKey('0xabc', null, signature))
})

test('deriveAuthAction decides idle / login / renew', async () => {
  const { deriveAuthAction } = await loadModule('/src/core/auth/auth-machine.ts')
  const renewThresholdMs = 60_000
  const now = 1_000_000_000
  const base = {
    isLoggingIn: false,
    loginError: null,
    lastAttemptKey: null,
    attemptKey: 'k1',
    renewThresholdMs,
    loginChainReady: true,
  }

  // disconnected → idle
  assert.deepEqual(deriveAuthAction({ ...base, state: { kind: 'disconnected' } }), { type: 'idle' })

  // 链未就绪（未知 / 异网）→ idle，不触发登录风暴
  assert.deepEqual(
    deriveAuthAction({ ...base, loginChainReady: false, state: { kind: 'needsLogin' } }),
    { type: 'idle' },
  )

  // needsLogin + clean guards → auto-login. Silent when a cached signature
  // exists; prompts the wallet once when it does not (loop guard dedupes).
  assert.deepEqual(deriveAuthAction({ ...base, state: { kind: 'needsLogin' } }), { type: 'login' })

  // needsLogin while a login is in flight → idle
  assert.deepEqual(
    deriveAuthAction({ ...base, isLoggingIn: true, state: { kind: 'needsLogin' } }),
    { type: 'idle' },
  )

  // needsLogin after a permanent error → idle (no retry storm)
  assert.deepEqual(
    deriveAuthAction({ ...base, loginError: 'User rejected', state: { kind: 'needsLogin' } }),
    { type: 'idle' },
  )

  // needsLogin after a transient error → retry login
  assert.deepEqual(
    deriveAuthAction({
      ...base,
      loginError: 'Network request failed',
      state: { kind: 'needsLogin' },
    }),
    { type: 'login' },
  )

  // needsLogin but this exact input was already attempted → idle (dedupe / loop guard)
  assert.deepEqual(
    deriveAuthAction({
      ...base,
      lastAttemptKey: 'k1',
      attemptKey: 'k1',
      state: { kind: 'needsLogin' },
    }),
    { type: 'idle' },
  )

  // sessionReady with exp → renewAt = expiresAt - threshold
  const expiresAt = now + 10 * 60_000
  assert.deepEqual(
    deriveAuthAction({
      ...base,
      state: {
        kind: 'sessionReady',
        session: { token: 't', address: '0x1', savedAt: 0, expiresAt },
      },
    }),
    { type: 'renewAt', at: expiresAt - renewThresholdMs },
  )

  // sessionReady without exp → renewAt from savedAt + fallback TTL
  const savedAt = now - 30 * 60_000
  assert.deepEqual(
    deriveAuthAction({
      ...base,
      state: {
        kind: 'sessionReady',
        session: { token: 't', address: '0x1', savedAt },
      },
    }),
    { type: 'renewAt', at: savedAt + 60 * 60_000 - renewThresholdMs },
  )
})
