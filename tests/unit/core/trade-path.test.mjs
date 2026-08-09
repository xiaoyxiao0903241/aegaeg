import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const ADDR = {
  usd1: '0x1111111111111111111111111111111111111111',
  agx: '0x2222222222222222222222222222222222222222',
  x: '0x3333333333333333333333333333333333333333',
}

test('tradePath covers six ordered trade pairs', async () => {
  const { tradePath } = await loadModule('/src/core/exchange/trade-path.ts')

  assert.deepEqual(tradePath('usd1', 'agx', ADDR), [ADDR.usd1, ADDR.agx])
  assert.deepEqual(tradePath('agx', 'usd1', ADDR), [ADDR.agx, ADDR.usd1])
  assert.deepEqual(tradePath('agx', 'x', ADDR), [ADDR.agx, ADDR.x])
  assert.deepEqual(tradePath('x', 'agx', ADDR), [ADDR.x, ADDR.agx])
  assert.deepEqual(tradePath('usd1', 'x', ADDR), [ADDR.usd1, ADDR.agx, ADDR.x])
  assert.deepEqual(tradePath('x', 'usd1', ADDR), [ADDR.x, ADDR.agx, ADDR.usd1])
})

test('tradePath rejects same-token pair', async () => {
  const { tradePath } = await loadModule('/src/core/exchange/trade-path.ts')
  assert.throws(() => tradePath('usd1', 'usd1', ADDR), /TRADE_PATH_SAME_TOKEN/)
})

test('pairAfterTokenSelect: flip same token, fix non-adjacent', async () => {
  const { pairAfterTokenSelect, isValidTradePair } = await loadModule(
    '/src/core/exchange/trade-path.ts',
  )

  assert.equal(isValidTradePair('x', 'agx'), true)
  assert.equal(isValidTradePair('usd1', 'x'), false)

  // 下面点到与上面同币 → 翻转
  assert.deepEqual(pairAfterTokenSelect('buy', 'x', 'x', 'agx'), {
    sellKey: 'agx',
    buyKey: 'x',
  })

  // 上面 X、下面选 USD1 → 上面联动到 AGX
  assert.deepEqual(pairAfterTokenSelect('buy', 'usd1', 'x', 'agx'), {
    sellKey: 'agx',
    buyKey: 'usd1',
  })

  // 相邻则只改本侧
  assert.deepEqual(pairAfterTokenSelect('sell', 'x', 'usd1', 'agx'), {
    sellKey: 'x',
    buyKey: 'agx',
  })
})
