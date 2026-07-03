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
} from '~/lib/web3/decode-contract-revert'
import { createWalletReadClient } from '~/web3/chain-read-client'
import { resolveWalletEip1193Provider } from '~/web3/resolve-wallet-eip1193-provider'
import { assertWalletTransactionHash } from '~/web3/wallet-write-error'
import { walletProviderRequest } from '~/web3/wallet-provider-request'
import { waitForWalletTransactionConfirmation } from '~/web3/wait-wallet-transaction'

export type ConfirmedWalletWrite = TransactionReceipt & { transactionHash: Hash }

function requireWalletAccount(wallet: Wallet) {
  const account = wallet.getAccount()
  if (!account) {
    throw new Error('Wallet not connected')
  }
  return account
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
}) {
  const account = requireWalletAccount(wallet)
  const client = createWalletReadClient(wallet)

  try {
    await client.simulateContract({
      account: getAddress(account.address) as Address,
      address,
      abi,
      functionName,
      args,
      value,
    } as never)
  } catch (error) {
    if (isContractRevert(error)) {
      throw normalizeContractRevertError(error, abi)
    }

    // Wallet WebViews may not support eth_call reliably — do not block the send.
    if (import.meta.env.DEV) {
      const decoded = decodeContractRevert(error, abi)
      console.warn(
        '[preflight] simulate skipped (non-revert):',
        decoded?.errorName ?? error,
      )
    }
  }
}

/**
 * Simulates the write, then submits via wallet `eth_sendTransaction`.
 * Reverts surface before the wallet prompt when simulate succeeds.
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

  await preflightContractWrite({
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

/** Parses write ABI lines plus optional custom error definitions from `~/web3/abis`. */
export function parseWriteAbi(signature: string, errors: readonly string[] = []) {
  return parseAbi(errors.length > 0 ? [signature, ...errors] : [signature])
}
