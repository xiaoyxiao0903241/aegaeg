import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('buildSiweLoginMessage follows EIP-4361 layout', async () => {
  const { buildSiweLoginMessage, createSiweLoginPayload } = await loadModule(
    '/src/lib/api/auth/build-login-message.ts',
  )

  const payload = createSiweLoginPayload({
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    chainId: 56,
    domain: 'aegis-x.io',
    nonce: 'test-nonce',
    issuedAt: '2026-06-15T00:00:00.000Z',
    ttlMs: 3_600_000,
  })

  const message = buildSiweLoginMessage(payload)

  assert.match(message, /^aegis-x\.io wants you to sign in with your Ethereum account:/)
  assert.match(message, /0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb/)
  assert.match(message, /Chain ID: 56/)
  assert.match(message, /Nonce: test-nonce/)
  assert.match(message, /Issued At: 2026-06-15T00:00:00.000Z/)
})

test('buildSimpleLoginMessage includes address and nonce', async () => {
  const { buildSimpleLoginMessage } = await loadModule(
    '/src/lib/api/auth/build-login-message.ts',
  )

  const message = buildSimpleLoginMessage({
    address: '0xabc',
    nonce: 'nonce-1',
    issuedAt: '2026-06-15T01:00:00.000Z',
  })

  assert.equal(
    message,
    [
      'Sign in to AEGIS X',
      '',
      'Address: 0xabc',
      'Nonce: nonce-1',
      'Issued At: 2026-06-15T01:00:00.000Z',
    ].join('\n'),
  )
})

test('buildLoginMessage defaults to siwe format', async () => {
  const { buildLoginMessage } = await loadModule('/src/lib/api/auth/build-login-message.ts')

  const message = buildLoginMessage(
    {
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      chainId: 56,
      nonce: 'fixed-nonce',
      issuedAt: '2026-06-15T00:00:00.000Z',
    },
    'siwe',
  )

  assert.match(message, /Nonce: fixed-nonce/)
  assert.match(message, /Chain ID: 56/)
})
