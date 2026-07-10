import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('mergePersistedState folds legacy top-level session into address table', async () => {
  const { mergePersistedState } = await loadModule('/src/stores/auth-store.ts')

  // Minimal JWT-shaped token with far-future exp (year 2286) so isJwtExpired passes.
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify({ exp: 9_999_999_999 })).toString('base64url')
  const token = `${header}.${payload}.sig`

  const merged = mergePersistedState(
    {
      session: {
        address: '0xAbC0000000000000000000000000000000000001',
        token,
        savedAt: 1,
      },
    },
    null,
  )

  const key = '0xabc0000000000000000000000000000000000001'
  assert.ok(merged.sessionsByAddress[key])
  assert.equal(merged.sessionsByAddress[key].token, token)
})

test('mergePersistedState drops expired JWT sessions', async () => {
  const { mergePersistedState } = await loadModule('/src/stores/auth-store.ts')

  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify({ exp: 1 })).toString('base64url')
  const token = `${header}.${payload}.sig`

  const merged = mergePersistedState(
    {
      sessionsByAddress: {
        '0xabc0000000000000000000000000000000000001': {
          address: '0xAbC0000000000000000000000000000000000001',
          token,
          savedAt: 1,
        },
      },
    },
    null,
  )

  assert.deepEqual(merged.sessionsByAddress, {})
})

test('mergePersistedState prefers store tables over legacy and keeps signatures', async () => {
  const { mergePersistedState } = await loadModule('/src/stores/auth-store.ts')

  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify({ exp: 9_999_999_999 })).toString('base64url')
  const storeToken = `${header}.${payload}.store`
  const legacyToken = `${header}.${payload}.legacy`
  const address = '0xAbC0000000000000000000000000000000000001'
  const key = address.toLowerCase()

  const merged = mergePersistedState(
    {
      sessionsByAddress: {
        [key]: { address, token: storeToken, savedAt: 2 },
      },
      signaturesByAddress: {
        [key]: { address, message: 'siwe', signature: '0xsig', savedAt: 9 },
      },
    },
    {
      sessionsByAddress: {
        [key]: { address, token: legacyToken, savedAt: 1 },
      },
      signaturesByAddress: {
        [key]: { address, message: 'old', signature: '0xold', savedAt: 1 },
      },
    },
  )

  assert.equal(merged.sessionsByAddress[key].token, storeToken)
  assert.equal(merged.signaturesByAddress[key].signature, '0xsig')
  assert.equal(merged.signaturesByAddress[key].savedAt, 9)
})
