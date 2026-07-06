import {
  encodeFunctionData,
  numberToHex,
  parseAbi,
  type Abi,
  type Address,
  type Hash,
  type TransactionReceipt,
} from 'viem'
import { bsc } from 'viem/chains'
import type { Wallet } from 'thirdweb/wallets'
import { getAddress } from 'thirdweb/utils'
import {
  decodeContractRevert,
  isContractRevert,
  normalizeContractRevertError,
} from '~/views/dapp/web3/decode-contract-revert'
import { WALLET_WRITE_ERROR } from '~/views/dapp/web3/resolve-contract-error-message'
import { createWalletReadClient } from '~/views/dapp/web3/chain-read-client'
import { bscReadClient } from '~/views/dapp/web3/bsc-read-client'
import { resolveWalletEip1193Provider } from '~/views/dapp/web3/resolve-wallet-eip1193-provider'
import { assertWalletTransactionHash } from '~/views/dapp/web3/wallet-write-error'
import { walletProviderRequest } from '~/views/dapp/web3/wallet-provider-request'
import { waitForWalletTransactionConfirmation } from '~/views/dapp/web3/wait-wallet-transaction'

export type ConfirmedWalletWrite = TransactionReceipt & { transactionHash: Hash }

/** +20% headroom so marginal state drift between estimate and mine still succeeds. */
const GAS_BUFFER_NUMERATOR = 120n
const GAS_BUFFER_DENOMINATOR = 100n

function requireWalletAccount(wallet: Wallet) {
  const account = wallet.getAccount()
  if (!account) {
    throw new Error('Wallet not connected')
  }
  return account
}

type WriteCallParams = {
  account: Address
  address: Address
  abi: Abi
  functionName: string
  args: readonly unknown[]
  value?: bigint
}

function buildWriteCallParams({
  wallet,
  address,
  abi,
  functionName,
  args,
  value,
}: {
  wallet: Wallet
  address: Address
  abi: Abi
  functionName: string
  args: readonly unknown[]
  value?: bigint
}): WriteCallParams {
  const account = requireWalletAccount(wallet)
  return {
    account: getAddress(account.address) as Address,
    address,
    abi,
    functionName,
    args,
    value,
  }
}

export function applyGasBuffer(estimatedGas: bigint): bigint {
  if (estimatedGas <= 0n) {
    throw new Error(WALLET_WRITE_ERROR.GAS_ESTIMATE_FAILED)
  }
  return (estimatedGas * GAS_BUFFER_NUMERATOR) / GAS_BUFFER_DENOMINATOR
}

async function estimateWriteGasLimit(
  call: WriteCallParams,
  walletClient: ReturnType<typeof createWalletReadClient>,
): Promise<bigint> {
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
      console.warn(
        '[preflight] simulate skipped (non-revert):',
        decoded?.errorName ?? error,
      )
    }
  }

  const estimators = [walletClient, bscReadClient] as const
  for (const client of estimators) {
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

async function preflightContractWrite({
  wallet,
  address,
  abi,
  functionName,
  args,
  value,
}: {
  wallet: Wallet
  address: Address
  abi: Abi
  functionName: string
  args: readonly unknown[]
  value?: bigint
}): Promise<bigint> {
  const call = buildWriteCallParams({ wallet, address, abi, functionName, args, value })
  const walletClient = createWalletReadClient(wallet)
  return estimateWriteGasLimit(call, walletClient)
}

/**
 * Simulates the write, estimates gas (+ buffer), then submits via wallet `eth_sendTransaction`.
 * Reverts surface before the wallet prompt; gas is set explicitly so wallets need not estimate.
 */
export async function writeContractViaWallet({
  wallet,
  address,
  abi,
  functionName,
  args,
  value,
}: {
  wallet: Wallet
  address: Address
  abi: Abi
  functionName: string
  args: readonly unknown[]
  value?: bigint
}): Promise<ConfirmedWalletWrite> {
  const account = requireWalletAccount(wallet)
  const provider = resolveWalletEip1193Provider(wallet)

  const gasLimit = await preflightContractWrite({
    wallet,
    address,
    abi,
    functionName,
    args,
    value,
  })

  const data = encodeFunctionData({
    abi,
    functionName,
    args,
  } as Parameters<typeof encodeFunctionData>[0])

  const hash = await walletProviderRequest<Hash>({
    provider,
    method: 'eth_sendTransaction',
    params: [
      {
        chainId: numberToHex(bsc.id),
        data,
        from: getAddress(account.address),
        gas: numberToHex(gasLimit),
        to: address,
        ...(value ? { value: numberToHex(value) } : {}),
      },
    ],
    timeoutMessage: 'Wallet closed or did not complete the transaction request',
  })

  assertWalletTransactionHash(hash)

  const receipt = await waitForWalletTransactionConfirmation({ provider, hash })
  return { ...receipt, transactionHash: hash }
}

/** Parses write ABI lines plus optional custom error definitions from `~/views/dapp/web3/abis`. */
export function parseWriteAbi(signature: string, errors: readonly string[] = []) {
  return parseAbi(errors.length > 0 ? [signature, ...errors] : [signature])
}
