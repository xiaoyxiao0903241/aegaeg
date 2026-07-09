import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('breakpoint SSOT matches legacy-breakpoints / theme contract', async () => {
  const bp = await loadModule('/src/shared/config/breakpoints.ts')

  assert.equal(bp.BREAKPOINT_DAPP_PX, 821)
  assert.equal(bp.BREAKPOINT_DAPP_MAX_PX, 820)
  assert.equal(bp.BREAKPOINT_DESIGN_BASE_PX, 1920)
  assert.equal(bp.BREAKPOINT_TABLET_MAX_PX, 1100)
  assert.equal(bp.BREAKPOINT_NARROW_MAX_PX, 520)
  assert.ok(bp.BREAKPOINT_ULTRA_WIDE_SCALE.length >= 2)
  assert.equal(bp.MOBILE_MAX_WIDTH_QUERY, '(max-width: 820px)')
})
