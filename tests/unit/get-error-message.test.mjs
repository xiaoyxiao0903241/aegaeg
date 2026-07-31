import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('getErrorMessage maps sentinels, handbook reverts, and falls back', async () => {
  const enModule = await loadModule('/src/i18n/messages/app/en.ts')
  const t = enModule.default
  assert.ok(t?.staking?.gates?.notBound, 'en app messages must include staking.gates')
  assert.ok(t?.errors?.chain?.reverts?.stakeAmountLimit, 'en must include chain.reverts')

  const { getErrorMessage } = await loadModule('/src/web3/errors/get-error-message.ts')
  const { STAKING_GATE_ERROR } = await loadModule('/src/web3/errors/staking-write-gate-errors.ts')
  const { ASSETS_GATE_ERROR } = await loadModule('/src/web3/errors/assets-write-gate-errors.ts')
  const { GENESIS_PURCHASE_ERROR, FLASH_USD1_GATE_ERROR } = await loadModule(
    '/src/web3/errors/sentinels.ts',
  )

  assert.equal(getErrorMessage(new Error('User rejected the request'), t), null)
  assert.equal(getErrorMessage(STAKING_GATE_ERROR.notBound, t), t.staking.gates.notBound)
  assert.equal(getErrorMessage(ASSETS_GATE_ERROR.warmupNotEnded, t), t.assets.gates.warmupNotEnded)
  assert.equal(getErrorMessage(GENESIS_PURCHASE_ERROR.NOT_BOUND, t), t.genesis.errors.notBound)
  assert.equal(getErrorMessage(FLASH_USD1_GATE_ERROR.belowMin, t), t.exchange.flash.gates.belowMin)

  // Handbook §19 / contract docs
  assert.equal(getErrorMessage(new Error('ErrorStakeNotApproved'), t), t.staking.gates.notBound)
  assert.equal(getErrorMessage(new Error('ErrorNotApproved'), t), t.staking.gates.depositoryNotAuth)
  assert.equal(
    getErrorMessage(new Error('ErrorStakeAmountLimit'), t),
    t.errors.chain.reverts.stakeAmountLimit,
  )
  assert.equal(
    getErrorMessage(new Error('ErrorMiningQuotaExceeded'), t),
    t.staking.gates.insufficientQuota,
  )
  assert.equal(getErrorMessage(new Error('PreSaleUserNotBound'), t), t.genesis.errors.notBound)
  assert.equal(getErrorMessage(new Error('ErrorAlreadyUsed'), t), t.rewards.claimErrors.alreadyUsed)
  assert.equal(
    getErrorMessage(new Error('ErrorBondTooSmall'), t),
    t.errors.chain.reverts.bondTooSmall,
  )
  assert.equal(
    getErrorMessage(new Error('ErrorBondTooLarge'), t),
    t.errors.chain.reverts.bondTooLarge,
  )
  assert.equal(
    getErrorMessage(new Error('ErrorStakeNotExist'), t),
    t.errors.chain.reverts.stakeNotExist,
  )
  assert.equal(
    getErrorMessage(new Error('ErrorProfitNotAvailable'), t),
    t.errors.chain.reverts.yieldUnavailable,
  )

  assert.equal(getErrorMessage(new Error('opaque rpc english'), t), t.errors.chain.fallback)
})
