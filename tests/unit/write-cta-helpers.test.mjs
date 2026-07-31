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

test('formatAmountBalanceLabel swaps balance or ellipsis', async () => {
  const { formatAmountBalanceLabel } = await loadModule('/src/core/wallet/write-cta.ts')
  assert.equal(
    formatAmountBalanceLabel('Bal {balance}', { loading: true, balance: '1.0' }),
    'Bal …',
  )
  assert.equal(
    formatAmountBalanceLabel('Bal {balance}', { loading: false, balance: '1.0' }),
    'Bal 1.0',
  )
})

test('messageFromSentinels maps sentinel then falls back', async () => {
  const { messageFromSentinels } = await loadModule('/src/web3/errors/message-from-sentinels.ts')
  assert.equal(
    messageFromSentinels('GATE_A', [['GATE_A', 'alpha']], () => 'fallback'),
    'alpha',
  )
  assert.equal(
    messageFromSentinels('OTHER', [['GATE_A', 'alpha']], () => 'fallback'),
    'fallback',
  )
})
