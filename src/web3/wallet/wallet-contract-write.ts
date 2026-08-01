import {
  encodeFunctionData,
  numberToHex,
  parseAbi,
  type Abi,
  type Address,
  type Hash,
  type TransactionReceipt,
} from 'viem'
import type { Wallet } from 'thirdweb/wallets'
import { getAddress } from 'thirdweb/utils'
import {
  decodeContractRevert,
  isContractRevert,
  normalizeContractRevertError,
} from '~/web3/decode-contract-revert'
import { WALLET_WRITE_ERROR } from '~/web3/contract-error-message'
import { WALLET_BLOCKED } from '~/web3/errors/sentinels'
import { createWalletReadClient, type ChainReadClient } from '~/web3/chain-read-client'
import { bscReadClient } from '~/web3/bsc-read-client'
import { walletEip1193Provider } from '~/web3/wallet/wallet-eip1193-provider'
import { assertWalletTransactionHash } from '~/web3/wallet/wallet-write-error'
import { walletProviderRequest } from '~/web3/wallet/wallet-provider-request'
import { waitForWalletTransactionConfirmation } from '~/web3/wallet/wait-wallet-transaction'
import {
  assertWriteIntentMatches,
  createWriteIntent,
  parseEip1193ChainId,
} from '~/web3/wallet/assert-write-intent'
import { defaultChain } from '~/web3/thirdweb'
import { WalletSubmitUnknownError } from '~/web3/wallet/wallet-submit-unknown-error'

export type ConfirmedWalletWrite = TransactionReceipt & { transactionHash: Hash }

/** +20% headroom so marginal state drift between estimate and mine still succeeds. */
const GAS_BUFFER_NUMERATOR = 120n
const GAS_BUFFER_DENOMINATOR = 100n

function requireWalletAccount(wallet: Wallet) {
  const account = wallet.getAccount()
  if (!account) {
    throw WALLET_BLOCKED.NOT_CONNECTED
  }
  return account
}

export type WriteCallParams = {
  account: Address
  address: Address
  abi: Abi
  functionName: string
  args: readonly unknown[]
  value?: bigint
}

type WalletWriteCallInput = {
  wallet: Wallet
  address: Address
  abi: Abi
  functionName: string
  args: readonly unknown[]
  value?: bigint
}

function writeCallParams(input: WalletWriteCallInput): WriteCallParams {
  const account = requireWalletAccount(input.wallet)
  return {
    account: getAddress(account.address) as Address,
    address: input.address,
    abi: input.abi,
    functionName: input.functionName,
    args: input.args,
    value: input.value,
  }
}

export function applyGasBuffer(estimatedGas: bigint): bigint {
  if (estimatedGas <= 0n) {
    throw new Error(WALLET_WRITE_ERROR.GAS_ESTIMATE_FAILED)
  }
  return (estimatedGas * GAS_BUFFER_NUMERATOR) / GAS_BUFFER_DENOMINATOR
}

/**
 * Simulate → gas (+20% buffer); on non-revert simulate failure, fall back to
 * wallet then public `estimateContractGas`. Reverts surface before the wallet prompt.
 * Exported for unit tests with injected clients.
 */
export async function estimateWriteGasLimit(
  call: WriteCallParams,
  walletClient: ChainReadClient,
  fallbackClient: ChainReadClient = bscReadClient,
): Promise<bigint> {
  // viem simulate/estimate overloads require concrete ABI function names; dynamic
  // write paths intentionally erase here (same pattern as thirdweb adapters).
  const callRequest = call as never

  try {
    const { request } = await walletClient.simulateContract(callRequest)
    if (request.gas && request.gas > 0n) {
      return applyGasBuffer(request.gas)
    }
  } catch (error) {
    if (isContractRevert(error)) {
      throw normalizeContractRevertError(error, call.abi)
    }

    if (import.meta.env.DEV) {
      const decoded = decodeContractRevert(error, call.abi)
      console.warn('[preflight] simulate skipped (non-revert):', decoded?.errorName ?? error)
    }
  }

  for (const client of [walletClient, fallbackClient]) {
    try {
      const estimated = await client.estimateContractGas(callRequest)
      return applyGasBuffer(estimated)
    } catch (error) {
      if (isContractRevert(error)) {
        throw normalizeContractRevertError(error, call.abi)
      }
    }
  }

  throw new Error(WALLET_WRITE_ERROR.GAS_ESTIMATE_FAILED)
}

async function preflightContractWrite(input: WalletWriteCallInput): Promise<bigint> {
  const call = writeCallParams(input)
  const walletClient = createWalletReadClient(input.wallet)
  return estimateWriteGasLimit(call, walletClient)
}

/**
 * Simulates the write, estimates gas (+ buffer), then submits via wallet `eth_sendTransaction`.
 * Reverts surface before the wallet prompt; gas is set explicitly so wallets need not estimate.
 */
export async function writeContractViaWallet(
  input: WalletWriteCallInput,
): Promise<ConfirmedWalletWrite> {
  const { wallet, address, abi, functionName, args, value } = input
  const account = requireWalletAccount(wallet)
  const intent = createWriteIntent(account.address, defaultChain.id)
  const provider = walletEip1193Provider(wallet)

  const gasLimit = await preflightContractWrite(input)

  const liveAccount = requireWalletAccount(wallet)
  const chainIdHex = await walletProviderRequest<string>({
    provider,
    method: 'eth_chainId',
  })
  assertWriteIntentMatches({
    intent,
    liveAddress: liveAccount.address,
    liveChainId: parseEip1193ChainId(chainIdHex),
  })

  const data = encodeFunctionData({
    abi,
    functionName,
    args,
  } as Parameters<typeof encodeFunctionData>[0])

  let hash: Hash
  try {
    hash = await walletProviderRequest<Hash>({
      provider,
      method: 'eth_sendTransaction',
      params: [
        {
          chainId: numberToHex(defaultChain.id),
          data,
          from: intent.expectedAddress,
          gas: numberToHex(gasLimit),
          to: address,
          ...(value ? { value: numberToHex(value) } : {}),
        },
      ],
      timeoutMessage: 'Wallet closed or did not complete the transaction request',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (/did not (respond|complete)|timed out|timeout/i.test(message)) {
      throw new WalletSubmitUnknownError(WALLET_WRITE_ERROR.SUBMIT_UNKNOWN)
    }
    throw error
  }

  assertWalletTransactionHash(hash)

  const receipt = await waitForWalletTransactionConfirmation({ provider, hash })
  return { ...receipt, transactionHash: hash }
}

/** Parses write ABI lines plus optional custom error definitions from `~/web3/abis`. */
export function parseWriteAbi(signature: string, errors: readonly string[] = []) {
  return parseAbi(errors.length > 0 ? [signature, ...errors] : [signature])
}
