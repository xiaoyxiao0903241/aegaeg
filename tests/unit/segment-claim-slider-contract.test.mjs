import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from './load-module.mjs'

test('Segment pill thumb uses rem spacing tokens + sliding transform (220ms)', async () => {
  const { SEGMENT_MOTION_EASING, SEGMENT_MOTION_MS, segmentPillThumbStyle } = await loadModule(
    '/src/shared/ui/segment.tsx',
  )

  assert.equal(SEGMENT_MOTION_MS, 220)
  assert.equal(SEGMENT_MOTION_EASING, 'cubic-bezier(0.22, 1, 0.36, 1)')

  const four = segmentPillThumbStyle(3, 4)
  assert.equal(four.left, '0.25rem')
  assert.equal(four.width, 'calc((100% - (0.25rem * 2) - (0.25rem * 3)) / 4)')
  assert.equal(four.transform, 'translateX(calc(3 * (100% + 0.25rem)))')
  assert.match(String(four.transition), /transform 220ms cubic-bezier\(0\.22, 1, 0\.36, 1\)/)

  const two = segmentPillThumbStyle(1, 2)
  assert.equal(two.width, 'calc((100% - (0.25rem * 2) - (0.25rem * 1)) / 2)')
  assert.equal(two.transform, 'translateX(calc(1 * (100% + 0.25rem)))')
})

test('Segment source documents coral + ink active tones and size sm|md|lg', async () => {
  const source = await import('node:fs/promises').then((fs) =>
    fs.readFile(new URL('../../src/shared/ui/segment.tsx', import.meta.url), 'utf8'),
  )
  assert.match(source, /tone\?: 'coral' \| 'ink'/)
  assert.match(source, /tone = 'coral'/)
  assert.match(source, /text-coral-emphasis/)
  assert.match(source, /font-semibold text-foreground/)
  assert.match(source, /export type SegmentSize = 'sm' \| 'md' \| 'lg'/)
  assert.match(source, /size = 'md'/)
  assert.match(source, /sm: 'h-6/)
  assert.match(source, /md: 'h-8/)
  assert.match(source, /lg: 'h-10/)
  assert.doesNotMatch(source, /SEGMENT_PILL_GAP_PX|SEGMENT_PILL_PAD_PX/)
  assert.match(source, /leftPct|widthPct/)
})

test('claimSplitFromReleasePct keeps release + restake = 100', async () => {
  const { claimSplitFromReleasePct } = await loadModule('/src/core/assets/claim-plans.ts')

  assert.deepEqual(claimSplitFromReleasePct(50), { releasePct: 50, restakePct: 50 })
  assert.deepEqual(claimSplitFromReleasePct(0), { releasePct: 0, restakePct: 100 })
  assert.deepEqual(claimSplitFromReleasePct(100), { releasePct: 100, restakePct: 0 })
  assert.deepEqual(claimSplitFromReleasePct(67.4), { releasePct: 67, restakePct: 33 })
  assert.deepEqual(claimSplitFromReleasePct(-5), { releasePct: 0, restakePct: 100 })
  assert.deepEqual(claimSplitFromReleasePct(140), { releasePct: 100, restakePct: 0 })
})
