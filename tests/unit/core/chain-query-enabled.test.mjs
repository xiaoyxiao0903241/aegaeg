import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { loadModule } from '../load-module.mjs'

describe('chainQueryEnabled', () => {
  it('requires hydrated session for public and wallet', async () => {
    const { chainQueryEnabled } = await loadModule('/src/core/wallet/chain-query-enabled.ts')

    assert.equal(
      chainQueryEnabled({
        scope: 'public',
        address: undefined,
        sessionReady: false,
        hasHydrated: true,
      }),
      false,
    )
    assert.equal(
      chainQueryEnabled({
        scope: 'public',
        address: undefined,
        sessionReady: true,
        hasHydrated: false,
      }),
      false,
    )
    assert.equal(
      chainQueryEnabled({
        scope: 'public',
        address: undefined,
        sessionReady: true,
        hasHydrated: true,
      }),
      true,
    )
    assert.equal(
      chainQueryEnabled({
        scope: 'public',
        enabled: false,
        address: undefined,
        sessionReady: true,
        hasHydrated: true,
      }),
      false,
    )
  })

  it('wallet also requires address', async () => {
    const { chainQueryEnabled } = await loadModule('/src/core/wallet/chain-query-enabled.ts')

    assert.equal(
      chainQueryEnabled({
        scope: 'wallet',
        address: undefined,
        sessionReady: true,
        hasHydrated: true,
      }),
      false,
    )
    assert.equal(
      chainQueryEnabled({
        scope: 'wallet',
        address: '0xabc',
        sessionReady: true,
        hasHydrated: true,
      }),
      true,
    )
    assert.equal(
      chainQueryEnabled({
        scope: 'wallet',
        enabled: false,
        address: '0xabc',
        sessionReady: true,
        hasHydrated: true,
      }),
      false,
    )
  })
})

describe('isDappSessionPending', () => {
  it('is true until hydrate / restore / login settle', async () => {
    const { isDappSessionPending } = await loadModule('/src/core/wallet/chain-query-enabled.ts')

    assert.equal(
      isDappSessionPending({
        hasHydrated: false,
        isWalletConnecting: false,
        isLoggingIn: false,
      }),
      true,
    )
    assert.equal(
      isDappSessionPending({
        hasHydrated: true,
        isWalletConnecting: true,
        isLoggingIn: false,
      }),
      true,
    )
    assert.equal(
      isDappSessionPending({
        hasHydrated: true,
        isWalletConnecting: false,
        isLoggingIn: true,
      }),
      true,
    )
    assert.equal(
      isDappSessionPending({
        hasHydrated: true,
        isWalletConnecting: false,
        isLoggingIn: false,
      }),
      false,
    )
  })
})
