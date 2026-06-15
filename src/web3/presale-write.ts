import {
  getContract,
  prepareContractCall,
  sendAndConfirmTransaction,
  type ThirdwebClient,
} from 'thirdweb'
import type { Account } from 'thirdweb/wallets'
import type { Chain } from 'thirdweb/chains'
import { BSC_CONTRACTS } from '../config/contracts'
import { ERC20_METHODS, MAX_UINT256, PRESALE_METHODS } from './abis'
import { defaultChain, thirdwebClient } from './thirdweb'
import { readErc20Allowance } from './swap-read'

export async function approveUsd1ForPresaleIfNeeded({
  account,
  amount,
  client = thirdwebClient,
  chain = defaultChain,
}: {
  account: Account
  amount: bigint
  client?: ThirdwebClient
  chain?: Chain
}) {
  const allowance = await readErc20Allowance(
    BSC_CONTRACTS.usd1,
    account.address,
    BSC_CONTRACTS.preSale,
    client,
    chain,
  )

  if (allowance >= amount) return null

  const contract = getContract({ client, chain, address: BSC_CONTRACTS.usd1 })
  const transaction = prepareContractCall({
    contract,
    method: ERC20_METHODS.approve,
    params: [BSC_CONTRACTS.preSale, MAX_UINT256],
  })

  return sendAndConfirmTransaction({ account, transaction })
}

export async function purchasePresale({
  account,
  phase,
  amount,
  client = thirdwebClient,
  chain = defaultChain,
}: {
  account: Account
  phase: number
  amount: bigint
  client?: ThirdwebClient
  chain?: Chain
}) {
  await approveUsd1ForPresaleIfNeeded({ account, amount, client, chain })

  const contract = getContract({ client, chain, address: BSC_CONTRACTS.preSale })
  const transaction = prepareContractCall({
    contract,
    method: PRESALE_METHODS.purchase,
    params: [BigInt(phase), amount],
  })

  return sendAndConfirmTransaction({ account, transaction })
}
