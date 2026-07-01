import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('extractRootDomain keeps apex and strips subdomain', async () => {
  const { extractRootDomain } = await loadModule('/src/lib/api/resolve-api-base-url.ts')

  assert.equal(extractRootDomain('x-123.io'), 'x-123.io')
  assert.equal(extractRootDomain('app.x-123.io'), 'x-123.io')
  assert.equal(extractRootDomain('www.app.x-123.io'), 'x-123.io')
  assert.equal(extractRootDomain('localhost'), 'localhost')
  assert.equal(extractRootDomain('127.0.0.1'), '127.0.0.1')
})

test('resolveApiBaseUrl uses env base in dev', async () => {
  const { resolveApiBaseUrl } = await loadModule('/src/lib/api/resolve-api-base-url.ts')

  assert.equal(
    resolveApiBaseUrl({
      hostname: 'x-123.io',
      isDev: true,
      envBaseUrl: 'https://api.test.local/api',
    }),
    'https://api.test.local/api',
  )
})

test('resolveApiBaseUrl uses env base on localhost in production build', async () => {
  const { resolveApiBaseUrl } = await loadModule('/src/lib/api/resolve-api-base-url.ts')

  assert.equal(
    resolveApiBaseUrl({
      hostname: 'localhost',
      isDev: false,
      envBaseUrl: 'https://api.test.local/api',
    }),
    'https://api.test.local/api',
  )
})

test('resolveApiBaseUrl derives api subdomain from apex domain', async () => {
  const { resolveApiBaseUrl } = await loadModule('/src/lib/api/resolve-api-base-url.ts')

  assert.equal(
    resolveApiBaseUrl({
      hostname: 'x-123.io',
      isDev: false,
      deriveFromDomain: true,
    }),
    'https://api.x-123.io/api',
  )
})

test('resolveApiBaseUrl derives api subdomain from app subdomain', async () => {
  const { resolveApiBaseUrl } = await loadModule('/src/lib/api/resolve-api-base-url.ts')

  assert.equal(
    resolveApiBaseUrl({
      hostname: 'app.x-123.io',
      isDev: false,
      deriveFromDomain: true,
    }),
    'https://api.x-123.io/api',
  )
})

test('resolveApiBaseUrl respects fixed base when derive disabled', async () => {
  const { resolveApiBaseUrl } = await loadModule('/src/lib/api/resolve-api-base-url.ts')

  assert.equal(
    resolveApiBaseUrl({
      hostname: 'x-123.io',
      isDev: false,
      deriveFromDomain: false,
      envBaseUrl: 'https://api.fixed.example/api',
    }),
    'https://api.fixed.example/api',
  )
})
