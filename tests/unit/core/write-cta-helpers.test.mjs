import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('canClaimWhen requires wallet, writeReady, unlocked, and positive claimable', async () => {
  const { canClaimWhen } = await loadModule('/src/core/wallet/write-cta.ts')

  assert.equal(
    canClaimWhen({
      walletReady: true,
      writeReady: true,
      isPending: false,
      claimable: 1n,
    }),
    true,
  )
  assert.equal(
    canClaimWhen({
      walletReady: true,
      writeReady: true,
      isPending: true,
      claimable: 1n,
    }),
    false,
  )
  assert.equal(
    canClaimWhen({
      walletReady: true,
      writeReady: true,
      isPending: false,
      claimable: 0n,
    }),
    false,
  )
  assert.equal(
    canClaimWhen({
      walletReady: true,
      writeReady: true,
      isPending: false,
      claimable: 1n,
      planIndexOk: false,
    }),
    false,
  )
})

test('writeCtaDisabled blocks when submitting or not ready', async () => {
  const { writeCtaDisabled } = await loadModule('/src/core/wallet/write-cta.ts')

  assert.equal(
    writeCtaDisabled({
      isSubmitting: false,
      writeReady: true,
      walletReady: true,
    }),
    false,
  )
  assert.equal(
    writeCtaDisabled({
      isSubmitting: true,
      writeReady: true,
      walletReady: true,
    }),
    true,
  )
})

test('writeCtaLabel only rewrites bind-referral duty on the button', async () => {
  const { writeCtaLabel } = await loadModule('/src/core/wallet/write-cta.ts')
  const copy = { bindReferral: 'bind', submit: 'submit' }
  assert.equal(writeCtaLabel('need_referral', copy), 'bind')
  assert.equal(writeCtaLabel('account_migrated', copy), 'submit')
  assert.equal(writeCtaLabel('ready', copy), 'submit')
})

test('writeBlockHint only surfaces hard write blocks', async () => {
  const { writeBlockHint, isHardWriteBlockReason } = await loadModule(
    '/src/core/wallet/write-cta.ts',
  )
  const copy = {
    accountMigrated: 'migrated',
    notBound: 'bind',
    insufficientQuota: 'quota',
    insufficientAllowance: 'allow',
    zeroAmount: 'zero',
  }
  assert.equal(isHardWriteBlockReason('accountMigrated'), true)
  assert.equal(isHardWriteBlockReason('notBound'), false)
  assert.equal(isHardWriteBlockReason('unavailable'), false)
  assert.equal(isHardWriteBlockReason('insufficientAllowance'), false)
  assert.equal(isHardWriteBlockReason('zeroAmount'), false)
  assert.equal(isHardWriteBlockReason(null), false)
  assert.equal(writeBlockHint('accountMigrated', copy), 'migrated')
  assert.equal(writeBlockHint('notBound', copy), null)
  assert.equal(writeBlockHint('unavailable', copy), null)
  assert.equal(writeBlockHint('insufficientQuota', copy), 'quota')
  assert.equal(writeBlockHint('insufficientAllowance', copy), null)
  assert.equal(writeBlockHint('zeroAmount', copy), null)
  assert.equal(writeBlockHint(null, copy), null)
  assert.equal(isHardWriteBlockReason('bondTooSmall'), true)
  assert.equal(isHardWriteBlockReason('bondTooLarge'), true)
  assert.equal(writeBlockHint('bondTooSmall', {}), null)
  assert.equal(writeBlockHint('bondTooSmall', { bondTooSmall: 'too small' }), 'too small')
})

test('evaluateStakingAmountWrite allows submit when allowance soft-blocked', async () => {
  const { evaluateStakingAmountWrite } = await loadModule('/src/views/dapp/staking/shared.ts')

  const ready = {
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
  assert.equal(
    evaluateStakingAmountWrite({ ...ready, blockReason: null, isQuoting: true }).canSubmit,
    false,
  )
  assert.equal(
    evaluateStakingAmountWrite({ ...ready, blockReason: null, isQuoting: true }).writePhase,
    'estimating',
  )
})

test('formatAmountBalanceLabel is -- when balance is missing', async () => {
  const { formatAmountBalanceLabel } = await loadModule('/src/core/wallet/write-cta.ts')
  assert.equal(
    formatAmountBalanceLabel('Bal {balance}', { balance: '1.0000 AGX' }),
    'Bal 1.0000 AGX',
  )
  assert.equal(formatAmountBalanceLabel('数量（钱包余额 {balance}）', { balance: '' }), '--')
  assert.equal(formatAmountBalanceLabel('Bal {balance}', { balance: '--' }), '--')
})

test('getErrorMessage maps write-block sentinels used by CTAs', async () => {
  const enModule = await loadModule('/src/i18n/messages/app/en.ts')
  const t = enModule.default
  const { getErrorMessage } = await loadModule('/src/web3/errors/get-error-message.ts')
  const { STAKING_BLOCKED } = await loadModule('/src/web3/errors/write-block-errors.ts')

  assert.equal(getErrorMessage(STAKING_BLOCKED.notBound, t), t.staking.blocked.notBound)
  assert.equal(getErrorMessage(new Error('OTHER'), t), t.errors.chain.fallback)
})
