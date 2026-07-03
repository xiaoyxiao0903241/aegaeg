import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('BSC contract addresses match deployment snapshot', async () => {
  const { BSC_CONTRACTS } = await loadModule('/src/config/contracts.ts')

  assert.equal(BSC_CONTRACTS.chainId, 56)
  assert.equal(
    BSC_CONTRACTS.usd1.toLowerCase(),
    '0x8d0d000ee44948fc98c9b98a4fa4921476f08b0d',
  )
  assert.equal(
    BSC_CONTRACTS.usdt.toLowerCase(),
    '0x55d398326f99059ff775485246999027b3197955',
  )
  assert.equal(
    BSC_CONTRACTS.pancakeV3SwapRouter.toLowerCase(),
    '0x1b81d678ffb9c0263b24a97847620c99d213eb14',
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
    BSC_CONTRACTS.preSale.toLowerCase(),
    '0xcb8ebebd2b4a03ab16a28021ad9ed50b125be618',
  )
  assert.equal(
    BSC_CONTRACTS.communityFundVault.toLowerCase(),
    '0xef11751f13ff5578c6fa1c6e9ef99bb917a4d5e6',
  )
  assert.equal(
    BSC_CONTRACTS.referral.toLowerCase(),
    '0xfe7803230d11bc6fb248f1629a3353e409a2db29',
  )
  assert.equal(
    BSC_CONTRACTS.rewardClaimer.toLowerCase(),
    '0xc6b3d73ba06594dc78be538f65307c6eb348e13e',
  )
  assert.equal(
    BSC_CONTRACTS.usd1Swap.toLowerCase(),
    '0xae1155cf325277acce615cc310dd52da8e46c6e3',
  )
})
