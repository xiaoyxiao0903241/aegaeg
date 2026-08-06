import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from './load-module.mjs'

test('canClaimWhen requires wallet, writeReady, unlocked, and positive claimable', async () => {
  const { canClaimWhen } = await loadModule('/src/core/wallet/write-cta.ts')

  assert.equal(
    canClaimWhen({
      walletReady: true,
      writeReady: true,
      unknownReceiptLocked: false,
      claimable: 1n,
    }),
    true,
  )
  assert.equal(
    canClaimWhen({
      walletReady: true,
      writeReady: true,
      unknownReceiptLocked: true,
      claimable: 1n,
    }),
    false,
  )
  assert.equal(
    canClaimWhen({
      walletReady: true,
      writeReady: true,
      unknownReceiptLocked: false,
      claimable: 0n,
    }),
    false,
  )
  assert.equal(
    canClaimWhen({
      walletReady: true,
      writeReady: true,
      unknownReceiptLocked: false,
      claimable: 1n,
      planIndexOk: false,
    }),
    false,
  )
})

test('writeCtaDisabled blocks when latched, submitting, or not ready', async () => {
  const { writeCtaDisabled } = await loadModule('/src/core/wallet/write-cta.ts')

  assert.equal(
    writeCtaDisabled({
      unknownReceiptLocked: false,
      isSubmitting: false,
      writeReady: true,
      walletReady: true,
    }),
    false,
  )
  assert.equal(
    writeCtaDisabled({
      unknownReceiptLocked: true,
      isSubmitting: false,
      writeReady: true,
      walletReady: true,
    }),
    true,
  )
  assert.equal(
    writeCtaDisabled({
      unknownReceiptLocked: false,
      isSubmitting: true,
      writeReady: true,
      walletReady: true,
    }),
    true,
  )
})

test('writeCtaLabel maps migrated and need_referral phases', async () => {
  const { writeCtaLabel } = await loadModule('/src/core/wallet/write-cta.ts')
  const copy = {
    accountMigrated: 'migrated',
    bindReferral: 'bind',
    submit: 'submit',
  }
  assert.equal(writeCtaLabel('account_migrated', copy), 'migrated')
  assert.equal(writeCtaLabel('need_referral', copy), 'bind')
  assert.equal(writeCtaLabel('ready', copy), 'submit')
})

test('evaluateStakingAmountWrite allows submit when allowance soft-blocked', async () => {
  const { evaluateStakingAmountWrite } = await loadModule('/src/views/dapp/staking/shared.ts')

  const ready = {
    unknownReceiptLocked: false,
    isSubmitting: false,
    writeReady: true,
    walletReady: true,
    amountIn: 1n,
    preflightReady: true,
    needReferral: false,
    accountMigrated: false,
  }

  assert.equal(evaluateStakingAmountWrite({ ...ready, blockReason: null }).canSubmit, true)
  assert.equal(
    evaluateStakingAmountWrite({ ...ready, blockReason: 'insufficientAllowance' }).canSubmit,
    true,
  )
  assert.equal(
    evaluateStakingAmountWrite({ ...ready, blockReason: 'insufficientQuota' }).canSubmit,
    false,
  )
  assert.equal(evaluateStakingAmountWrite({ ...ready, blockReason: 'notBound' }).canSubmit, false)
})

test('formatAmountBalanceLabel keeps chrome with zero placeholder when balance pending', async () => {
  const { formatAmountBalanceLabel } = await loadModule('/src/core/wallet/write-cta.ts')
  assert.equal(formatAmountBalanceLabel('Bal {balance}', { balance: '1.0' }), 'Bal 1.0')
  assert.equal(
    formatAmountBalanceLabel('数量（钱包余额 {balance} AGX）', { balance: '', digits: 4 }),
    '数量（钱包余额 0.0000 AGX）',
  )
  assert.equal(formatAmountBalanceLabel('Bal {balance}', { balance: '' }), 'Bal 0.00')
})

test('getErrorMessage maps write-block sentinels used by CTAs', async () => {
  const enModule = await loadModule('/src/i18n/messages/app/en.ts')
  const t = enModule.default
  const { getErrorMessage } = await loadModule('/src/web3/errors/get-error-message.ts')
  const { STAKING_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')

  assert.equal(getErrorMessage(STAKING_BLOCKED.notBound, t), t.staking.blocked.notBound)
  assert.equal(getErrorMessage(new Error('OTHER'), t), t.errors.chain.fallback)
})
