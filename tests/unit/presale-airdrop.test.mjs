import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('X airdrop preview is hidden below single-period cumulative threshold', async () => {
  const { resolveXTokenAirdropUsdForPurchase, X_AIRDROP_MIN_PERIOD_USD } =
    await loadModule('/src/lib/presale/presale-math.ts')

  assert.equal(resolveXTokenAirdropUsdForPurchase(0, 100, 0), 0)
  assert.equal(
    resolveXTokenAirdropUsdForPurchase(X_AIRDROP_MIN_PERIOD_USD - 200, 100, 0),
    0,
  )
})

test('X airdrop preview applies phase ratio to current order once eligible', async () => {
  const { resolveXTokenAirdropUsdForPurchase } = await loadModule(
    '/src/lib/presale/presale-math.ts',
  )

  assert.equal(resolveXTokenAirdropUsdForPurchase(5_900, 100, 0), 5)
  assert.equal(resolveXTokenAirdropUsdForPurchase(6_000, 100, 1), 2)
})
