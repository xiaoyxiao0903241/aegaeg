import type { Wallet } from 'thirdweb/wallets'
import type { ThirdwebClient } from 'thirdweb'
import type { Chain } from 'thirdweb/chains'
import { BSC_CONTRACTS } from '~/config/contracts'
import { ERC20_METHODS, MAX_UINT256, PRESALE_METHODS } from '~/web3/abis'
import { defaultChain, thirdwebClient } from '~/web3/thirdweb'
import { readErc20Allowance } from '~/web3/swap-read'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet-contract-write'

const erc20WriteAbi = parseWriteAbi(ERC20_METHODS.approve)
const presaleWriteAbi = parseWriteAbi(PRESALE_METHODS.purchase)

export async function approveUsd1ForPresaleIfNeeded({
  wallet,
  amount,
  client = thirdwebClient,
  chain = defaultChain,
}: {
  wallet: Wallet
  amount: bigint
  client?: ThirdwebClient
  chain?: Chain
}) {
  const account = wallet.getAccount()
  if (!account) {
    throw new Error('Wallet not connected')
  }

  const allowance = await readErc20Allowance(
    BSC_CONTRACTS.usd1,
    account.address,
    BSC_CONTRACTS.preSale,
    client,
    chain,
  )

  if (allowance >= amount) return null

  return writeContractViaWallet({
    wallet,
    address: BSC_CONTRACTS.usd1,
    abi: erc20WriteAbi,
    functionName: 'approve',
    args: [BSC_CONTRACTS.preSale, MAX_UINT256],
  })
}

/**
 * Callers are responsible for allowance (see useGenesisWidget's approve step
 * and its pre-purchase check) — no hidden approve here, so the wallet never
 * pops an unexpected second prompt mid-purchase.
 */
export async function purchasePresale({
  wallet,
  phase,
  amount,
}: {
  wallet: Wallet
  phase: number
  amount: bigint
}) {
  return writeContractViaWallet({
    wallet,
    address: BSC_CONTRACTS.preSale,
    abi: presaleWriteAbi,
    functionName: 'purchase',
    args: [BigInt(phase), amount],
  })
}
