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

/**
 * Submits a contract write via wallet `eth_sendTransaction` (no DApp-side estimateGas).
 * Confirmation polls wallet provider RPC first, then app read RPC; fails fast if never broadcast.
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

/** Parses a single human-readable ABI line from `~/web3/abis`. */
export function parseWriteAbi(signature: string) {
  return parseAbi([signature])
}
