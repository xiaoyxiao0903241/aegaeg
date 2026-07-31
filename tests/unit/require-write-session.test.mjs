import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { loadModule } from './load-module.mjs'

describe('makeWriteSession', () => {
  it('fails closed without wallet or account', async () => {
    const { makeWriteSession } = await loadModule('/src/web3/wallet/require-write-session.ts')
    const { WALLET_BLOCKED } = await loadModule('/src/web3/errors/sentinels.ts')

    assert.throws(
      () => makeWriteSession(undefined),
      (err) => err === WALLET_BLOCKED.NOT_CONNECTED,
    )
    assert.throws(
      () => makeWriteSession(null),
      (err) => err === WALLET_BLOCKED.NOT_CONNECTED,
    )
    assert.throws(
      () => makeWriteSession({ getAccount: () => undefined }),
      (err) => err === WALLET_BLOCKED.NOT_CONNECTED,
    )
  })

  it('returns session from a wallet with an account', async () => {
    const { makeWriteSession } = await loadModule('/src/web3/wallet/require-write-session.ts')

    const wallet = {
      id: 'walletConnect',
      getAccount: () => ({ address: '0x1111111111111111111111111111111111111111' }),
    }

    const session = makeWriteSession(wallet)
    assert.equal(session.wallet, wallet)
    assert.equal(session.address, '0x1111111111111111111111111111111111111111')
  })
})
