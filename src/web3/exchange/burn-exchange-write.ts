import type { Wallet } from 'thirdweb/wallets'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { AGX_CONTRIBUTION_SWAP_ERRORS, AGX_CONTRIBUTION_SWAP_METHODS } from '~/web3/abis'
import { approveErc20IfNeeded } from '~/web3/exchange/approve-erc20-if-needed'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

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
  return approveErc20IfNeeded({
    wallet,
    token: BSC_CONTRACTS.agx,
    spender: BSC_CONTRACTS.agxContributionSwap,
    amountIn,
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
