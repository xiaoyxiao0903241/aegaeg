import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('normalizeWalletAddress lowercases and validates checksums', async () => {
  const { normalizeWalletAddress } = await loadModule(
    '/src/lib/web3/wallet-provider-account-change.ts',
  )

  assert.equal(
    normalizeWalletAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEbD'),
    '0x742d35cc6634c0532925a3b844bc9e7595f0bebd',
  )
  assert.equal(
    normalizeWalletAddress('0x742d35cc6634c0532925a3b844bc9e7595f0bebd'),
    '0x742d35cc6634c0532925a3b844bc9e7595f0bebd',
  )
  assert.equal(normalizeWalletAddress('0x742d35cc6634c0532925a3b844bc9e7595f0be'), undefined)
  assert.equal(normalizeWalletAddress('not-an-address'), undefined)
  assert.equal(normalizeWalletAddress(undefined), undefined)
})

test('getWindowEthereum returns ethereum object', async () => {
  const { getWindowEthereum } = await loadModule(
    '/src/lib/web3/wallet-provider-account-change.ts',
  )

  const provider = { selectedAddress: '0x3333333333333333333333333333333333333333' }

  const originalEthereum = globalThis.window?.ethereum
  globalThis.window = { ethereum: provider }

  try {
    assert.equal(getWindowEthereum(), provider)
  } finally {
    if (originalEthereum === undefined) {
      delete globalThis.window
    } else {
      globalThis.window = { ethereum: originalEthereum }
    }
  }
})

test('getWalletProviders returns all EIP-6963 providers', async () => {
  const { getWalletProviders } = await loadModule(
    '/src/lib/web3/wallet-provider-account-change.ts',
  )

  const firstProvider = { selectedAddress: '0x1111111111111111111111111111111111111111' }
  const secondProvider = { selectedAddress: '0x2222222222222222222222222222222222222222' }

  const originalEthereum = globalThis.window?.ethereum
  globalThis.window = {
    ethereum: {
      providers: [firstProvider, secondProvider],
    },
  }

  try {
    const providers = getWalletProviders()
    assert.equal(providers.length, 2)
    assert.equal(providers[0], firstProvider)
    assert.equal(providers[1], secondProvider)
  } finally {
    if (originalEthereum === undefined) {
      delete globalThis.window
    } else {
      globalThis.window = { ethereum: originalEthereum }
    }
  }
})

test('getWalletProviders falls back to window.ethereum', async () => {
  const { getWalletProviders } = await loadModule(
    '/src/lib/web3/wallet-provider-account-change.ts',
  )

  const provider = { selectedAddress: '0x4444444444444444444444444444444444444444' }

  const originalEthereum = globalThis.window?.ethereum
  globalThis.window = { ethereum: provider }

  try {
    const providers = getWalletProviders()
    assert.equal(providers.length, 1)
    assert.equal(providers[0], provider)
  } finally {
    if (originalEthereum === undefined) {
      delete globalThis.window
    } else {
      globalThis.window = { ethereum: originalEthereum }
    }
  }
})
