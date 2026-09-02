import type { Wallet } from 'thirdweb/wallets'

import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { PRESALE_ERRORS, PRESALE_METHODS } from '~/web3/abis'
import { approveErc20 } from '~/web3/exchange/approve-erc20-if-needed'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

const presaleWriteAbi = parseWriteAbi(PRESALE_METHODS.purchase, PRESALE_ERRORS)

/**
 * 为预售购买给 preSale 授权 USD1。
 *
 * 调用方预检已判定额度不足；此处不再读 allowance。
 *
 * @param wallet 钱包
 * @param amount 需要授权的金额（wei）
 * @returns 已确认的 approve 回执
 */
export async function approveUsd1ForPresaleIfNeeded({
  wallet,
  amount,
}: {
  wallet: Wallet
  amount: bigint
}) {
  return approveErc20({
    wallet,
    token: BSC_CONTRACTS.usd1,
    spender: BSC_CONTRACTS.preSale,
    amountIn: amount,
  })
}

/**
 * 购买预售档位（AegisPreSale.purchase）。
 *
 * 调用方负责额度（见 genesis approve 步与购前检查），此处不隐式 approve，
 * 避免购买中途二次弹窗。
 *
 * @param wallet 钱包
 * @param phase 档位 index
 * @param amount 购买金额（wei）
 * @returns 已确认的写交易结果
 * @see 手册 §6 预售 PreSale
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
