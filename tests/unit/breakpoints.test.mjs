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
  assert.equal(bp.BREAKPOINT_FLUID_MIN_WIDTH_PX, 1920)
  assert.equal(bp.BREAKPOINT_FLUID_MAX_WIDTH_PX, 3840)
  assert.equal(bp.BREAKPOINT_FLUID_MIN_ROOT_PX, 16)
  assert.equal(bp.BREAKPOINT_FLUID_MAX_ROOT_PX, 48)
  assert.equal(bp.BREAKPOINT_FLUID_MAX_SCALE, 3)
  assert.equal(bp.BREAKPOINT_ULTRA_WIDE_SCALE.length, 2)
  assert.equal(bp.BREAKPOINT_ULTRA_WIDE_SCALE[0].minWidthPx, 1920)
  assert.equal(bp.BREAKPOINT_ULTRA_WIDE_SCALE[0].rootFontSizePx, 16)
  assert.equal(bp.BREAKPOINT_ULTRA_WIDE_SCALE[1].minWidthPx, 3840)
  assert.equal(bp.BREAKPOINT_ULTRA_WIDE_SCALE[1].rootFontSizePx, 48)
  assert.equal(bp.MOBILE_MAX_WIDTH_QUERY, '(max-width: 820px)')
})

test('generated theme.css site-fluid is continuous clamp (not stepped media)', async () => {
  const { readFile } = await import('node:fs/promises')
  const { fileURLToPath } = await import('node:url')
  const themePath = fileURLToPath(
    new URL('../../src/shared/styles/tokens/theme.css', import.meta.url),
  )
  const css = await readFile(themePath, 'utf8')
  assert.match(css, /html\.site-fluid\s*\{/)
  assert.match(css, /font-size:\s*clamp\(16px/)
  assert.match(css, /--fluid-scale:\s*clamp\(1/)
  assert.doesNotMatch(css, /@media \(min-width: 2080px\)/)
})

test('generated theme.css exposes DApp motion tokens', async () => {
  const { readFile } = await import('node:fs/promises')
  const { fileURLToPath } = await import('node:url')
  const themePath = fileURLToPath(
    new URL('../../src/shared/styles/tokens/theme.css', import.meta.url),
  )
  const css = await readFile(themePath, 'utf8')
  assert.match(css, /--motion-dapp-fast:\s*120ms/)
  assert.match(css, /--motion-dapp-base:\s*220ms/)
  assert.match(css, /--motion-dapp-emphasis:\s*300ms/)
  assert.match(css, /--motion-dapp-ease:\s*cubic-bezier\(0\.22, 1, 0\.36, 1\)/)
  assert.match(css, /--motion-dapp-rise:\s*6px/)
  assert.match(css, /--motion-dapp-slide:\s*1\.5rem/)
  assert.match(css, /--motion-dapp-fade-out:\s*160ms/)
  assert.match(css, /--motion-dapp-fade-in:\s*220ms/)
  assert.match(css, /--duration-dapp-base:\s*var\(--motion-dapp-base\)/)
  assert.match(css, /--ease-dapp:\s*var\(--motion-dapp-ease\)/)
})
