import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('burn overview burned AGX uses agx-contribution summary, not chain userAgxBurned', () => {
  const src = readFileSync(
    new URL('../../../src/views/dapp/exchange/burn/detail.tsx', import.meta.url),
    'utf8',
  )
  assert.match(src, /useAgxContributionSummary/)
  assert.match(src, /total_burned_agx/)
  assert.doesNotMatch(src, /userStats\?\.agxBurned/)
})
