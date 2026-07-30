import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('Segment pill thumb uses sliding transform contract (220ms cubic-bezier)', async () => {
  const {
    SEGMENT_MOTION_EASING,
    SEGMENT_MOTION_MS,
    SEGMENT_PILL_GAP_PX,
    SEGMENT_PILL_PAD_PX,
    segmentPillThumbStyle,
  } = await loadModule('/src/shared/ui/segment.tsx')

  assert.equal(SEGMENT_MOTION_MS, 220)
  assert.equal(SEGMENT_MOTION_EASING, 'cubic-bezier(0.22, 1, 0.36, 1)')
  assert.equal(SEGMENT_PILL_GAP_PX, 4)
  assert.equal(SEGMENT_PILL_PAD_PX, 4)

  const four = segmentPillThumbStyle(3, 4)
  assert.equal(four.left, '4px')
  assert.equal(four.width, 'calc((100% - 8px - 12px) / 4)')
  assert.equal(four.transform, 'translateX(calc(3 * (100% + 4px)))')
  assert.match(String(four.transition), /transform 220ms cubic-bezier\(0\.22, 1, 0\.36, 1\)/)

  const two = segmentPillThumbStyle(1, 2)
  assert.equal(two.width, 'calc((100% - 8px - 4px) / 2)')
  assert.equal(two.transform, 'translateX(calc(1 * (100% + 4px)))')
})

test('Segment source documents coral + ink active tones', async () => {
  const source = await import('node:fs/promises').then((fs) =>
    fs.readFile(new URL('../../src/shared/ui/segment.tsx', import.meta.url), 'utf8'),
  )
  assert.match(source, /tone\?: 'coral' \| 'ink'/)
  assert.match(source, /tone = 'coral'/)
  assert.match(source, /text-coral-emphasis/)
  assert.match(source, /font-semibold text-foreground/)
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
