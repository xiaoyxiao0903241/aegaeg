import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from './load-module.mjs'

test('onboarding persistence read/write', async () => {
  const { ONBOARDING_STORAGE_KEY, readOnboardingPersistence, writeOnboardingDone } =
    await loadModule('/src/app/onboarding/onboarding-persistence.ts')

  /** @type {Map<string, string>} */
  const map = new Map()
  const storage = {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value)
    },
  }

  assert.equal(ONBOARDING_STORAGE_KEY, 'aegis.onboarding.v1')
  assert.deepEqual(readOnboardingPersistence(storage), { done: false })

  writeOnboardingDone(true, storage)
  assert.deepEqual(readOnboardingPersistence(storage), { done: true })
  assert.equal(map.get(ONBOARDING_STORAGE_KEY), JSON.stringify({ done: true }))

  writeOnboardingDone(false, storage)
  assert.deepEqual(readOnboardingPersistence(storage), { done: false })

  map.set(ONBOARDING_STORAGE_KEY, '{not-json')
  assert.deepEqual(readOnboardingPersistence(storage), { done: false })
})

test('onboarding step ids are 12 and exclude genesis', async () => {
  const { ONBOARDING_STEP_COUNT, ONBOARDING_STEP_IDS, isOnboardingNavStep, tourSelector } =
    await loadModule('/src/app/onboarding/onboarding-step-ids.ts')

  assert.equal(ONBOARDING_STEP_COUNT, 12)
  assert.equal(ONBOARDING_STEP_IDS.length, 12)
  assert.equal(
    ONBOARDING_STEP_IDS.some((id) => String(id).includes('genesis')),
    false,
  )
  assert.equal(isOnboardingNavStep('nav-swap'), true)
  assert.equal(isOnboardingNavStep('swap-trade'), false)
  assert.equal(tourSelector('nav-community'), '[data-tour-id="nav-community"]')
})
