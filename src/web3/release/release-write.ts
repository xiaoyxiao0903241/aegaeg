import type { Wallet } from 'thirdweb/wallets'
import type { Address } from 'viem'

import { BSC_CONTRACTS } from '~/shared/config/contracts'
import {
  AEGIS_SPLITTER_ERRORS,
  AEGIS_SPLITTER_METHODS,
  PRINCIPAL_RELEASE_VAULT_ERRORS,
  PRINCIPAL_RELEASE_VAULT_METHODS,
  REWARD_QUEUE_ERRORS,
  REWARD_QUEUE_METHODS,
} from '~/web3/abis'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

const claimInRangeAbi = parseWriteAbi(
  REWARD_QUEUE_METHODS.claimVestedRewardsInRange,
  REWARD_QUEUE_ERRORS,
)
const splitterClaimManyAbi = parseWriteAbi(AEGIS_SPLITTER_METHODS.claimMany, AEGIS_SPLITTER_ERRORS)
const archiveClaimManyAbi = parseWriteAbi(
  PRINCIPAL_RELEASE_VAULT_METHODS.claimMany,
  PRINCIPAL_RELEASE_VAULT_ERRORS,
)

/**
 * 分页领取指定计划已解锁奖励（RewardQueue.claimVestedRewardsInRange）。
 *
 * @param args.wallet 钱包
 * @param args.planIndex 释放计划 index
 * @param args.start 队列起始 index
 * @param args.limit 本页条数上限
 * @returns 已确认的写交易结果
 * @see 手册 §12 RewardQueue 奖励释放队列
 */
export async function writeClaimVestedRewardsInRange(args: {
  wallet: Wallet
  planIndex: number
  start: number
  limit: number
}) {
  return writeContractViaWallet({
    wallet: args.wallet,
    address: BSC_CONTRACTS.rewardQueue,
    abi: claimInRangeAbi,
    functionName: 'claimVestedRewardsInRange',
    args: [args.planIndex, BigInt(args.start), BigInt(args.limit)],
  })
}

/**
 * 批量领取本金释放（现行分流器 AegisSplitter.claimMany）。
 *
 * @param args.wallet 钱包
 * @param args.splitter 用户头部分流器地址
 * @param args.start 起始仓位 index
 * @param args.limit 领取数量上限
 * @see 手册 §13 分流器本金释放
 */
export async function writeClaimManyReleases(args: {
  wallet: Wallet
  splitter: Address
  start: number
  limit: number
}) {
  return writeContractViaWallet({
    wallet: args.wallet,
    address: args.splitter,
    abi: splitterClaimManyAbi,
    functionName: 'claimMany',
    args: [BigInt(args.start), BigInt(args.limit)],
  })
}

/**
 * 批量领取归档 PrincipalReleaseVault 历史释放单。
 *
 * @see 手册 §13（归档 ABI）
 */
export async function writeClaimManyArchiveReleases(args: {
  wallet: Wallet
  start: number
  limit: number
}) {
  return writeContractViaWallet({
    wallet: args.wallet,
    address: BSC_CONTRACTS.principalReleaseVault,
    abi: archiveClaimManyAbi,
    functionName: 'claimMany',
    args: [BigInt(args.start), BigInt(args.limit)],
  })
}
