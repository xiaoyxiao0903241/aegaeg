import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

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

test('buyKeyAfterSellChange defaults X sell to AGX buy', async () => {
  const { buyKeyAfterSellChange } = await loadModule('/src/core/exchange/trade-path.ts')
  assert.equal(buyKeyAfterSellChange('x', 'x'), 'agx')
  assert.equal(buyKeyAfterSellChange('x', 'usd1'), 'usd1')
  assert.equal(buyKeyAfterSellChange('usd1', 'usd1'), 'agx')
})

test('isTradeTokenLive: handbook §7.1 USD1/AGX only', async () => {
  const { isTradeTokenLive, TRADE_LIVE_TOKEN_KEYS } = await loadModule(
    '/src/core/exchange/trade-path.ts',
  )
  assert.deepEqual([...TRADE_LIVE_TOKEN_KEYS], ['usd1', 'agx'])
  assert.equal(isTradeTokenLive('usd1'), true)
  assert.equal(isTradeTokenLive('agx'), true)
  assert.equal(isTradeTokenLive('x'), false)
})
