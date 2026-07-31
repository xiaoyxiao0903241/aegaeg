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

test('normalizeContractRevertError surfaces error name for getErrorMessage', async () => {
  const { normalizeContractRevertError } = await loadModule('/src/web3/decode-contract-revert.ts')
  const { getErrorMessage } = await loadModule('/src/web3/errors/get-error-message.ts')
  const enModule = await loadModule('/src/i18n/messages/app/en.ts')
  const t = enModule.default
  const abi = parseAbi(['error PreSaleUserNotBound()'])
  const data = encodeErrorResult({ abi, errorName: 'PreSaleUserNotBound', args: [] })

  const error = normalizeContractRevertError({ data }, abi)
  assert.equal(getErrorMessage(error, t), t.genesis.errors.notBound)
})
