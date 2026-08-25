import assert from 'node:assert/strict'
import test from 'node:test'

import { encodeFunctionData, parseAbi, toFunctionSelector } from 'viem'

import { LUCKY_POOL_METHODS } from '../../../src/web3/abis.ts'

test('LuckyPool getRewardInfo is address view returning accrued/claimed/pending', () => {
  assert.equal(toFunctionSelector(LUCKY_POOL_METHODS.getRewardInfo), '0x06032d74')
})

test('LuckyPool claimRewardMixed is the no-round 3-arg selector 0x61c80238', () => {
  assert.equal(toFunctionSelector(LUCKY_POOL_METHODS.claimRewardMixed), '0x61c80238')
  assert.doesNotMatch(LUCKY_POOL_METHODS.claimRewardMixed, /roundId/)

  const data = encodeFunctionData({
    abi: parseAbi([LUCKY_POOL_METHODS.claimRewardMixed]),
    functionName: 'claimRewardMixed',
    args: [0, 1n, 5000n],
  })
  assert.equal(data.slice(0, 10), '0x61c80238')
})
