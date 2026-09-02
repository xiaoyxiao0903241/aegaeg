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

test('luckyWinnersDateList: dates from API only; invalid skipped; no invented fallback', async () => {
  const { luckyWinnersDateList } = await loadModule('/src/core/rewards/lucky-winners-date.ts')

  assert.deepEqual(luckyWinnersDateList(['2026-08-19', '2026-08-18']), ['2026-08-19', '2026-08-18'])
  assert.deepEqual(luckyWinnersDateList(['2026-08-19', 'nope', '2026-08-19']), ['2026-08-19'])
  assert.deepEqual(luckyWinnersDateList(['2026-02-31']), [])
  assert.deepEqual(luckyWinnersDateList(null), [])
  assert.deepEqual(luckyWinnersDateList(undefined), [])
})

test('parseIsoDay / formatIsoDay: local calendar day; invalid rejected', async () => {
  const { formatIsoDay, parseIsoDay } = await loadModule('/src/core/rewards/lucky-winners-date.ts')

  const parsed = parseIsoDay('2026-08-19')
  assert.ok(parsed instanceof Date)
  assert.equal(parsed.getFullYear(), 2026)
  assert.equal(parsed.getMonth(), 7)
  assert.equal(parsed.getDate(), 19)
  assert.equal(formatIsoDay(parsed), '2026-08-19')
  assert.equal(formatIsoDay(parseIsoDay(' 2026-08-19 ')), '2026-08-19')
  assert.equal(parseIsoDay('2026-13-01'), undefined)
  assert.equal(parseIsoDay('2026-02-31'), undefined)
  assert.equal(parseIsoDay('nope'), undefined)
  assert.equal(parseIsoDay(''), undefined)
  assert.equal(parseIsoDay(null), undefined)
})

test('isLuckyWinnersDateAllowed: only ISO days in the backend set', async () => {
  const { isLuckyWinnersDateAllowed } = await loadModule('/src/core/rewards/lucky-winners-date.ts')
  const allowed = new Set(['2026-08-19'])

  assert.equal(isLuckyWinnersDateAllowed(new Date(2026, 7, 19), allowed), true)
  assert.equal(isLuckyWinnersDateAllowed(new Date(2026, 7, 18), allowed), false)
})

test('luckyWinnersCalendarBounds: min/max month from API dates', async () => {
  const { luckyWinnersCalendarBounds } = await loadModule('/src/core/rewards/lucky-winners-date.ts')

  assert.deepEqual(luckyWinnersCalendarBounds([]), { startMonth: undefined, endMonth: undefined })
  const span = luckyWinnersCalendarBounds(['2026-08-19', 'nope', '2026-06-02'])
  assert.equal(span.startMonth?.getFullYear(), 2026)
  assert.equal(span.startMonth?.getMonth(), 5)
  assert.equal(span.startMonth?.getDate(), 1)
  assert.equal(span.endMonth?.getFullYear(), 2026)
  assert.equal(span.endMonth?.getMonth(), 7)
  assert.equal(span.endMonth?.getDate(), 1)
})

test('lucky winners default query omits date; picker uses response dates', () => {
  const hook = readFileSync(
    new URL('../../../src/views/dapp/rewards/lucky/use-lucky.tsx', import.meta.url),
    'utf8',
  )
  const detail = readFileSync(
    new URL('../../../src/views/dapp/rewards/lucky/detail.tsx', import.meta.url),
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
  assert.doesNotMatch(hook, /SelectMenuOption/)
  assert.match(detail, /LuckyDrawDatePicker/)
  assert.doesNotMatch(detail, /SelectMenu/)
  assert.match(endpoint, /body: day \? \{ date: day \} : \{\}/)
})
