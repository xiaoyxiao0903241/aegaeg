import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('isGenesisProgramEnded: loading / active / upcoming / ended', async () => {
  const { isGenesisProgramEnded } = await loadModule(
    '/src/core/presale/is-genesis-program-ended.ts',
  )

  assert.equal(
    isGenesisProgramEnded({
      isLoading: true,
      activePhase: null,
      seasonOptions: [{ status: 'Ended' }],
    }),
    false,
  )
  assert.equal(
    isGenesisProgramEnded({
      isLoading: false,
      activePhase: { index: 0 },
      seasonOptions: [{ status: 'LIVE' }],
    }),
    false,
  )
  assert.equal(
    isGenesisProgramEnded({
      isLoading: false,
      activePhase: null,
      seasonOptions: [{ status: 'Ended' }, { status: 'Upcoming' }],
    }),
    false,
  )
  assert.equal(
    isGenesisProgramEnded({
      isLoading: false,
      activePhase: null,
      seasonOptions: [{ status: 'Ended' }, { status: 'Ended' }],
    }),
    true,
  )
  // Prod getPhaseCount=0 → 空 seasons：无 Upcoming、无 active → 已结束（勿永驻骨架）
  assert.equal(
    isGenesisProgramEnded({
      isLoading: false,
      activePhase: null,
      seasonOptions: [],
    }),
    true,
  )
})
