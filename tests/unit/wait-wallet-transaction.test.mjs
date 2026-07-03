import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { loadModule } from './load-module.mjs'

describe('waitForWalletTransactionConfirmation', () => {
  it('fails fast when hash never appears on any RPC', async () => {
    const { waitForWalletTransactionConfirmation, WalletTransactionWaitError } = await loadModule(
      '/src/web3/wait-wallet-transaction.ts',
    )

    const hash = `0x${'ab'.repeat(32)}`
    const provider = {
      request: async ({ method }) => {
        if (method === 'eth_getTransactionReceipt') return null
        if (method === 'eth_getTransactionByHash') return null
        return null
      },
    }

    const started = Date.now()
    await assert.rejects(
      () =>
        waitForWalletTransactionConfirmation({
          provider,
          hash,
        }),
      (error) => {
        assert.ok(error instanceof WalletTransactionWaitError)
        assert.match(error.message, /not broadcast/i)
        return true
      },
    )
    assert.ok(Date.now() - started < 12_000)
  })

  it('fails fast when wallet RPC shows pending without a receipt', async () => {
    const { waitForWalletTransactionConfirmation, WalletTransactionWaitError } = await loadModule(
      '/src/web3/wait-wallet-transaction.ts',
    )

    const hash = `0x${'cd'.repeat(32)}`
    const provider = {
      request: async ({ method }) => {
        if (method === 'eth_getTransactionReceipt') return null
        if (method === 'eth_getTransactionByHash') {
          return { hash, blockNumber: null }
        }
        return null
      },
    }

    const started = Date.now()
    await assert.rejects(
      () =>
        waitForWalletTransactionConfirmation({
          provider,
          hash,
        }),
      (error) => {
        assert.ok(error instanceof WalletTransactionWaitError)
        assert.match(error.message, /pending without confirmation/i)
        return true
      },
    )
    assert.ok(Date.now() - started < 25_000)
  })
})
