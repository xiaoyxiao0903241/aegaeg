import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { loadModule } from './load-module.mjs'

describe('requireWriteSession', () => {
  it('fails closed without wallet or account', async () => {
    const { requireWriteSession, bindWriteSessionWallet } = await loadModule(
      '/src/web3/wallet/require-write-session.ts',
    )
    const { WALLET_GATE_ERROR } = await loadModule('/src/web3/errors/sentinels.ts')

    const unbind = bindWriteSessionWallet(() => undefined)
    try {
      assert.throws(
        () => requireWriteSession(),
        (err) => err === WALLET_GATE_ERROR.NOT_CONNECTED,
      )
      assert.throws(
        () => requireWriteSession(null),
        (err) => err === WALLET_GATE_ERROR.NOT_CONNECTED,
      )
      assert.throws(
        () => requireWriteSession({ getAccount: () => undefined }),
        (err) => err === WALLET_GATE_ERROR.NOT_CONNECTED,
      )
    } finally {
      unbind()
    }
  })

  it('zero-arg uses bound getter; explicit wallet overrides', async () => {
    const { requireWriteSession, bindWriteSessionWallet } = await loadModule(
      '/src/web3/wallet/require-write-session.ts',
    )
    const { WALLET_GATE_ERROR } = await loadModule('/src/web3/errors/sentinels.ts')

    const bound = {
      id: 'walletConnect',
      getAccount: () => ({ address: '0x1111111111111111111111111111111111111111' }),
    }
    const override = {
      id: 'walletConnect',
      getAccount: () => ({ address: '0x2222222222222222222222222222222222222222' }),
    }

    const unbind = bindWriteSessionWallet(() => bound)
    try {
      const session = requireWriteSession()
      assert.equal(session.wallet, bound)
      assert.equal(session.address, '0x1111111111111111111111111111111111111111')

      const overridden = requireWriteSession(override)
      assert.equal(overridden.wallet, override)
      assert.equal(overridden.address, '0x2222222222222222222222222222222222222222')
    } finally {
      unbind()
    }

    assert.throws(
      () => requireWriteSession(),
      (err) => err === WALLET_GATE_ERROR.NOT_CONNECTED,
    )
  })
})
