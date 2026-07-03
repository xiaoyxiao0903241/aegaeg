import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('resolveContractErrorMessage maps ERC20InsufficientBalance selector', async () => {
  const { resolveContractErrorMessage } = await loadModule(
    '/src/lib/web3/resolve-contract-error-message.ts',
  )

  const message = resolveContractErrorMessage(new Error('Encoded error signature "0xe450d38c" not found'), {
    insufficientUsd1: 'USD1 low',
    insufficientAllowance: 'Allowance low',
  })

  assert.equal(message, 'USD1 low')
})

test('resolveGenesisPurchaseError maps validation codes to localized messages', async () => {
  const { GENESIS_PURCHASE_ERROR, resolveGenesisPurchaseError } = await loadModule(
    '/src/lib/web3/resolve-contract-error-message.ts',
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
  const { isUserRejectedWalletError, resolveGenesisPurchaseError, resolveFlashSwapUserMessage } =
    await loadModule('/src/lib/web3/resolve-contract-error-message.ts')

  assert.equal(isUserRejectedWalletError({ code: 4001, message: 'User rejected the request.' }), true)
  assert.equal(isUserRejectedWalletError(new Error('User rejected the request.')), true)
  assert.equal(
    isUserRejectedWalletError({ code: 4001, message: 'Transaction failed' }),
    false,
  )
  assert.equal(
    isUserRejectedWalletError({ code: 4001, message: 'Interaction failed' }),
    false,
  )

  const messages = {
    insufficientUsd1: 'USD1 low',
    insufficientAllowance: 'Allowance low',
    purchaseUnavailable: 'Unavailable',
    walletNotConnected: 'Wallet missing',
    transactionCancelled: 'Cancelled',
  }

  assert.equal(
    resolveGenesisPurchaseError(new Error('User rejected the request.'), messages),
    null,
  )
  assert.equal(
    resolveFlashSwapUserMessage({ code: 4001, message: 'Transaction failed' }, messages),
    'Transaction failed',
  )
  assert.equal(
    resolveFlashSwapUserMessage({ code: 4001, message: 'User rejected the request.' }, {
      ...messages,
      transactionCancelled: 'Cancelled',
    }),
    'Cancelled',
  )
})

test('resolveContractErrorMessage maps ERC20InsufficientAllowance selector', async () => {
  const { resolveContractErrorMessage } = await loadModule(
    '/src/lib/web3/resolve-contract-error-message.ts',
  )

  const message = resolveContractErrorMessage(new Error('reverted with 0xfb8f41b2'), {
    insufficientUsd1: 'USD1 low',
    insufficientAllowance: 'Allowance low',
  })

  assert.equal(message, 'Allowance low')
})

test('resolveReferralBindError maps MetaMask nested revert selector', async () => {
  const { resolveReferralBindError } = await loadModule(
    '/src/lib/web3/resolve-contract-error-message.ts',
  )
  const { normalizeWalletRpcError } = await loadModule('/src/web3/wallet-write-error.ts')

  const messages = {
    alreadyBound: 'Already bound',
    parentNotBound: 'Parent not bound',
    selfReferral: 'Self referral',
    invalidParent: 'Invalid parent',
    migratedAccount: 'Migrated',
    systemConfig: 'System config',
    failed: 'Failed',
  }

  const walletError = normalizeWalletRpcError({
    code: -32603,
    message: 'Internal JSON-RPC error.',
    data: {
      code: 3,
      message: 'execution reverted',
      data: '0x3d50dfd50000000000000000000000000000000000000000000000000000000000000001',
    },
  })

  assert.equal(resolveReferralBindError(walletError, messages), 'Parent not bound')
  assert.equal(
    resolveReferralBindError(
      new Error('execution reverted: Referral__AlreadyBound(address)'),
      messages,
    ),
    'Already bound',
  )
  assert.equal(
    resolveReferralBindError(new Error('reverted with custom error 0xa7e9b6d3'), messages),
    'Self referral',
  )
})

test('resolveGenesisPurchaseError maps PreSale selector from nested wallet data', async () => {
  const { resolveGenesisPurchaseError } = await loadModule(
    '/src/lib/web3/resolve-contract-error-message.ts',
  )
  const { normalizeWalletRpcError } = await loadModule('/src/web3/wallet-write-error.ts')

  const walletError = normalizeWalletRpcError({
    code: -32603,
    message: 'Internal JSON-RPC error.',
    data: {
      code: 3,
      message: 'execution reverted',
      data: '0x43f81a81',
    },
  })

  assert.equal(
    resolveGenesisPurchaseError(walletError, {
      insufficientUsd1: 'USD1 low',
      insufficientAllowance: 'Allowance low',
      purchaseUnavailable: 'Unavailable',
      walletNotConnected: 'Wallet missing',
      userLimitExceeded: 'Limit exceeded',
    }),
    'Limit exceeded',
  )
})
