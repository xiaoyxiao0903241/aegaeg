import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

const ADDR = {
  usd1: '0x1111111111111111111111111111111111111111',
  agx: '0x2222222222222222222222222222222222222222',
  x: '0x3333333333333333333333333333333333333333',
}

test('resolveTradePath covers six ordered trade pairs', async () => {
  const { resolveTradePath } = await loadModule('/src/core/exchange/resolve-trade-path.ts')

  assert.deepEqual(resolveTradePath('usd1', 'agx', ADDR), [ADDR.usd1, ADDR.agx])
  assert.deepEqual(resolveTradePath('agx', 'usd1', ADDR), [ADDR.agx, ADDR.usd1])
  assert.deepEqual(resolveTradePath('agx', 'x', ADDR), [ADDR.agx, ADDR.x])
  assert.deepEqual(resolveTradePath('x', 'agx', ADDR), [ADDR.x, ADDR.agx])
  assert.deepEqual(resolveTradePath('usd1', 'x', ADDR), [ADDR.usd1, ADDR.agx, ADDR.x])
  assert.deepEqual(resolveTradePath('x', 'usd1', ADDR), [ADDR.x, ADDR.agx, ADDR.usd1])
})

test('resolveTradePath rejects same-token pair', async () => {
  const { resolveTradePath } = await loadModule('/src/core/exchange/resolve-trade-path.ts')
  assert.throws(() => resolveTradePath('usd1', 'usd1', ADDR), /TRADE_PATH_SAME_TOKEN/)
})

test('resolveBuyKeyAfterSellChange defaults X sell to AGX buy', async () => {
  const { resolveBuyKeyAfterSellChange } = await loadModule(
    '/src/core/exchange/resolve-trade-path.ts',
  )
  assert.equal(resolveBuyKeyAfterSellChange('x', 'x'), 'agx')
  assert.equal(resolveBuyKeyAfterSellChange('x', 'usd1'), 'usd1')
  assert.equal(resolveBuyKeyAfterSellChange('usd1', 'usd1'), 'agx')
})
