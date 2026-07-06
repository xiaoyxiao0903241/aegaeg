import assert from 'node:assert/strict'
import test from 'node:test'
import { encodeFunctionData, parseAbi, toFunctionSelector } from 'viem'
import { SWAP_ROUTER_V3_METHODS } from '../../src/views/dapp/web3/abis.ts'

const routerAbi = parseAbi([SWAP_ROUTER_V3_METHODS.exactInputSingle])

test('SWAP_ROUTER_V3 exactInputSingle matches Pancake on-chain selector', () => {
  assert.equal(
    toFunctionSelector(SWAP_ROUTER_V3_METHODS.exactInputSingle),
    '0x414bf389',
    'Pancake V3 SwapRouter expects deadline in ExactInputSingleParams',
  )

  const data = encodeFunctionData({
    abi: routerAbi,
    functionName: 'exactInputSingle',
    args: [
      {
        tokenIn: '0x55d398326f99059fF775485246999027B3197955',
        tokenOut: '0x8d0D000Ee44948FC98c9B98A4FA4921476f08B0d',
        fee: 100,
        recipient: '0x0000000000000000000000000000000000000001',
        deadline: 1_700_001_200n,
        amountIn: 10n ** 16n,
        amountOutMinimum: 1n,
        sqrtPriceLimitX96: 0n,
      },
    ],
  })

  assert.equal(data.slice(0, 10), '0x414bf389')
})
