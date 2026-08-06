import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('buildHoldingsDistributionView percentages and empty', async () => {
  const { buildHoldingsDistributionView } = await loadModule(
    '/src/shared/presenters/build-holdings-distribution.ts',
  )

  assert.equal(
    buildHoldingsDistributionView([
      { key: 'stake', label: '质押', amountLabel: '0 AGX', usd: 0 },
      { key: 'lpbond', label: 'LP', amountLabel: '0 AGX', usd: 0 },
      { key: 'burnbond', label: 'Burn', amountLabel: '0 AGX', usd: 0 },
      { key: 'xmine', label: 'X', amountLabel: '0 gAGX', usd: 0 },
    ]),
    null,
  )

  const view = buildHoldingsDistributionView([
    { key: 'stake', label: '质押', amountLabel: '320.00 AGX', usd: 20_800 },
    { key: 'lpbond', label: 'LP债券', amountLabel: '184.60 AGX', usd: 11_999 },
    { key: 'burnbond', label: '销毁债券', amountLabel: '92.30 AGX', usd: 5_999.5 },
    { key: 'xmine', label: 'X挖矿', amountLabel: '8.00 gAGX', usd: 520 },
  ])

  assert.ok(view)
  assert.equal(view.segs[0].pctLabel, '52.9%')
  assert.equal(view.segs[1].pctLabel, '30.5%')
  assert.equal(view.segs[2].pctLabel, '15.3%')
  assert.equal(view.segs[3].pctLabel, '1.3%')
  assert.equal(view.segs[3].showLabel, false)
  assert.match(view.totalLabel, /^\$/)
})
