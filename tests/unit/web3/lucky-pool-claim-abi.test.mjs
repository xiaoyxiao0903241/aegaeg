import assert from 'node:assert/strict'
import test from 'node:test'

import { encodeFunctionData, keccak256, parseAbi, toBytes, toFunctionSelector } from 'viem'

import { LUCKY_POOL_ERRORS, LUCKY_POOL_METHODS } from '../../../src/web3/abis.ts'

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

test('LuckyPool errors include ErrorNoUnclaimedReward; drop per-round claim errors', () => {
  assert.ok(LUCKY_POOL_ERRORS.includes('error ErrorNoUnclaimedReward(address user)'))
  assert.equal(keccak256(toBytes('ErrorNoUnclaimedReward(address)')).slice(0, 10), '0x60aea18d')
  assert.equal(
    LUCKY_POOL_ERRORS.some(
      (e) => e.includes('ErrorNotWinner') || e.includes('ErrorRewardAlreadyClaimed'),
    ),
    false,
  )
})
