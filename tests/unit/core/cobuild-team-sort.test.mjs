import assert from 'node:assert/strict'
import test from 'node:test'

import {
  COBUILD_TEAM_COLUMN_SORT,
  cobuildTeamSortToParams,
  DEFAULT_COBUILD_TEAM_SORT,
  toggleCobuildTeamSort,
} from '../../../src/core/rewards/cobuild-team-sort.ts'

test('default is bound_at desc', () => {
  assert.deepEqual(DEFAULT_COBUILD_TEAM_SORT, { column: 'bound_at', dir: 'desc' })
  assert.deepEqual(cobuildTeamSortToParams(DEFAULT_COBUILD_TEAM_SORT), {
    sort_bound_at: 'desc',
  })
})

test('teamColumns index map: address is not sortable', () => {
  assert.deepEqual(COBUILD_TEAM_COLUMN_SORT, ['bound_at', null, 'making_market', 'making_rank'])
})

test('toggle same column flips desc ↔ asc', () => {
  const asc = toggleCobuildTeamSort(DEFAULT_COBUILD_TEAM_SORT, 'bound_at')
  assert.deepEqual(asc, { column: 'bound_at', dir: 'asc' })
  assert.deepEqual(toggleCobuildTeamSort(asc, 'bound_at'), { column: 'bound_at', dir: 'desc' })
})

test('toggle other column switches to that column desc', () => {
  const next = toggleCobuildTeamSort(DEFAULT_COBUILD_TEAM_SORT, 'making_market')
  assert.deepEqual(next, { column: 'making_market', dir: 'desc' })
  assert.deepEqual(cobuildTeamSortToParams(next), { sort_making_market: 'desc' })
})

test('params expose only the active sort key', () => {
  assert.deepEqual(cobuildTeamSortToParams({ column: 'making_rank', dir: 'asc' }), {
    sort_making_rank: 'asc',
  })
})
