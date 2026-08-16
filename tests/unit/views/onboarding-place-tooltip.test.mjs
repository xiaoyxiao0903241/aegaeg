import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('placeOnboardingTooltip prefers right when it fits', async () => {
  const { placeOnboardingTooltip } = await loadModule(
    '/src/views/dapp/host/onboarding/place-onboarding-tooltip.ts',
  )

  const placed = placeOnboardingTooltip({
    target: { top: 100, left: 20, width: 67, height: 64 },
    tooltip: { width: 340, height: 143 },
    viewport: { width: 1280, height: 800 },
  })

  assert.equal(placed.side, 'right')
  assert.ok(placed.left >= 20 + 67)
  assert.ok(placed.left + 340 <= 1280 - 16)
  assert.ok(placed.top >= 16)
  assert.ok(placed.top + 143 <= 800 - 16)
})

test('placeOnboardingTooltip flips to left near right edge', async () => {
  const { placeOnboardingTooltip } = await loadModule(
    '/src/views/dapp/host/onboarding/place-onboarding-tooltip.ts',
  )

  const placed = placeOnboardingTooltip({
    target: { top: 200, left: 1100, width: 80, height: 64 },
    tooltip: { width: 340, height: 143 },
    viewport: { width: 1280, height: 800 },
  })

  assert.equal(placed.side, 'left')
  assert.ok(placed.left + 340 <= 1100)
  assert.ok(placed.left >= 16)
})

test('placeOnboardingTooltip clamps when no side fits cleanly', async () => {
  const { placeOnboardingTooltip } = await loadModule(
    '/src/views/dapp/host/onboarding/place-onboarding-tooltip.ts',
  )

  const placed = placeOnboardingTooltip({
    target: { top: 10, left: 10, width: 300, height: 400 },
    tooltip: { width: 320, height: 200 },
    viewport: { width: 360, height: 640 },
    margin: 16,
  })

  assert.ok(placed.left >= 16)
  assert.ok(placed.top >= 16)
  assert.ok(placed.left + 320 <= 360 - 16)
  assert.ok(placed.top + 200 <= 640 - 16)
})

test('placeOnboardingTooltip uses bottom when horizontal sides overflow', async () => {
  const { placeOnboardingTooltip } = await loadModule(
    '/src/views/dapp/host/onboarding/place-onboarding-tooltip.ts',
  )

  const placed = placeOnboardingTooltip({
    target: { top: 40, left: 40, width: 280, height: 60 },
    tooltip: { width: 300, height: 120 },
    viewport: { width: 360, height: 800 },
    preferredSides: ['right', 'left', 'bottom', 'top'],
  })

  assert.equal(placed.side, 'bottom')
  assert.ok(placed.top >= 40 + 60)
})
