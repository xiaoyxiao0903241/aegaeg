import assert from 'node:assert/strict'
import test from 'node:test'

test('resolveContractErrorMessage maps ERC20InsufficientBalance selector', async () => {
  const { resolveContractErrorMessage } = await import('../../src/lib/web3/resolve-contract-error-message.ts')

  const message = resolveContractErrorMessage(new Error('Encoded error signature "0xe450d38c" not found'), {
    insufficientUsd1: 'USD1 low',
    insufficientAllowance: 'Allowance low',
  })

  assert.equal(message, 'USD1 low')
})

test('resolveGenesisPurchaseError maps validation codes to localized messages', async () => {
  const { GENESIS_PURCHASE_ERROR, resolveGenesisPurchaseError } = await import(
    '../../src/lib/web3/resolve-contract-error-message.ts'
  )

  const messages = {
    insufficientUsd1: 'USD1 low',
    insufficientAllowance: 'Allowance low',
    purchaseUnavailable: 'Unavailable',
  }

  assert.equal(
    resolveGenesisPurchaseError(GENESIS_PURCHASE_ERROR.INSUFFICIENT_USD1, messages),
    'USD1 low',
  )
  assert.equal(
    resolveGenesisPurchaseError(GENESIS_PURCHASE_ERROR.INSUFFICIENT_ALLOWANCE, messages),
    'Allowance low',
  )
  assert.equal(
    resolveGenesisPurchaseError(GENESIS_PURCHASE_ERROR.UNAVAILABLE, messages),
    'Unavailable',
  )
})

test('isUserRejectedWalletError detects MetaMask rejection', async () => {
  const { isUserRejectedWalletError, resolveGenesisPurchaseError } = await import(
    '../../src/lib/web3/resolve-contract-error-message.ts'
  )

  assert.equal(isUserRejectedWalletError({ code: 4001, message: 'User rejected the request.' }), true)
  assert.equal(isUserRejectedWalletError(new Error('User rejected the request.')), true)

  const messages = {
    insufficientUsd1: 'USD1 low',
    insufficientAllowance: 'Allowance low',
    purchaseUnavailable: 'Unavailable',
  }

  assert.equal(
    resolveGenesisPurchaseError(new Error('User rejected the request.'), messages),
    null,
  )
})

test('resolveContractErrorMessage maps ERC20InsufficientAllowance selector', async () => {
  const { resolveContractErrorMessage } = await import('../../src/lib/web3/resolve-contract-error-message.ts')

  const message = resolveContractErrorMessage(new Error('reverted with 0xfb8f41b2'), {
    insufficientUsd1: 'USD1 low',
    insufficientAllowance: 'Allowance low',
  })

  assert.equal(message, 'Allowance low')
})
