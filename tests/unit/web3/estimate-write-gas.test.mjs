import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const CALL = {
  account: '0x1111111111111111111111111111111111111111',
  address: '0x2222222222222222222222222222222222222222',
  abi: [],
  functionName: 'exactInputSingle',
  args: [],
}

test('estimateWriteGasLimit uses estimateContractGas with 20% buffer after simulate succeeds', async () => {
  const { estimateWriteGasLimit } = await loadModule('/src/web3/wallet/wallet-contract-write.ts')

  const walletClient = {
    async simulateContract() {
      return { request: {} }
    },
    async estimateContractGas() {
      return 50_000n
    },
  }

  assert.equal(await estimateWriteGasLimit(CALL, walletClient), 60_000n)
})

test('estimateWriteGasLimit falls back to estimateContractGas after non-revert simulate failure', async () => {
  const { estimateWriteGasLimit } = await loadModule('/src/web3/wallet/wallet-contract-write.ts')

  const walletClient = {
    async simulateContract() {
      throw new Error('rpc timeout')
    },
    async estimateContractGas() {
      return 50_000n
    },
  }

  assert.equal(await estimateWriteGasLimit(CALL, walletClient), 60_000n)
})

test('estimateWriteGasLimit throws GAS_ESTIMATE_FAILED when all estimators fail non-revert', async () => {
  const { estimateWriteGasLimit } = await loadModule('/src/web3/wallet/wallet-contract-write.ts')

  const dead = {
    async simulateContract() {
      throw new Error('boom')
    },
    async estimateContractGas() {
      throw new Error('boom')
    },
  }

  await assert.rejects(() => estimateWriteGasLimit(CALL, dead, dead), /WALLET_GAS_ESTIMATE_FAILED/)
})
