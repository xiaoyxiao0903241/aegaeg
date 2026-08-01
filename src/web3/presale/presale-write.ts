import type { Wallet } from 'thirdweb/wallets'

import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { PRESALE_ERRORS, PRESALE_METHODS } from '~/web3/abis'
import { approveErc20IfNeeded } from '~/web3/exchange/approve-erc20-if-needed'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

const presaleWriteAbi = parseWriteAbi(PRESALE_METHODS.purchase, PRESALE_ERRORS)

export async function approveUsd1ForPresaleIfNeeded({
  wallet,
  amount,
}: {
  wallet: Wallet
  amount: bigint
}) {
  return approveErc20IfNeeded({
    wallet,
    token: BSC_CONTRACTS.usd1,
    spender: BSC_CONTRACTS.preSale,
    amountIn: amount,
  })
}

/**
 * 调用方负责额度（见 genesis approve 步与购前检查）——此处不隐式 approve，避免购中途二次弹窗。
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
