import { encodeFunctionData, parseAbi } from 'viem'

import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { REFERRAL_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import { decodeAggregate3Result, readAggregate3 } from '~/web3/multicall3-read'

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

type ReferralWalletSnapshot = {
  isBound: boolean
  referrer: string
  directCount: bigint
}

/**
 * 读取当前钱包推荐关系展示快照（绑定态 / 推荐人 / 直邀数）。
 *
 * 三读合并为一次 Multicall3。
 *
 * @param address 钱包地址
 * @returns 绑定态、推荐人、直邀人数
 * @see 手册 §5.3 展示字段
 */
export async function readReferralWalletSnapshot(address: string): Promise<ReferralWalletSnapshot> {
  const user = address as `0x${string}`
  const target = BSC_CONTRACTS.referral
  const results = await readAggregate3([
    {
      target,
      callData: encodeFunctionData({
        abi: referralAbi,
        functionName: 'isBindReferral',
        args: [user],
      }),
    },
    {
      target,
      callData: encodeFunctionData({
        abi: referralAbi,
        functionName: 'getReferral',
        args: [user],
      }),
    },
    {
      target,
      callData: encodeFunctionData({
        abi: referralAbi,
        functionName: 'getReferralCount',
        args: [user],
      }),
    },
  ])
  return {
    isBound: decodeAggregate3Result<boolean>(
      results,
      0,
      referralAbi,
      'isBindReferral',
      'REFERRAL_SNAPSHOT_MULTICALL_FAILED:isBound',
    ),
    referrer: decodeAggregate3Result<string>(
      results,
      1,
      referralAbi,
      'getReferral',
      'REFERRAL_SNAPSHOT_MULTICALL_FAILED:referrer',
    ),
    directCount: decodeAggregate3Result<bigint>(
      results,
      2,
      referralAbi,
      'getReferralCount',
      'REFERRAL_SNAPSHOT_MULTICALL_FAILED:directCount',
    ),
  }
}

type ReferralParentGate = {
  parentBound: boolean
  root: string
}

/**
 * 读取绑定推荐人前的父节点门闸（父是否已绑定 / 协议 root）。
 *
 * @param parent 拟绑定的推荐人地址
 * @returns 父节点绑定态与 root 地址
 * @see 手册 §5 推荐关系 Referral
 */
export async function readReferralParentGate(parent: string): Promise<ReferralParentGate> {
  const target = BSC_CONTRACTS.referral
  const results = await readAggregate3([
    {
      target,
      callData: encodeFunctionData({
        abi: referralAbi,
        functionName: 'isBindReferral',
        args: [parent as `0x${string}`],
      }),
    },
    {
      target,
      callData: encodeFunctionData({ abi: referralAbi, functionName: 'getRootAddress' }),
    },
  ])
  return {
    parentBound: decodeAggregate3Result<boolean>(
      results,
      0,
      referralAbi,
      'isBindReferral',
      'REFERRAL_PARENT_GATE_MULTICALL_FAILED:parentBound',
    ),
    root: decodeAggregate3Result<string>(
      results,
      1,
      referralAbi,
      'getRootAddress',
      'REFERRAL_PARENT_GATE_MULTICALL_FAILED:root',
    ),
  }
}
