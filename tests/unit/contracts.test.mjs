import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('BSC contract addresses match deployment snapshot', async () => {
  const { BSC_CONTRACTS } = await loadModule('/src/config/contracts.ts')

  assert.equal(BSC_CONTRACTS.chainId, 56)
  assert.equal(
    BSC_CONTRACTS.usd1.toLowerCase(),
    '0x32bb0be09f62bbe69764906d80e9a5782c7f7633',
  )
  assert.equal(
    BSC_CONTRACTS.xxToken.toLowerCase(),
    '0x558d83257cfb97a994acc25233fe741062f9acc2',
  )
  assert.equal(
    BSC_CONTRACTS.pancakeRouter.toLowerCase(),
    '0x10ed43c718714eb63d5aa57b78b54704e256024e',
  )
  assert.equal(
    BSC_CONTRACTS.pancakeV3SwapRouter.toLowerCase(),
    '0x13f4ea83d0bd40e75c8222255bc855a974568dd4',
  )
  assert.equal(
    BSC_CONTRACTS.pancakeV3Quoter.toLowerCase(),
    '0xb048bbc1ee6b733fffcfb9e9cef7375518e25997',
  )
  assert.equal(
    BSC_CONTRACTS.usdtUsd1Pool.toLowerCase(),
    '0x9c4ee895e4f6ce07ada631c508d1306db7502cce',
  )
  assert.equal(
    BSC_CONTRACTS.usd1Official.toLowerCase(),
    '0x8d0d000ee44948fc98c9b98a4fa4921476f08b0d',
  )
  assert.equal(
    BSC_CONTRACTS.usdt.toLowerCase(),
    '0x55d398326f99059ff775485246999027b3197955',
  )
  assert.equal(
    BSC_CONTRACTS.preSale.toLowerCase(),
    '0x4f86c19945cf64137ea31eeced5545e665b7a0f5',
  )
  assert.equal(
    BSC_CONTRACTS.referral.toLowerCase(),
    '0xe0f3ae113dd3997982ae9ad7d5510ffa4e3cce71',
  )
  assert.equal(
    BSC_CONTRACTS.rewardClaimer.toLowerCase(),
    '0x697b55fcfbc4cd5401f605ee4d9905816c127f07',
  )
  assert.equal(
    BSC_CONTRACTS.defaultReferrer.toLowerCase(),
    '0x74a4127e0aac45c8c23935707fe37889821029c3',
  )
})
