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

  // Wallet but no cached jwt → needsSignIn
  assert.deepEqual(deriveAuthState({ walletAddress: '0xabc', sessionsByAddress: {}, now }), {
    kind: 'needsSignIn',
  })

  // Wallet + expired cached jwt → needsSignIn
  assert.deepEqual(
    deriveAuthState({
      walletAddress: '0xAbC',
      sessionsByAddress: { '0xabc': expiredSession },
      now,
    }),
    { kind: 'needsSignIn' },
  )
})

test('auth-machine does not export auto login or renew scheduler', async () => {
  const machine = await loadModule('/src/core/auth/auth-machine.ts')

  assert.equal(machine.deriveAuthAction, undefined)
  assert.equal(machine.loginAttemptKey, undefined)
  assert.equal(machine.clampRenewAtMs, undefined)
  assert.equal(typeof machine.FALLBACK_SESSION_TTL_MS, 'number')
  assert.equal(machine.FALLBACK_SESSION_TTL_MS, 60 * 60 * 1000)
})
