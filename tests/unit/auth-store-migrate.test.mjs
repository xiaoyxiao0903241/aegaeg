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
