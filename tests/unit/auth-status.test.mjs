import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

function makeJwt(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${header}.${body}.signature`
}

test('jwt helpers decode exp and detect expiry', async () => {
  const { getJwtExpiresAtMs, isJwtExpired } = await loadModule('/src/core/auth/jwt.ts')

  const nowSec = Math.floor(Date.now() / 1000)
  const validToken = makeJwt({ exp: nowSec + 3600 })
  const expiredToken = makeJwt({ exp: nowSec - 60 })

  assert.ok(getJwtExpiresAtMs(validToken))
  assert.equal(isJwtExpired(validToken), false)
  assert.equal(isJwtExpired(expiredToken), true)
  assert.equal(isJwtExpired('not-a-jwt'), false)
})

test('authStatus requires wallet, jwt, and matching address', async () => {
  const { authStatus } = await loadModule('/src/core/auth/auth-status.ts')

  const nowSec = Math.floor(Date.now() / 1000)
  const token = makeJwt({ exp: nowSec + 3600 })
  const session = {
    address: '0xAbC',
    token,
    savedAt: Date.now(),
  }

  assert.deepEqual(authStatus({ session, walletAddress: undefined }), {
    sessionReady: false,
    needsSignIn: false,
    token: null,
  })

  assert.deepEqual(authStatus({ session, walletAddress: '0xabc' }), {
    sessionReady: true,
    needsSignIn: false,
    token,
  })

  assert.deepEqual(authStatus({ session, walletAddress: '0xdef' }), {
    sessionReady: false,
    needsSignIn: true,
    token: null,
  })
})
