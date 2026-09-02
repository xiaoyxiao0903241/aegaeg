import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('ERC20InsufficientBalance is path-scoped (not Genesis subscribe copy)', async () => {
  const enModule = await loadModule('/src/i18n/messages/app/en.ts')
  const t = enModule.default
  const { getErrorMessage } = await loadModule('/src/web3/errors/get-error-message.ts')
  const { WRITE_PATH } = await loadModule('/src/web3/wallet/write-path.ts')

  const hexOnly = new Error('reverted with 0xe450d38c')

  assert.notEqual(
    getErrorMessage(hexOnly, t),
    t.genesis.insufficientUsd1,
    'no-path ERC20 must not say Genesis subscribe',
  )
  assert.equal(getErrorMessage(hexOnly, t), t.errors.chain.reverts.walletTokenInsufficient)

  assert.equal(
    getErrorMessage(hexOnly, t, { path: WRITE_PATH.STAKING }),
    t.errors.chain.reverts.walletAgxInsufficient,
  )
  assert.equal(
    getErrorMessage(hexOnly, t, { path: WRITE_PATH.BOND_ZAP }),
    t.errors.chain.reverts.walletUsd1Insufficient,
  )
  assert.equal(
    getErrorMessage(hexOnly, t, { path: WRITE_PATH.XMINE }),
    t.errors.chain.reverts.walletGagxInsufficient,
  )
  assert.equal(
    getErrorMessage(hexOnly, t, { path: WRITE_PATH.GENESIS }),
    t.genesis.insufficientUsd1,
  )
  assert.equal(
    getErrorMessage(hexOnly, t, { path: WRITE_PATH.ASSETS_CLAIM }),
    t.errors.chain.reverts.contractPayableInsufficient,
  )
  assert.equal(
    getErrorMessage(hexOnly, t, { path: WRITE_PATH.RELEASE_CLAIM }),
    t.errors.chain.reverts.extractableInsufficient,
  )
})

test('ERC20InsufficientBalance uses decoded account vs wallet when available', async () => {
  const enModule = await loadModule('/src/i18n/messages/app/en.ts')
  const t = enModule.default
  const { getErrorMessage } = await loadModule('/src/web3/errors/get-error-message.ts')
  const { WRITE_PATH } = await loadModule('/src/web3/wallet/write-path.ts')

  const wallet = '0x2222222222222222222222222222222222222222'
  const poolHex =
    '0xe450d38c000000000000000000000000111111111111111111111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001'
  const walletHex =
    '0xe450d38c000000000000000000000000222222222222222222222222222222222222222200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001'

  assert.equal(
    getErrorMessage({ message: 'execution reverted', data: poolHex }, t, {
      path: WRITE_PATH.STAKING,
      walletAddress: wallet,
    }),
    t.errors.chain.reverts.contractPayableInsufficient,
  )
  assert.equal(
    getErrorMessage({ message: 'execution reverted', data: walletHex }, t, {
      path: WRITE_PATH.ASSETS_CLAIM,
      walletAddress: wallet,
    }),
    t.errors.chain.reverts.walletTokenInsufficient,
  )
})

test('ERC20InsufficientAllowance is path-scoped (not Genesis USD1)', async () => {
  const enModule = await loadModule('/src/i18n/messages/app/en.ts')
  const t = enModule.default
  const { getErrorMessage } = await loadModule('/src/web3/errors/get-error-message.ts')
  const { WRITE_PATH } = await loadModule('/src/web3/wallet/write-path.ts')

  const err = new Error('reverted with 0xfb8f41b2')
  assert.notEqual(getErrorMessage(err, t), t.genesis.insufficientAllowance)
  assert.equal(getErrorMessage(err, t), t.errors.chain.reverts.insufficientAllowance)
  assert.equal(
    getErrorMessage(err, t, { path: WRITE_PATH.GENESIS }),
    t.genesis.insufficientAllowance,
  )
  assert.equal(
    getErrorMessage(err, t, { path: WRITE_PATH.STAKING }),
    t.staking.blocked.insufficientAllowance,
  )
})

test('shared Error* and MigratedAccount no longer hijack Flash / community copy', async () => {
  const enModule = await loadModule('/src/i18n/messages/app/en.ts')
  const t = enModule.default
  const { getErrorMessage } = await loadModule('/src/web3/errors/get-error-message.ts')

  assert.equal(
    getErrorMessage(new Error('ErrorZeroAddress'), t),
    t.errors.chain.reverts.zeroAddress,
  )
  assert.equal(
    getErrorMessage(new Error('ErrorNotAuthorized'), t),
    t.errors.chain.reverts.notAuthorized,
  )
  assert.equal(
    getErrorMessage(new Error('ErrorInvalidLimits'), t),
    t.errors.chain.reverts.invalidLimits,
  )
  assert.equal(
    getErrorMessage(new Error('ErrorInvalidAmount'), t),
    t.errors.chain.reverts.invalidAmount,
  )
  assert.equal(
    getErrorMessage(new Error('ErrorSilentTime'), t),
    t.errors.chain.reverts.turbineCooldown,
  )
  assert.equal(
    getErrorMessage(new Error('ErrorNoSilenceBalance'), t),
    t.errors.chain.reverts.turbineNoSilenceBalance,
  )
  assert.equal(
    getErrorMessage(new Error('BondDepositoryMigratedAccount'), t),
    t.staking.blocked.accountMigrated,
  )
  assert.equal(
    getErrorMessage(new Error('Referral__MigratedAccount'), t),
    t.community.bindErrors.migratedAccount,
  )
})
