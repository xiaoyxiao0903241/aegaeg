import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('resolveContractErrorMessage maps ERC20InsufficientBalance selector', async () => {
  const { resolveContractErrorMessage } = await loadModule(
    '/src/web3/resolve-contract-error-message.ts',
  )

  const message = resolveContractErrorMessage(new Error('Encoded error signature "0xe450d38c" not found'), {
    insufficientUsd1: 'USD1 low',
    insufficientAllowance: 'Allowance low',
  })

  assert.equal(message, 'USD1 low')
})

test('resolveGenesisPurchaseError maps validation codes to localized messages', async () => {
  const { GENESIS_PURCHASE_ERROR, resolveGenesisPurchaseError } = await loadModule(
    '/src/web3/resolve-contract-error-message.ts',
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
  const { isUserRejectedWalletError, resolveGenesisPurchaseError, resolveSwapUserFacingMessage } =
    await loadModule('/src/web3/resolve-contract-error-message.ts')

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
    resolveSwapUserFacingMessage({ code: 4001, message: 'Transaction failed' }, messages),
    'Unavailable',
  )
  assert.equal(
    resolveSwapUserFacingMessage({ code: 4001, message: 'User rejected the request.' }, {
      ...messages,
      transactionCancelled: 'Cancelled',
    }),
    'Cancelled',
  )
})

test('resolveContractErrorMessage maps ERC20InsufficientAllowance selector', async () => {
  const { resolveContractErrorMessage } = await loadModule(
    '/src/web3/resolve-contract-error-message.ts',
  )

  const message = resolveContractErrorMessage(new Error('reverted with 0xfb8f41b2'), {
    insufficientUsd1: 'USD1 low',
    insufficientAllowance: 'Allowance low',
  })

  assert.equal(message, 'Allowance low')
})

test('resolveReferralBindError maps MetaMask nested revert selector', async () => {
  const { resolveReferralBindError } = await loadModule(
    '/src/web3/resolve-contract-error-message.ts',
  )
  const { normalizeWalletRpcError } = await loadModule('/src/web3/wallet/wallet-write-error.ts')

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

test('resolveWalletTransactionError maps gas and estimate failures', async () => {
  const { WALLET_WRITE_ERROR, resolveWalletTransactionError } = await loadModule(
    '/src/web3/resolve-contract-error-message.ts',
  )

  const messages = {
    gasLimitTooLow: 'Gas too low',
    gasEstimateFailed: 'Estimate failed',
    insufficientFunds: 'No BNB',
    transactionFailed: 'Tx failed',
  }

  assert.equal(
    resolveWalletTransactionError(
      new Error('Signer Error: gasLimit is too low. given 0, need 21000'),
      messages,
    ),
    'Gas too low',
  )
  assert.equal(
    resolveWalletTransactionError(new Error(WALLET_WRITE_ERROR.GAS_ESTIMATE_FAILED), messages),
    'Estimate failed',
  )
  assert.equal(
    resolveWalletTransactionError(new Error('insufficient funds for gas * price + value'), messages),
    'No BNB',
  )
  assert.equal(
    resolveWalletTransactionError({ code: 4001, message: 'User rejected the request.' }, messages),
    null,
  )
})

test('resolveGenesisPurchaseError maps PreSale selector from nested wallet data', async () => {
  const { resolveGenesisPurchaseError } = await loadModule(
    '/src/web3/resolve-contract-error-message.ts',
  )
  const { normalizeWalletRpcError } = await loadModule('/src/web3/wallet/wallet-write-error.ts')

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

test('resolveReferralBindError falls back to null when unmapped (no raw passthrough)', async () => {
  const { resolveReferralBindError } = await loadModule(
    '/src/web3/resolve-contract-error-message.ts',
  )

  const messages = {
    alreadyBound: 'Already bound',
    parentNotBound: 'Parent not bound',
    selfReferral: 'Self referral',
    invalidParent: 'Invalid parent',
    migratedAccount: 'Migrated',
    systemConfig: 'System config',
    failed: 'Failed',
  }

  assert.equal(resolveReferralBindError(new Error('weird rpc english leak'), messages), null)
})

test('toWalletUserFacingMessage never returns raw RPC text', async () => {
  const { toWalletUserFacingMessage } = await loadModule(
    '/src/web3/resolve-contract-error-message.ts',
  )

  assert.equal(
    toWalletUserFacingMessage(new Error('execution reverted: 0xdead'), 'Chain fallback'),
    'Chain fallback',
  )
  assert.equal(
    toWalletUserFacingMessage(
      { code: 4001, message: 'User rejected the request.' },
      'Chain fallback',
    ),
    null,
  )
})

test('resolveSwapUserFacingMessage maps quote/gate sentinels and never leaks raw RPC', async () => {
  const {
    resolveSwapUserFacingMessage,
    SWAP_QUOTE_FAILED,
    SWAP_SUBMIT_GATE_FAILED,
  } = await loadModule('/src/web3/resolve-contract-error-message.ts')

  const messages = {
    walletNotConnected: 'Connect wallet',
    insufficientAllowance: 'Allowance',
    insufficientUsd1: 'USD1',
    purchaseUnavailable: 'Unavailable',
    transactionCancelled: 'Cancelled',
    quoteFailed: 'Quote failed',
  }
  const walletErrors = {
    gasLimitTooLow: 'Gas too low',
    gasEstimateFailed: 'Estimate failed',
    insufficientFunds: 'No BNB',
    transactionFailed: 'Tx failed',
  }

  assert.equal(
    resolveSwapUserFacingMessage(SWAP_QUOTE_FAILED, messages, walletErrors, 'Fallback'),
    'Quote failed',
  )
  assert.equal(
    resolveSwapUserFacingMessage(
      new Error(SWAP_SUBMIT_GATE_FAILED),
      messages,
      walletErrors,
      'Fallback',
    ),
    'Quote failed',
  )
  assert.equal(
    resolveSwapUserFacingMessage(
      new Error('execution reverted: 0xdeadbeef raw'),
      messages,
      walletErrors,
      'Fallback',
    ),
    'Fallback',
  )
  assert.notEqual(
    resolveSwapUserFacingMessage(
      new Error('execution reverted: 0xdeadbeef raw'),
      messages,
      walletErrors,
      'Fallback',
    ),
    'execution reverted: 0xdeadbeef raw',
  )
})

test('resolveTeamClaimError never returns normalize throw.message', async () => {
  const { resolveTeamClaimError } = await loadModule(
    '/src/web3/resolve-contract-error-message.ts',
  )

  const messages = {
    zeroAmount: 'Zero',
    invalidSigner: 'Signer',
    alreadyUsed: 'Used',
    expired: 'Expired',
    noOrder: 'No order',
    failed: 'Claim failed',
    confirmSyncFailed: 'Sync failed',
    walletNotConnected: 'Connect',
  }

  const normalizeThrow = new Error(
    '领取签名缺少字段: salt。/claim/team-reward 实际返回字段: [signature]',
  )
  assert.equal(resolveTeamClaimError(normalizeThrow, messages), 'Claim failed')
  assert.notEqual(resolveTeamClaimError(normalizeThrow, messages), normalizeThrow.message)
})
