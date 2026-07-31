import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('getErrorMessage maps ERC20 / genesis / referral / claim / quote (no raw leak)', async () => {
  const enModule = await loadModule('/src/i18n/messages/app/en.ts')
  const t = enModule.default
  const { getErrorMessage } = await loadModule('/src/web3/errors/get-error-message.ts')
  const {
    GENESIS_PURCHASE_ERROR,
    REFERRAL_BIND_ERROR,
    EXCHANGE_QUOTE_FAILED,
    EXCHANGE_SUBMIT_GATE_FAILED,
  } = await loadModule('/src/web3/errors/sentinels.ts')

  assert.equal(
    getErrorMessage(new Error('reverted with 0xe450d38c'), t),
    t.genesis.insufficientUsd1,
  )
  assert.equal(
    getErrorMessage(new Error('reverted with 0xfb8f41b2'), t),
    t.genesis.insufficientAllowance,
  )

  assert.equal(
    getErrorMessage(GENESIS_PURCHASE_ERROR.INSUFFICIENT_USD1, t),
    t.genesis.insufficientUsd1,
  )
  assert.equal(
    getErrorMessage(GENESIS_PURCHASE_ERROR.INSUFFICIENT_ALLOWANCE, t),
    t.genesis.insufficientAllowance,
  )
  assert.equal(
    getErrorMessage(GENESIS_PURCHASE_ERROR.UNAVAILABLE, t),
    t.genesis.purchaseUnavailable,
  )
  assert.equal(getErrorMessage(new Error('User rejected the request.'), t), null)

  assert.equal(
    getErrorMessage(REFERRAL_BIND_ERROR.INVALID_PARENT, t),
    t.community.bindErrors.invalidParent,
  )
  assert.equal(
    getErrorMessage(REFERRAL_BIND_ERROR.PARENT_NOT_BOUND, t),
    t.community.bindErrors.parentNotBound,
  )

  const parentNotBoundWallet = {
    data: { data: '0x3d50dfd5' },
    message: 'execution reverted',
  }
  assert.equal(getErrorMessage(parentNotBoundWallet, t), t.community.bindErrors.parentNotBound)
  assert.equal(
    getErrorMessage(new Error('reverted with custom error 0xa7e9b6d3'), t),
    t.community.bindErrors.selfReferral,
  )

  assert.equal(getErrorMessage(EXCHANGE_QUOTE_FAILED, t), t.errors.quoteFailed)
  assert.equal(getErrorMessage(EXCHANGE_SUBMIT_GATE_FAILED, t), t.errors.quoteFailed)
  assert.equal(getErrorMessage(new Error('weird rpc english leak'), t), t.errors.chain.fallback)

  // Team claim: mapped claim errors, not raw normalize throw text
  assert.equal(getErrorMessage(new Error('ErrorAlreadyUsed'), t), t.rewards.claimErrors.alreadyUsed)
  assert.equal(
    getErrorMessage(new Error('some English normalize throw'), t),
    t.errors.chain.fallback,
  )
})

test('getErrorMessage maps PreSale selector from nested wallet data', async () => {
  const enModule = await loadModule('/src/i18n/messages/app/en.ts')
  const t = enModule.default
  const { getErrorMessage } = await loadModule('/src/web3/errors/get-error-message.ts')

  const walletError = {
    data: { data: '0x3bdd728c' },
    message: 'execution reverted',
  }
  assert.equal(getErrorMessage(walletError, t), t.genesis.errors.notBound)
})
