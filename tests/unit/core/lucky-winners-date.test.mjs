import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('luckyWinnersSelectedDate: user pick wins; else response date; empty stays empty', async () => {
  const { luckyWinnersSelectedDate } = await loadModule('/src/core/rewards/lucky-winners-date.ts')

  assert.equal(luckyWinnersSelectedDate(null, '2026-08-19'), '2026-08-19')
  assert.equal(luckyWinnersSelectedDate(' 2026-08-18 ', '2026-08-19'), '2026-08-18')
  assert.equal(luckyWinnersSelectedDate(null, null), '')
  assert.equal(luckyWinnersSelectedDate('', ' 2026-08-19 '), '2026-08-19')
})

test('luckyWinnersDateList: dates from API; invalid skipped; fallback prepended if missing', async () => {
  const { luckyWinnersDateList } = await loadModule('/src/core/rewards/lucky-winners-date.ts')

  assert.deepEqual(luckyWinnersDateList(['2026-08-19', '2026-08-18']), ['2026-08-19', '2026-08-18'])
  assert.deepEqual(luckyWinnersDateList(['2026-08-19', 'nope', '2026-08-19']), ['2026-08-19'])
  assert.deepEqual(luckyWinnersDateList(['2026-08-18'], '2026-08-19'), ['2026-08-19', '2026-08-18'])
  assert.deepEqual(luckyWinnersDateList(null, '2026-08-19'), ['2026-08-19'])
  assert.deepEqual(luckyWinnersDateList(undefined), [])
})

test('lucky winners default query omits date; dropdown uses response dates', () => {
  const hook = readFileSync(
    new URL('../../../src/views/dapp/rewards/lucky/use-lucky.tsx', import.meta.url),
    'utf8',
  )
  const endpoint = readFileSync(
    new URL('../../../src/shared/api/endpoints/rewards.ts', import.meta.url),
    'utf8',
  )
  assert.match(hook, /luckyWinnersSelectedDate/)
  assert.match(hook, /luckyWinnersDateList/)
  assert.doesNotMatch(hook, /DRAW_DATE_OPTION_COUNT/)
  assert.doesNotMatch(hook, /buildRecentDrawDateOptions/)
  assert.match(endpoint, /body: day \? \{ date: day \} : \{\}/)
})
