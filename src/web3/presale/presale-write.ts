import type { Wallet } from 'thirdweb/wallets'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { ERC20_METHODS, PRESALE_METHODS, ERC20_ERRORS, PRESALE_ERRORS } from '~/web3/abis'
import { createWalletReadClient } from '~/web3/chain-read-client'
import { readErc20Allowance } from '~/web3/exchange/exchange-read'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

const erc20WriteAbi = parseWriteAbi(ERC20_METHODS.approve, ERC20_ERRORS)
const presaleWriteAbi = parseWriteAbi(PRESALE_METHODS.purchase, PRESALE_ERRORS)

export async function approveUsd1ForPresaleIfNeeded({
  wallet,
  amount,
}: {
  wallet: Wallet
  amount: bigint
}) {
  const account = wallet.getAccount()
  if (!account) {
    throw new Error('Wallet not connected')
  }

  const readClient = createWalletReadClient(wallet)
  const allowance = await readErc20Allowance(
    BSC_CONTRACTS.usd1,
    account.address,
    BSC_CONTRACTS.preSale,
    readClient,
  )

  if (allowance >= amount) return null

  return writeContractViaWallet({
    wallet,
    address: BSC_CONTRACTS.usd1,
    abi: erc20WriteAbi,
    functionName: 'approve',
    args: [BSC_CONTRACTS.preSale, amount],
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
