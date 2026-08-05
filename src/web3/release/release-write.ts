import type { Wallet } from 'thirdweb/wallets'

import { BSC_CONTRACTS } from '~/shared/config/contracts'
import {
  PRINCIPAL_RELEASE_VAULT_ERRORS,
  PRINCIPAL_RELEASE_VAULT_METHODS,
  REWARD_QUEUE_ERRORS,
  REWARD_QUEUE_METHODS,
} from '~/web3/abis'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

const claimAllAbi = parseWriteAbi(REWARD_QUEUE_METHODS.claimAllVestedRewards, REWARD_QUEUE_ERRORS)
const claimManyAbi = parseWriteAbi(
  PRINCIPAL_RELEASE_VAULT_METHODS.claimMany,
  PRINCIPAL_RELEASE_VAULT_ERRORS,
)

/**
 * 领取某释放计划全部已解锁奖励（RewardQueue.claimAllVestedRewards）。
 *
 * @param args.wallet 钱包
 * @param args.planIndex 释放计划 index
 * @returns 已确认的写交易结果
 * @see 手册 §12 RewardQueue 奖励释放队列
 */
export async function writeClaimAllVestedRewards(args: { wallet: Wallet; planIndex: number }) {
  return writeContractViaWallet({
    wallet: args.wallet,
    address: BSC_CONTRACTS.rewardQueue,
    abi: claimAllAbi,
    functionName: 'claimAllVestedRewards',
    args: [args.planIndex],
  })
}

/**
 * 批量领取本金释放（PrincipalReleaseVault.claimMany）。
 *
 * @param args.wallet 钱包
 * @param args.start 起始仓位 index
 * @param args.limit 领取数量上限
 * @returns 已确认的写交易结果
 * @see 手册 §13 PrincipalReleaseVault 本金释放
 */
export async function writeClaimManyReleases(args: {
  wallet: Wallet
  start: number
  limit: number
}) {
  return writeContractViaWallet({
    wallet: args.wallet,
    address: BSC_CONTRACTS.principalReleaseVault,
    abi: claimManyAbi,
    functionName: 'claimMany',
    args: [BigInt(args.start), BigInt(args.limit)],
  })
}
