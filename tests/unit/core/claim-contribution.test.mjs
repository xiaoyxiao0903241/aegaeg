import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('CONTRIBUTION_CLAIM_RATIO_LABEL is 1:1, not divisor:1', async () => {
  const { CONTRIBUTION_CLAIM_RATIO_LABEL } = await loadModule(
    '/src/core/rewards/claim-contribution.ts',
  )
  assert.equal(CONTRIBUTION_CLAIM_RATIO_LABEL, '1:1')
})

test('parseApiTokenWei fail-closed on empty/invalid; parses decimals', async () => {
  const { parseApiTokenWei } = await loadModule('/src/core/rewards/claim-contribution.ts')
  assert.equal(parseApiTokenWei(null, 9), null)
  assert.equal(parseApiTokenWei('', 9), null)
  assert.equal(parseApiTokenWei('  ', 9), null)
  assert.equal(parseApiTokenWei('abc', 9), null)
  assert.equal(parseApiTokenWei('1', 9), 1_000_000_000n)
  assert.equal(parseApiTokenWei('1.5', 9), 1_500_000_000n)
  assert.equal(parseApiTokenWei('1,000.25', 9), 1_000_250_000_000n)
})

test('previewDaoClaimContribution is 1:1 and skips unknown amounts', async () => {
  const { previewDaoClaimContribution } = await loadModule(
    '/src/core/rewards/claim-contribution.ts',
  )
  assert.equal(previewDaoClaimContribution({ claimAmountWei: null, availableWei: 10n }), null)
  assert.equal(previewDaoClaimContribution({ claimAmountWei: 10n, availableWei: null }), null)
  assert.equal(previewDaoClaimContribution({ claimAmountWei: 0n, availableWei: 10n }), null)
  assert.deepEqual(previewDaoClaimContribution({ claimAmountWei: 100n, availableWei: 100n }), {
    requiredWei: 100n,
    availableWei: 100n,
    ok: true,
  })
  assert.deepEqual(previewDaoClaimContribution({ claimAmountWei: 100n, availableWei: 99n }), {
    requiredWei: 100n,
    availableWei: 99n,
    ok: false,
  })
  assert.deepEqual(previewDaoClaimContribution({ claimAmountWei: 100n, availableWei: 600n }), {
    requiredWei: 100n,
    availableWei: 600n,
    ok: true,
  })
})
