import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('normalizeWalletRpcError flattens MetaMask provider errors', async () => {
  const { normalizeWalletRpcError } = await loadModule('/src/views/dapp/web3/wallet-write-error.ts')

  const normalized = normalizeWalletRpcError({
    code: -32603,
    message: 'Internal JSON-RPC error.',
    data: { message: 'execution reverted' },
  })

  assert.ok(normalized instanceof Error)
  assert.match(normalized.message, /execution reverted/i)
})
