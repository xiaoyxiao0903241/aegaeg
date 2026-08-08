import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const seasonA = {
  name: 'Phase 1',
  status: 'LIVE',
  active: true,
  discount: '10% off',
  price: '≈ $1.00',
  date: '1 Jan – 2 Jan',
  desktopMeta: { discount: '-10%', airdrop: '—' },
}

const seasonB = {
  ...seasonA,
  status: 'Ended',
  active: false,
}

test('genesisPromoChromeEqual: same semantics different refs → equal', async () => {
  const { genesisPromoChromeEqual } = await loadModule(
    '/src/core/presale/genesis-promo-equality.ts',
  )
  const snapshot = {
    season: 1,
    discount: '-10%',
    status: 'LIVE',
    dateRange: '1 Jan – 2 Jan',
    endDate: '2 Jan',
    startDate: '1 Jan',
  }
  const a = {
    activeSeasonNumber: 1,
    discountLabel: '-10%',
    isLoading: false,
    promoSnapshot: snapshot,
    seasonOptions: [seasonA],
  }
  const b = {
    activeSeasonNumber: 1,
    discountLabel: '-10%',
    isLoading: false,
    promoSnapshot: { ...snapshot },
    seasonOptions: [{ ...seasonA, desktopMeta: { ...seasonA.desktopMeta } }],
  }
  assert.equal(genesisPromoChromeEqual(a, b), true)
  assert.equal(genesisPromoChromeEqual(a, { ...b, seasonOptions: [seasonB] }), false)
})

test('setPromo keeps store refs when chrome semantics unchanged', async () => {
  const { useGenesisPromoStore } = await loadModule('/src/stores/genesis-promo-store.ts')
  const snapshot = {
    season: 1,
    discount: '-10%',
    status: 'LIVE',
    dateRange: '1 Jan – 2 Jan',
    endDate: '2 Jan',
    startDate: '1 Jan',
  }
  const first = {
    activeSeasonNumber: 2,
    discountLabel: '-10%',
    isLoading: false,
    promoSnapshot: snapshot,
    seasonOptions: [seasonA],
  }

  useGenesisPromoStore.getState().setPromo(first)
  const afterFirst = useGenesisPromoStore.getState()
  const snapRef = afterFirst.promoSnapshot
  const seasonsRef = afterFirst.seasonOptions

  useGenesisPromoStore.getState().setPromo({
    activeSeasonNumber: 2,
    discountLabel: '-10%',
    isLoading: false,
    promoSnapshot: { ...snapshot },
    seasonOptions: [{ ...seasonA, desktopMeta: { ...seasonA.desktopMeta } }],
  })
  const afterSame = useGenesisPromoStore.getState()
  assert.equal(afterSame.promoSnapshot, snapRef)
  assert.equal(afterSame.seasonOptions, seasonsRef)

  useGenesisPromoStore.getState().setPromo({
    ...first,
    seasonOptions: [seasonB],
  })
  const afterChange = useGenesisPromoStore.getState()
  assert.notEqual(afterChange.seasonOptions, seasonsRef)
  assert.equal(afterChange.seasonOptions[0]?.status, 'Ended')
})
