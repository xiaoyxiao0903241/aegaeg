import type { Wallet } from 'thirdweb/wallets'

import { BSC_CONTRACTS } from '~/shared/config/contracts'
import {
  DAO_POOL_METHODS,
  INCENTIVE_POOL_METHODS,
  LUCKY_POOL_ERRORS,
  LUCKY_POOL_METHODS,
  MARKET_FUND_METHODS,
  REWARD_CLAIMER_ERRORS,
} from '~/web3/abis'
import {
  type ConfirmedWalletWrite,
  parseWriteAbi,
  writeContractViaWallet,
} from '~/web3/wallet/wallet-contract-write'

const incentiveWriteAbi = parseWriteAbi(INCENTIVE_POOL_METHODS.claimRewards, REWARD_CLAIMER_ERRORS)
const marketWriteAbi = parseWriteAbi(MARKET_FUND_METHODS.claimReward, REWARD_CLAIMER_ERRORS)
const daoMixedWriteAbi = parseWriteAbi(DAO_POOL_METHODS.claimRewardsMixed, REWARD_CLAIMER_ERRORS)
const luckyMixedWriteAbi = parseWriteAbi(LUCKY_POOL_METHODS.claimRewardMixed, LUCKY_POOL_ERRORS)

/** 签名领取通用参数（与合约 claimReward 形参一一对应）。 */
export type SignedClaimArgs = {
  wallet: Wallet
  signType: bigint
  amount: bigint
  expireTime: bigint
  salt: `0x${string}`
  signature: `0x${string}`
}

/**
 * 参与奖签名领取（IncentivePool.claimRewards，旧路径）。
 *
 * @param args 签名领取参数
 * @returns 已确认的写交易结果
 * @see 手册 §9.5 签名奖励
 */
export async function writeIncentiveClaim(args: SignedClaimArgs): Promise<ConfirmedWalletWrite> {
  return writeContractViaWallet({
    wallet: args.wallet,
    address: BSC_CONTRACTS.incentivePool,
    abi: incentiveWriteAbi,
    functionName: 'claimRewards',
    args: [args.signType, args.amount, args.expireTime, args.salt, args.signature],
  })
}

/**
 * 做市津贴签名领取（MarketFund.claimReward）。
 *
 * @param args 签名领取参数
 * @returns 已确认的写交易结果
 * @see 手册 §9.5 签名奖励
 */
export async function writeMarketFundClaim(args: SignedClaimArgs): Promise<ConfirmedWalletWrite> {
  return writeContractViaWallet({
    wallet: args.wallet,
    address: BSC_CONTRACTS.marketFund,
    abi: marketWriteAbi,
    functionName: 'claimReward',
    args: [args.signType, args.amount, args.expireTime, args.salt, args.signature],
  })
}

/**
 * Dao Mixed 签名领取（DaoPool.claimRewardsMixed），带释放与复投分流。
 *
 * @param args 签名领取参数，外加 releasePlanIndex / restakePlanIndex / restakeBps
 * @returns 已确认的写交易结果
 * @see 手册 §9.3 Mixed 领奖前端流程
 */
export async function writeDaoMixedClaim(
  args: SignedClaimArgs & {
    releasePlanIndex: number
    restakePlanIndex: number
    restakeBps: number
  },
): Promise<ConfirmedWalletWrite> {
  return writeContractViaWallet({
    wallet: args.wallet,
    address: BSC_CONTRACTS.daoPool,
    abi: daoMixedWriteAbi,
    functionName: 'claimRewardsMixed',
    args: [
      args.signType,
      args.amount,
      args.expireTime,
      args.salt,
      args.signature,
      args.releasePlanIndex,
      BigInt(args.restakePlanIndex),
      BigInt(args.restakeBps),
    ],
  })
}

/**
 * 幸运奖 Mixed 领取（LuckyPool.claimRewardMixed），带释放与复投分流。
 *
 * @param args.wallet 钱包
 * @param args.roundId 中奖轮 id
 * @param args.releasePlanIndex 释放计划 index
 * @param args.restakePlanIndex 复投计划 index
 * @param args.restakeBps 复投比例（0–10000）
 * @returns 已确认的写交易结果
 * @see 手册 §14 LuckyPool 去中心化抽奖
 */
export async function writeLuckyMixedClaim(args: {
  wallet: Wallet
  roundId: bigint
  releasePlanIndex: number
  restakePlanIndex: number
  restakeBps: number
}): Promise<ConfirmedWalletWrite> {
  return writeContractViaWallet({
    wallet: args.wallet,
    address: BSC_CONTRACTS.luckyPool,
    abi: luckyMixedWriteAbi,
    functionName: 'claimRewardMixed',
    args: [
      args.roundId,
      args.releasePlanIndex,
      BigInt(args.restakePlanIndex),
      BigInt(args.restakeBps),
    ],
  })
}
