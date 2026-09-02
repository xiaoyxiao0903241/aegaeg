import type { Wallet } from 'thirdweb/wallets'

import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { TURBINE_ERRORS, TURBINE_METHODS } from '~/web3/abis'
import { approveErc20 } from '~/web3/exchange/approve-erc20-if-needed'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

const buyAbi = parseWriteAbi(TURBINE_METHODS.buyAgxAndStartCooldown, TURBINE_ERRORS)
const claimAbi = parseWriteAbi(TURBINE_METHODS.claimCooledGagx, TURBINE_ERRORS)

/** USD1 → Turbine 授权：预检已判定不足后发出 approve，不再读额度。 */
export async function approveUsd1ForTurbineIfNeeded({
  wallet,
  amountIn,
}: {
  wallet: Wallet
  amountIn: bigint
}) {
  return approveErc20({
    wallet,
    token: BSC_CONTRACTS.usd1,
    spender: BSC_CONTRACTS.turbine,
    amountIn,
  })
}

/** 用 USD1 买入 AGX 并开启冷却：调用 Turbine.buyAgxAndStartCooldown。 */
export async function buyAgxAndStartCooldown({
  wallet,
  usdAmount,
}: {
  wallet: Wallet
  usdAmount: bigint
}) {
  return writeContractViaWallet({
    wallet,
    address: BSC_CONTRACTS.turbine,
    abi: buyAbi,
    functionName: 'buyAgxAndStartCooldown',
    args: [usdAmount],
  })
}

/** 领取已冷却的 gAGX：调用 Turbine.claimCooledGagx，按下标领取单条买入。 */
export async function claimCooledGagx({ wallet, index }: { wallet: Wallet; index: number }) {
  return writeContractViaWallet({
    wallet,
    address: BSC_CONTRACTS.turbine,
    abi: claimAbi,
    functionName: 'claimCooledGagx',
    args: [BigInt(index)],
  })
}
