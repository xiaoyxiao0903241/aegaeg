import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('flash pair helpers: redeem forward, wrap reverse, usdt forward-only', async () => {
  const { getFlashExchangePairTokens, flashPairAllowsFlip, FLASH_PAIR_DEFAULT } = await loadModule(
    '/src/views/dapp/exchange/exchange-pair.ts',
  )

  assert.equal(FLASH_PAIR_DEFAULT, 'gagx')
  const gagx = getFlashExchangePairTokens('gagx')
  assert.equal(gagx.sell.symbol, 'gAGX')
  assert.equal(gagx.buy.symbol, 'AGX')
  assert.equal(gagx.sell.decimals, 9)
  assert.equal(gagx.buy.decimals, 9)

  const wrap = getFlashExchangePairTokens('gagx', 'reverse')
  assert.equal(wrap.sell.symbol, 'AGX')
  assert.equal(wrap.buy.symbol, 'gAGX')

  const usdt = getFlashExchangePairTokens('usdt')
  assert.equal(usdt.sell.symbol, 'USDT')
  assert.equal(usdt.buy.symbol, 'USD1')
  assert.equal(flashPairAllowsFlip('gagx'), true)
  assert.equal(flashPairAllowsFlip('usdt'), false)
})

test('redeemable gAGX write ABI exposes redeem and wrap', async () => {
  const { REDEEMABLE_GAGX_METHODS } = await loadModule('/src/web3/abis.ts')
  assert.match(REDEEMABLE_GAGX_METHODS.redeem, /function redeem\(uint256/)
  assert.match(REDEEMABLE_GAGX_METHODS.wrap, /function wrap\(uint256/)
})

test('flash intros include wrap direction and dual-pair copy', async () => {
  const enModule = await loadModule('/src/i18n/messages/app/en.ts')
  const flash = enModule.default.exchange.flash

  assert.ok(flash.intros.gagx.toLowerCase().includes('gagx'))
  assert.ok(flash.intros.gagxWrap.toLowerCase().includes('wrap'))
  assert.ok(flash.intros.usdt.toUpperCase().includes('USDT'))
  assert.ok(flash.aboutTitle)
  assert.ok(flash.faq.items.length >= 5)
  assert.ok(flash.gates.paused)
  assert.equal(flash.intro, undefined)
  assert.equal(flash.tokenAboutTitle, undefined)
  assert.equal(flash.minReceived, undefined)
})
