import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const ADDR = {
  usd1: '0x1111111111111111111111111111111111111111',
  agx: '0x2222222222222222222222222222222222222222',
  x: '0x3333333333333333333333333333333333333333',
}

test('tradePath covers directed sell paths including X sell-only', async () => {
  const { tradePath } = await loadModule('/src/core/exchange/trade-path.ts')

  assert.deepEqual(tradePath('usd1', 'agx', ADDR), [ADDR.usd1, ADDR.agx])
  assert.deepEqual(tradePath('agx', 'usd1', ADDR), [ADDR.agx, ADDR.usd1])
  assert.deepEqual(tradePath('x', 'agx', ADDR), [ADDR.x, ADDR.agx])
  assert.deepEqual(tradePath('x', 'usd1', ADDR), [ADDR.x, ADDR.agx, ADDR.usd1])
})

test('tradePath rejects same-token and buy-X pairs', async () => {
  const { tradePath } = await loadModule('/src/core/exchange/trade-path.ts')
  assert.throws(() => tradePath('usd1', 'usd1', ADDR), /TRADE_PATH_SAME_TOKEN/)
  assert.throws(() => tradePath('agx', 'x', ADDR), /TRADE_PATH_BUY_NOT_ALLOWED/)
  assert.throws(() => tradePath('usd1', 'x', ADDR), /TRADE_PATH_BUY_NOT_ALLOWED/)
})

test('directed trade pairs: USD1↔AGX, X→AGX/USD1, never buy X', async () => {
  const { buyKeysForSell, isSellOnlyTradeToken, isValidDirectedTradePair, pairAfterTokenSelect } =
    await loadModule('/src/core/exchange/trade-path.ts')

  assert.deepEqual(buyKeysForSell('usd1'), ['agx'])
  assert.deepEqual(buyKeysForSell('agx'), ['usd1'])
  assert.deepEqual(buyKeysForSell('x'), ['usd1', 'agx'])

  assert.equal(isSellOnlyTradeToken('x'), true)
  assert.equal(isValidDirectedTradePair('usd1', 'agx'), true)
  assert.equal(isValidDirectedTradePair('agx', 'usd1'), true)
  assert.equal(isValidDirectedTradePair('x', 'agx'), true)
  assert.equal(isValidDirectedTradePair('x', 'usd1'), true)
  assert.equal(isValidDirectedTradePair('agx', 'x'), false)
  assert.equal(isValidDirectedTradePair('usd1', 'x'), false)

  assert.deepEqual(pairAfterTokenSelect('buy', 'x', 'agx', 'usd1'), {
    sellKey: 'agx',
    buyKey: 'usd1',
  })
  assert.deepEqual(pairAfterTokenSelect('buy', 'x', 'x', 'agx'), {
    sellKey: 'x',
    buyKey: 'agx',
  })
  assert.deepEqual(pairAfterTokenSelect('buy', 'usd1', 'x', 'agx'), {
    sellKey: 'x',
    buyKey: 'usd1',
  })
  assert.deepEqual(pairAfterTokenSelect('sell', 'x', 'usd1', 'agx'), {
    sellKey: 'x',
    buyKey: 'usd1',
  })
  assert.deepEqual(pairAfterTokenSelect('sell', 'usd1', 'x', 'usd1'), {
    sellKey: 'usd1',
    buyKey: 'agx',
  })
  assert.deepEqual(pairAfterTokenSelect('sell', 'agx', 'x', 'usd1'), {
    sellKey: 'agx',
    buyKey: 'usd1',
  })
})

test('pairAfterFlip blocks when flip would buy X', async () => {
  const { pairAfterFlip, canFlipTradePair } = await loadModule('/src/core/exchange/trade-path.ts')

  assert.equal(canFlipTradePair('x', 'agx'), false)
  assert.equal(canFlipTradePair('x', 'usd1'), false)
  assert.deepEqual(pairAfterFlip('x', 'agx'), { sellKey: 'x', buyKey: 'agx' })
  assert.deepEqual(pairAfterFlip('x', 'usd1'), { sellKey: 'x', buyKey: 'usd1' })

  assert.equal(canFlipTradePair('usd1', 'agx'), true)
  assert.deepEqual(pairAfterFlip('usd1', 'agx'), { sellKey: 'agx', buyKey: 'usd1' })
})
