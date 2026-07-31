import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('extractRootDomain keeps apex and strips subdomain', async () => {
  const { extractRootDomain } = await loadModule('/src/shared/api/api-base-url.ts')

  assert.equal(extractRootDomain('x-123.io'), 'x-123.io')
  assert.equal(extractRootDomain('app.x-123.io'), 'x-123.io')
  assert.equal(extractRootDomain('www.app.x-123.io'), 'x-123.io')
  assert.equal(extractRootDomain('localhost'), 'localhost')
  assert.equal(extractRootDomain('127.0.0.1'), '127.0.0.1')
})

test('apiBaseUrl uses env base in dev', async () => {
  const { apiBaseUrl } = await loadModule('/src/shared/api/api-base-url.ts')

  assert.equal(
    apiBaseUrl({
      hostname: 'x-123.io',
      isDev: true,
      envBaseUrl: 'https://api.test.local/api',
    }),
    'https://api.test.local/api',
  )
})

test('apiBaseUrl uses env base on localhost in production build', async () => {
  const { apiBaseUrl } = await loadModule('/src/shared/api/api-base-url.ts')

  assert.equal(
    apiBaseUrl({
      hostname: 'localhost',
      isDev: false,
      envBaseUrl: 'https://api.test.local/api',
    }),
    'https://api.test.local/api',
  )
})

test('apiBaseUrl derives api subdomain from apex domain', async () => {
  const { apiBaseUrl } = await loadModule('/src/shared/api/api-base-url.ts')

  assert.equal(
    apiBaseUrl({
      hostname: 'x-123.io',
      isDev: false,
      deriveFromDomain: true,
    }),
    'https://api.x-123.io/api',
  )
})

test('apiBaseUrl derives api subdomain from app subdomain', async () => {
  const { apiBaseUrl } = await loadModule('/src/shared/api/api-base-url.ts')

  assert.equal(
    apiBaseUrl({
      hostname: 'app.x-123.io',
      isDev: false,
      deriveFromDomain: true,
    }),
    'https://api.x-123.io/api',
  )
})

test('apiBaseUrl respects fixed base when derive disabled', async () => {
  const { apiBaseUrl } = await loadModule('/src/shared/api/api-base-url.ts')

  assert.equal(
    apiBaseUrl({
      hostname: 'x-123.io',
      isDev: false,
      deriveFromDomain: false,
      envBaseUrl: 'https://api.fixed.example/api',
    }),
    'https://api.fixed.example/api',
  )
})
