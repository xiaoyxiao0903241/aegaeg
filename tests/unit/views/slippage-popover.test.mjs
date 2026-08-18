import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('auto trade slippage is tighter for USD1 than AGX/X', async () => {
  const { autoTradeSlippagePercent } = await loadModule('/src/core/exchange/trade-path.ts')

  assert.equal(autoTradeSlippagePercent('usd1'), 0.3)
  assert.equal(autoTradeSlippagePercent('agx'), 2.5)
  assert.equal(autoTradeSlippagePercent('x'), 2.5)
})

test('anchored slippage popover flips and stays inside the viewport', async () => {
  const { clampAnchoredPopover } = await loadModule(
    '/src/views/dapp/exchange/market-trade/clamp-anchored-popover.ts',
  )

  const viewport = { left: 0, top: 0, width: 390, height: 700 }
  const below = clampAnchoredPopover({
    trigger: { top: 80, right: 370, bottom: 104 },
    panelWidth: 264,
    panelHeight: 220,
    gap: 8,
    padding: 8,
    viewport,
  })
  assert.equal(below.top, 112)
  assert.equal(below.left, 106)
  assert.equal(below.width, 264)

  const above = clampAnchoredPopover({
    trigger: { top: 620, right: 370, bottom: 644 },
    panelWidth: 264,
    panelHeight: 220,
    gap: 8,
    padding: 8,
    viewport,
  })
  assert.equal(above.top, 392)
  assert.ok(above.top + 220 <= 700 - 8)

  const narrow = clampAnchoredPopover({
    trigger: { top: 80, right: 240, bottom: 104 },
    panelWidth: 264,
    panelHeight: 400,
    gap: 8,
    padding: 8,
    viewport: { left: 0, top: 0, width: 250, height: 500 },
  })
  assert.equal(narrow.width, 234)
  assert.equal(narrow.left, 8)
  assert.equal(narrow.maxHeight, 484)
  assert.ok(narrow.left + narrow.width <= 242)
})
