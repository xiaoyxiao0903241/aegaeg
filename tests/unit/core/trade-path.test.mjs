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

test('pairAfterTokenSelect refuses buy-X and keeps adjacent sell-X', async () => {
  const { pairAfterTokenSelect, isValidTradePair, isValidDirectedTradePair, isSellOnlyTradeToken } =
    await loadModule('/src/core/exchange/trade-path.ts')

  assert.equal(isSellOnlyTradeToken('x'), true)
  assert.equal(isValidTradePair('x', 'agx'), true)
  assert.equal(isValidDirectedTradePair('x', 'agx'), true)
  assert.equal(isValidDirectedTradePair('agx', 'x'), false)
  assert.equal(isValidTradePair('usd1', 'x'), false)

  // 买侧点 X → 保持原对
  assert.deepEqual(pairAfterTokenSelect('buy', 'x', 'agx', 'usd1'), {
    sellKey: 'agx',
    buyKey: 'usd1',
  })

  // Sell=X 时买侧点同币本会翻转成买 X → 拒绝
  assert.deepEqual(pairAfterTokenSelect('buy', 'x', 'x', 'agx'), {
    sellKey: 'x',
    buyKey: 'agx',
  })

  // 上面 X、下面选 USD1 → 上面联动到 AGX
  assert.deepEqual(pairAfterTokenSelect('buy', 'usd1', 'x', 'agx'), {
    sellKey: 'agx',
    buyKey: 'usd1',
  })

  // 卖侧选 X → 对侧落到 AGX
  assert.deepEqual(pairAfterTokenSelect('sell', 'x', 'usd1', 'agx'), {
    sellKey: 'x',
    buyKey: 'agx',
  })
})

test('pairAfterFlip blocks when flip would buy X', async () => {
  const { pairAfterFlip, canFlipTradePair } = await loadModule('/src/core/exchange/trade-path.ts')

  assert.equal(canFlipTradePair('x', 'agx'), false)
  assert.deepEqual(pairAfterFlip('x', 'agx'), { sellKey: 'x', buyKey: 'agx' })

  assert.equal(canFlipTradePair('usd1', 'agx'), true)
  assert.deepEqual(pairAfterFlip('usd1', 'agx'), { sellKey: 'agx', buyKey: 'usd1' })
})
