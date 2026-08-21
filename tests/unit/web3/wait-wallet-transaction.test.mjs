import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { loadModule } from '../load-module.mjs'

const HASH = `0x${'ab'.repeat(32)}`

describe('waitForWalletTransactionConfirmation', () => {
  it('returns a successful receipt from the public wait', async () => {
    const { waitForWalletTransactionConfirmation } = await loadModule(
      '/src/web3/wallet/wait-wallet-transaction.ts',
    )

    const receipt = {
      status: 'success',
      from: '0x1111111111111111111111111111111111111111',
    }
    const got = await waitForWalletTransactionConfirmation({
      hash: HASH,
      client: {
        waitForTransactionReceipt: async () => receipt,
      },
    })
    assert.equal(got, receipt)
  })

  it('throws failed when the receipt reverted', async () => {
    const { waitForWalletTransactionConfirmation, WalletTransactionWaitError } = await loadModule(
      '/src/web3/wallet/wait-wallet-transaction.ts',
    )

    await assert.rejects(
      () =>
        waitForWalletTransactionConfirmation({
          hash: HASH,
          client: {
            waitForTransactionReceipt: async () => ({
              status: 'reverted',
              from: '0x1111111111111111111111111111111111111111',
            }),
          },
        }),
      (error) => {
        assert.ok(error instanceof WalletTransactionWaitError)
        assert.equal(error.outcome, 'failed')
        return true
      },
    )
  })
})
