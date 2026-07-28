import assert from 'node:assert/strict'
import test from 'node:test'
import { encodeFunctionData, parseAbi, toFunctionSelector } from 'viem'
import { PANCAKE_ROUTER_V2_METHODS } from '../../src/web3/abis.ts'

const routerAbi = parseAbi([PANCAKE_ROUTER_V2_METHODS.swapExactTokensForTokens])

test('PANCAKE_ROUTER_V2 swapExactTokensForTokens matches on-chain selector', () => {
  assert.equal(toFunctionSelector(PANCAKE_ROUTER_V2_METHODS.swapExactTokensForTokens), '0x38ed1739')

  const data = encodeFunctionData({
    abi: routerAbi,
    functionName: 'swapExactTokensForTokens',
    args: [
      10n ** 16n,
      1n,
      ['0x32Bb0be09F62bbE69764906d80e9A5782C7F7633', '0x8d0771495272bB97Cd1cD44795222c8fB1b53247'],
      '0x0000000000000000000000000000000000000001',
      1_700_001_200n,
    ],
  })

  assert.equal(data.slice(0, 10), '0x38ed1739')
})
