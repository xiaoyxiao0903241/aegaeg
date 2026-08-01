import type { Wallet } from 'thirdweb/wallets'

import { BSC_CONTRACTS } from '~/shared/config/contracts'
import {
  DAO_POOL_METHODS,
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

const marketWriteAbi = parseWriteAbi(MARKET_FUND_METHODS.claimReward, REWARD_CLAIMER_ERRORS)
const daoMixedWriteAbi = parseWriteAbi(DAO_POOL_METHODS.claimRewardsMixed, REWARD_CLAIMER_ERRORS)
const luckyMixedWriteAbi = parseWriteAbi(LUCKY_POOL_METHODS.claimRewardMixed, LUCKY_POOL_ERRORS)

export type SignedClaimArgs = {
  wallet: Wallet
  signType: bigint
  amount: bigint
  expireTime: bigint
  salt: `0x${string}`
  signature: `0x${string}`
}

export async function writeMarketFundClaim(args: SignedClaimArgs): Promise<ConfirmedWalletWrite> {
  return writeContractViaWallet({
    wallet: args.wallet,
    address: BSC_CONTRACTS.marketFund,
    abi: marketWriteAbi,
    functionName: 'claimReward',
    args: [args.signType, args.amount, args.expireTime, args.salt, args.signature],
  })
}

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
