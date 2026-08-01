import type { Wallet } from 'thirdweb/wallets'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import {
  AGX_CONTRIBUTION_SWAP_ERRORS,
  AGX_CONTRIBUTION_SWAP_METHODS,
  ERC20_ERRORS,
  ERC20_METHODS,
} from '~/web3/abis'
import { createWalletReadClient } from '~/web3/chain-read-client'
import { readErc20Allowance } from '~/web3/exchange/exchange-read'
import { WALLET_BLOCKED } from '~/web3/errors/sentinels'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

const erc20WriteAbi = parseWriteAbi(ERC20_METHODS.approve, ERC20_ERRORS)
const burnSwapWriteAbi = parseWriteAbi(
  AGX_CONTRIBUTION_SWAP_METHODS.convert,
  AGX_CONTRIBUTION_SWAP_ERRORS,
)

export async function approveAgxForBurnExchangeIfNeeded({
  wallet,
  amountIn,
}: {
  wallet: Wallet
  amountIn: bigint
}) {
  const account = wallet.getAccount()
  if (!account) {
    throw WALLET_BLOCKED.NOT_CONNECTED
  }

  const readClient = createWalletReadClient(wallet)
  const allowance = await readErc20Allowance(
    BSC_CONTRACTS.agx,
    account.address,
    BSC_CONTRACTS.agxContributionSwap,
    readClient,
  )
  if (allowance >= amountIn) return null

  return writeContractViaWallet({
    wallet,
    address: BSC_CONTRACTS.agx,
    abi: erc20WriteAbi,
    functionName: 'approve',
    args: [BSC_CONTRACTS.agxContributionSwap, amountIn],
  })
}

export async function burnExchangeConvert({
  wallet,
  agxAmount,
}: {
  wallet: Wallet
  agxAmount: bigint
}) {
  return writeContractViaWallet({
    wallet,
    address: BSC_CONTRACTS.agxContributionSwap,
    abi: burnSwapWriteAbi,
    functionName: 'convert',
    args: [agxAmount],
  })
}
