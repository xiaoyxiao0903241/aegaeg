import assert from 'node:assert/strict'
import test from 'node:test'
import { encodeErrorResult, parseAbi } from 'viem'
import { loadModule } from './load-module.mjs'

test('decodeContractRevert decodes PreSaleUserNotBound by selector', async () => {
  const { decodeContractRevert } = await loadModule('/src/web3/decode-contract-revert.ts')
  const abi = parseAbi(['error PreSaleUserNotBound()'])
  const data = encodeErrorResult({ abi, errorName: 'PreSaleUserNotBound', args: [] })

  const decoded = decodeContractRevert({ data }, abi)
  assert.equal(decoded?.errorName, 'PreSaleUserNotBound')
})

test('normalizeContractRevertError surfaces error name for UI parsers', async () => {
  const { normalizeContractRevertError } = await loadModule('/src/web3/decode-contract-revert.ts')
  const { resolveGenesisPurchaseError } = await loadModule(
    '/src/web3/resolve-contract-error-message.ts',
  )
  const abi = parseAbi(['error PreSaleUserNotBound()'])
  const data = encodeErrorResult({ abi, errorName: 'PreSaleUserNotBound', args: [] })

  const error = normalizeContractRevertError({ data }, abi)
  const message = resolveGenesisPurchaseError(error, {
    insufficientUsd1: 'USD1 low',
    insufficientAllowance: 'Allowance low',
    purchaseUnavailable: 'Unavailable',
    walletNotConnected: 'Wallet missing',
    notBound: 'Bind referrer first',
  })

  assert.equal(message, 'Bind referrer first')
})
