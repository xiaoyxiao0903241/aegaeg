import assert from 'node:assert/strict'
import test from 'node:test'

import { encodeErrorResult, parseAbi } from 'viem'

import { loadModule } from '../load-module.mjs'

const ACCOUNT = '0x1111111111111111111111111111111111111111'
const GAS_PRICE = 5_000_000_000n
/** 一跳普通兑换：150_000 典型 gas × 20% 缓冲。 */
const ONE_HOP_BUFFERED_GAS = 180_000n
/** 一跳卖 AGX：150_000 + 40_000 费率转移附加 × 20% 缓冲。 */
const ONE_HOP_FOT_BUFFERED_GAS = 228_000n

const erc20ErrorsAbi = parseAbi([
  'error ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed)',
])

function allowanceRevert() {
  return {
    data: encodeErrorResult({
      abi: erc20ErrorsAbi,
      errorName: 'ERC20InsufficientAllowance',
      args: [ACCOUNT, 0n, 10n ** 18n],
    }),
    message: 'ERC20InsufficientAllowance',
  }
}

test('estimateMarketSwapGasWei multiplies buffered gas by gas price', async () => {
  const { estimateMarketSwapGasWei } = await loadModule(
    '/src/web3/exchange/estimate-market-swap-gas.ts',
  )
  const { BSC_CONTRACTS } = await loadModule('/src/shared/config/contracts.ts')

  const client = {
    async simulateContract() {
      return { request: {} }
    },
    async estimateContractGas() {
      return 100_000n
    },
    async getGasPrice() {
      return 5_000_000_000n
    },
  }

  const wei = await estimateMarketSwapGasWei({
    account: ACCOUNT,
    amountIn: 10n ** 18n,
    path: [BSC_CONTRACTS.usd1, BSC_CONTRACTS.agx],
    amountOutMin: 1n,
    client,
    fallbackClient: client,
  })

  assert.equal(wei, 120_000n * 5_000_000_000n)
})

test('estimateMarketSwapGasWei returns null on estimate failure without throwing', async () => {
  const { estimateMarketSwapGasWei } = await loadModule(
    '/src/web3/exchange/estimate-market-swap-gas.ts',
  )
  const { BSC_CONTRACTS } = await loadModule('/src/shared/config/contracts.ts')

  const dead = {
    async simulateContract() {
      throw new Error('boom')
    },
    async estimateContractGas() {
      throw new Error('boom')
    },
    async getGasPrice() {
      return 5_000_000_000n
    },
  }

  const wei = await estimateMarketSwapGasWei({
    account: ACCOUNT,
    amountIn: 10n ** 18n,
    path: [BSC_CONTRACTS.usd1, BSC_CONTRACTS.agx],
    amountOutMin: 1n,
    client: dead,
    fallbackClient: dead,
  })

  assert.equal(wei, null)
})

test('isAllowanceOrBalanceSwapRevert matches allowance and pancake transferFrom wraps', async () => {
  const { isAllowanceOrBalanceSwapRevert } = await loadModule(
    '/src/web3/exchange/estimate-market-swap-gas.ts',
  )

  assert.equal(isAllowanceOrBalanceSwapRevert(allowanceRevert()), true)
  assert.equal(
    isAllowanceOrBalanceSwapRevert({
      data: '0x12345678',
      message: 'TransferHelper: TRANSFER_FROM_FAILED',
    }),
    true,
  )
  assert.equal(isAllowanceOrBalanceSwapRevert(new Error('INSUFFICIENT_OUTPUT_AMOUNT')), false)
  assert.equal(isAllowanceOrBalanceSwapRevert(new Error('boom')), false)
})

test('typicalMarketSwapGasLimit scales by hops and fee-on-transfer', async () => {
  const { typicalMarketSwapGasLimit } = await loadModule(
    '/src/web3/exchange/estimate-market-swap-gas.ts',
  )
  const { BSC_CONTRACTS } = await loadModule('/src/shared/config/contracts.ts')

  assert.equal(typicalMarketSwapGasLimit([BSC_CONTRACTS.usd1, BSC_CONTRACTS.agx]), 150_000n)
  assert.equal(typicalMarketSwapGasLimit([BSC_CONTRACTS.agx, BSC_CONTRACTS.usd1]), 190_000n)
  assert.equal(
    typicalMarketSwapGasLimit([BSC_CONTRACTS.usd1, BSC_CONTRACTS.agx, BSC_CONTRACTS.xToken]),
    300_000n,
  )
})

test('estimateMarketSwapGasWei skips user simulate when allowance is below amountIn', async () => {
  const { estimateMarketSwapGasWei } = await loadModule(
    '/src/web3/exchange/estimate-market-swap-gas.ts',
  )
  const { BSC_CONTRACTS } = await loadModule('/src/shared/config/contracts.ts')

  const client = {
    async simulateContract() {
      throw new Error('should not simulate when allowance is insufficient')
    },
    async estimateContractGas() {
      throw new Error('should not estimate when allowance is insufficient')
    },
    async getGasPrice() {
      return GAS_PRICE
    },
  }

  const wei = await estimateMarketSwapGasWei({
    account: ACCOUNT,
    amountIn: 10n ** 18n,
    path: [BSC_CONTRACTS.usd1, BSC_CONTRACTS.agx],
    amountOutMin: 1n,
    allowance: 0n,
    client,
    fallbackClient: client,
  })

  assert.equal(wei, ONE_HOP_BUFFERED_GAS * GAS_PRICE)
})

test('estimateMarketSwapGasWei falls back when simulate reverts on allowance', async () => {
  const { estimateMarketSwapGasWei } = await loadModule(
    '/src/web3/exchange/estimate-market-swap-gas.ts',
  )
  const { BSC_CONTRACTS } = await loadModule('/src/shared/config/contracts.ts')

  const revert = allowanceRevert()
  const client = {
    async simulateContract() {
      throw revert
    },
    async estimateContractGas() {
      throw revert
    },
    async getGasPrice() {
      return GAS_PRICE
    },
  }

  const usd1Wei = await estimateMarketSwapGasWei({
    account: ACCOUNT,
    amountIn: 10n ** 18n,
    path: [BSC_CONTRACTS.usd1, BSC_CONTRACTS.agx],
    amountOutMin: 1n,
    client,
    fallbackClient: client,
  })
  const agxWei = await estimateMarketSwapGasWei({
    account: ACCOUNT,
    amountIn: 10n ** 18n,
    path: [BSC_CONTRACTS.agx, BSC_CONTRACTS.usd1],
    amountOutMin: 1n,
    client,
    fallbackClient: client,
  })

  assert.equal(usd1Wei, ONE_HOP_BUFFERED_GAS * GAS_PRICE)
  assert.equal(agxWei, ONE_HOP_FOT_BUFFERED_GAS * GAS_PRICE)
})

test('marketSwapWriteCall uses fee-on-transfer swap when selling AGX', async () => {
  const { marketSwapWriteCall } = await loadModule('/src/web3/exchange/exchange-write.ts')
  const { BSC_CONTRACTS } = await loadModule('/src/shared/config/contracts.ts')

  const usd1Call = marketSwapWriteCall({
    amountIn: 1n,
    path: [BSC_CONTRACTS.usd1, BSC_CONTRACTS.agx],
    amountOutMin: 1n,
    recipient: ACCOUNT,
    nowSeconds: 1_700_000_000,
  })
  const agxCall = marketSwapWriteCall({
    amountIn: 1n,
    path: [BSC_CONTRACTS.agx, BSC_CONTRACTS.usd1],
    amountOutMin: 1n,
    recipient: ACCOUNT,
    nowSeconds: 1_700_000_000,
  })

  assert.equal(usd1Call.functionName, 'swapExactTokensForTokens')
  assert.equal(agxCall.functionName, 'swapExactTokensForTokensSupportingFeeOnTransferTokens')
  assert.deepEqual(usd1Call.args[2], [BSC_CONTRACTS.usd1, BSC_CONTRACTS.agx])
  assert.equal(usd1Call.args[3].toLowerCase(), ACCOUNT)
})
