import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('applyGasBuffer adds 20% headroom', async () => {
  const { applyGasBuffer } = await loadModule('/src/views/dapp/web3/wallet-contract-write.ts')

  assert.equal(applyGasBuffer(100_000n), 120_000n)
  assert.equal(applyGasBuffer(21000n), 25200n)
})

test('applyGasBuffer rejects zero estimate', async () => {
  const { applyGasBuffer } = await loadModule('/src/views/dapp/web3/wallet-contract-write.ts')

  assert.throws(() => applyGasBuffer(0n), /WALLET_GAS_ESTIMATE_FAILED/)
})
