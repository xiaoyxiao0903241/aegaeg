import assert from 'node:assert/strict'
import test from 'node:test'

test('compliant submit paths use approveThenLiveWrite', async () => {
  const { readFile } = await import('node:fs/promises')
  const roots = [
    '../../../src/views/dapp/assets/submit-assets.ts',
    '../../../src/views/dapp/staking/stake/submit-stake.ts',
    '../../../src/views/dapp/staking/bond/submit-bond-zap.ts',
    '../../../src/views/dapp/staking/xmine/submit-xmine.ts',
    '../../../src/views/dapp/rewards/submit-rewards.ts',
    '../../../src/views/dapp/genesis/use-genesis-purchase-actions.ts',
    '../../../src/views/dapp/exchange/flash-exchange/submit-flash-exchange.ts',
    '../../../src/views/dapp/exchange/market-trade/submit-market-trade.ts',
    '../../../src/views/dapp/exchange/burn/submit-burn-exchange.ts',
    '../../../src/views/dapp/exchange/turbine/submit-turbine-exchange.ts',
  ]
  for (const rel of roots) {
    const src = await readFile(new URL(rel, import.meta.url), 'utf8')
    assert.match(src, /approveThenLiveWrite/, rel)
  }
})
