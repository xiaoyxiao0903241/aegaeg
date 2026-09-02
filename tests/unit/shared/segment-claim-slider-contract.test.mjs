import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('Segment pill thumb uses rem spacing tokens + sliding transform (220ms)', async () => {
  const { SEGMENT_MOTION_EASING, SEGMENT_MOTION_MS, segmentPillThumbStyle } = await loadModule(
    '/src/shared/components/segment.tsx',
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

test('claimSplitFromReleasePct keeps release + restake = 100', async () => {
  const { claimSplitFromReleasePct } = await loadModule('/src/core/assets/claim-plans.ts')

  assert.deepEqual(claimSplitFromReleasePct(50), { releasePct: 50, restakePct: 50 })
  assert.deepEqual(claimSplitFromReleasePct(0), { releasePct: 0, restakePct: 100 })
  assert.deepEqual(claimSplitFromReleasePct(100), { releasePct: 100, restakePct: 0 })
  assert.deepEqual(claimSplitFromReleasePct(67.4), { releasePct: 67, restakePct: 33 })
  assert.deepEqual(claimSplitFromReleasePct(-5), { releasePct: 0, restakePct: 100 })
  assert.deepEqual(claimSplitFromReleasePct(140), { releasePct: 100, restakePct: 0 })
})

test('claim split track and CTA gradient are left restake / right release', async () => {
  const { claimSplitTrackPct, claimSplitCtaBackgroundImage, claimSplitCtaStyle } = await loadModule(
    '/src/shared/components/claim-split-slider.tsx',
  )

  assert.deepEqual(claimSplitTrackPct(0), { releasePct: 0, restakePct: 100 })
  assert.deepEqual(claimSplitTrackPct(50), { releasePct: 50, restakePct: 50 })
  assert.deepEqual(claimSplitTrackPct(100), { releasePct: 100, restakePct: 0 })

  assert.equal(
    claimSplitCtaBackgroundImage(100),
    'linear-gradient(to right, var(--primary), var(--primary))',
  )
  assert.equal(
    claimSplitCtaBackgroundImage(0),
    'linear-gradient(to right, var(--claim), var(--claim))',
  )

  const mixed = claimSplitCtaBackgroundImage(40)
  assert.match(mixed, /^linear-gradient\(to right, var\(--claim\) 0%/)
  assert.match(mixed, / 60%, var\(--primary\) 100%\)$/)

  assert.equal(claimSplitCtaStyle(40, true).backgroundImage, mixed)
  assert.equal(claimSplitCtaStyle(40, false).backgroundImage, 'none')
})

test('claim split hint takes remaining width, wraps, and stays centered', () => {
  const src = readFileSync(
    new URL('../../../src/shared/components/claim-split-slider.tsx', import.meta.url),
    'utf8',
  )

  assert.match(src, /grid w-full max-w-108 min-w-0 gap-3/)
  assert.match(src, /flex w-full min-w-0 items-start gap-2/)
  assert.match(src, /flex-1 flex-wrap items-baseline justify-start/)
  assert.match(src, /flex-1 flex-wrap items-baseline justify-end/)
  assert.match(src, /className="min-w-0 flex-1 wrap-break-word"/)
  assert.match(src, /className="min-w-0 flex-1 text-right wrap-break-word"/)
  assert.match(src, /className="min-w-0 flex-1 px-1 text-center wrap-break-word"/)
  assert.doesNotMatch(src, /grid-cols-\[1fr_auto_1fr\]/)
  assert.doesNotMatch(src, /whitespace-nowrap/)
})
