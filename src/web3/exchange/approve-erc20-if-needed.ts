import type { Wallet } from 'thirdweb/wallets'
import { ERC20_ERRORS, ERC20_METHODS } from '~/web3/abis'
import { createWalletReadClient } from '~/web3/chain-read-client'
import { readErc20Allowance } from '~/web3/exchange/exchange-read'
import { WALLET_BLOCKED } from '~/web3/errors/sentinels'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

const erc20WriteAbi = parseWriteAbi(ERC20_METHODS.approve, ERC20_ERRORS)

/** Fail-closed ERC20 approve when allowance is below intended spend. */
export async function approveErc20IfNeeded({
  wallet,
  token,
  spender,
  amountIn,
}: {
  wallet: Wallet
  token: `0x${string}`
  spender: `0x${string}`
  amountIn: bigint
}) {
  const account = wallet.getAccount()
  if (!account) {
    throw WALLET_BLOCKED.NOT_CONNECTED
  }

  const readClient = createWalletReadClient(wallet)
  const allowance = await readErc20Allowance(token, account.address, spender, readClient)
  if (allowance >= amountIn) return null

  return writeContractViaWallet({
    wallet,
    address: token,
    abi: erc20WriteAbi,
    functionName: 'approve',
    args: [spender, amountIn],
  })
}
