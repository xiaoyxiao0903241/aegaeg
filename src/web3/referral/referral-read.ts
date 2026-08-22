import { parseAbi } from 'viem'

import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { REFERRAL_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'

const referralAbi = parseAbi([
  REFERRAL_METHODS.isBindReferral,
  REFERRAL_METHODS.getReferral,
  REFERRAL_METHODS.getReferralCount,
  REFERRAL_METHODS.getRootAddress,
])

/**
 * 查询地址是否已绑定推荐关系
 *
 * 绑定关系是质押 / 债券 / 治理写操作的前置条件，未绑定会被前端阻断。
 *
 * @param address 待检查的钱包地址
 * @returns 已绑定返回 true
 * @see 手册 §5 推荐关系 Referral
 * @see docs/onchain-manual/contracts/referral.md
 */
export async function readIsBindReferral(address: string): Promise<boolean> {
  return bscReadClient.readContract({
    address: BSC_CONTRACTS.referral,
    abi: referralAbi,
    functionName: 'isBindReferral',
    args: [address as `0x${string}`],
  })
}

/**
 * 读取地址绑定的推荐人
 *
 * 返回零地址表示未绑定。
 *
 * @param address 待查询的钱包地址
 * @returns 推荐人地址（未绑定为 0x0）
 * @see 手册 §5.3 展示字段
 * @see docs/onchain-manual/contracts/referral.md
 */
export async function readReferrer(address: string): Promise<string> {
  return bscReadClient.readContract({
    address: BSC_CONTRACTS.referral,
    abi: referralAbi,
    functionName: 'getReferral',
    args: [address as `0x${string}`],
  })
}

/**
 * 读取地址作为推荐人带来的绑定人数
 *
 * @param address 待查询的钱包地址
 * @returns 直接推荐人数
 * @see 手册 §5.3 展示字段
 * @see docs/onchain-manual/contracts/referral.md
 */
export async function readReferralCount(address: string): Promise<bigint> {
  return bscReadClient.readContract({
    address: BSC_CONTRACTS.referral,
    abi: referralAbi,
    functionName: 'getReferralCount',
    args: [address as `0x${string}`],
  })
}

/**
 * 读取推荐树根地址。
 *
 * 绑定推荐人时，父节点可为 root（即使 `isBindReferral(root)` 为 false）。
 *
 * @returns 根节点地址
 * @see 手册 §5.3 展示字段 `getRootAddress`
 * @see docs/onchain-manual/contracts/referral.md
 */
export async function readRootAddress(): Promise<string> {
  return bscReadClient.readContract({
    address: BSC_CONTRACTS.referral,
    abi: referralAbi,
    functionName: 'getRootAddress',
  })
}
