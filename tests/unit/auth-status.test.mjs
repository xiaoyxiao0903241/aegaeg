import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

function makeJwt(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${header}.${body}.signature`
}

test('jwt helpers decode exp and detect expiry', async () => {
  const { getJwtExpiresAtMs, isJwtExpired } = await loadModule('/src/lib/api/auth/jwt.ts')

  const nowSec = Math.floor(Date.now() / 1000)
  const validToken = makeJwt({ exp: nowSec + 3600 })
  const expiredToken = makeJwt({ exp: nowSec - 60 })

  assert.ok(getJwtExpiresAtMs(validToken))
  assert.equal(isJwtExpired(validToken), false)
  assert.equal(isJwtExpired(expiredToken), true)
  assert.equal(isJwtExpired('not-a-jwt'), false)
})

test('resolveAuthStatus requires wallet, jwt, and matching address', async () => {
  const { resolveAuthStatus } = await loadModule('/src/lib/api/auth/resolve-auth-status.ts')

  const nowSec = Math.floor(Date.now() / 1000)
  const token = makeJwt({ exp: nowSec + 3600 })
  const session = {
    address: '0xAbC',
    token,
    savedAt: Date.now(),
  }

  assert.deepEqual(resolveAuthStatus({ session, walletAddress: undefined }), {
    isAuthenticated: false,
    needsSignIn: false,
    token: null,
  })

  assert.deepEqual(resolveAuthStatus({ session, walletAddress: '0xabc' }), {
    isAuthenticated: true,
    needsSignIn: false,
    token,
  })

  assert.deepEqual(resolveAuthStatus({ session, walletAddress: '0xdef' }), {
    isAuthenticated: false,
    needsSignIn: true,
    token: null,
  })
})
