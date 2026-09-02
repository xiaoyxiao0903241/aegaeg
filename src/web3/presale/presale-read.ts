import { type AbiParameter, decodeAbiParameters, encodeFunctionData, parseAbi } from 'viem'

import { migrationStakeRoot } from '~/core/migration/migration-user'
import { type PresalePhaseOnChain, type PresalePhaseRemaining } from '~/core/presale/presale-math'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { PRESALE_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import { readMigratedFrom } from '~/web3/migration/migration-read'
import { readAggregate3 } from '~/web3/multicall3-read'

const presaleAbi = parseAbi([
  PRESALE_METHODS.getPhaseCount,
  PRESALE_METHODS.phases,
  PRESALE_METHODS.getUserPhaseRemainingAmount,
  PRESALE_METHODS.userTotalAmount,
  PRESALE_METHODS.totalPurchasedAmount,
  PRESALE_METHODS.agxPrice,
  PRESALE_METHODS.airdropThreshold,
  PRESALE_METHODS.previewAirdropValue,
  PRESALE_METHODS.paused,
])

const PHASE_RETURN_TYPES = [
  { type: 'uint256', name: 'minAmount' },
  { type: 'uint256', name: 'maxAmount' },
  { type: 'uint256', name: 'discount' },
  { type: 'uint256', name: 'airdropValueRatio' },
  { type: 'uint256', name: 'startTime' },
  { type: 'uint256', name: 'endTime' },
  { type: 'uint256', name: 'soldAmount' },
  { type: 'uint256', name: 'userPurchaseLimit' },
] as const satisfies readonly AbiParameter[]

function encodePhaseCallData(phaseIndex: number): `0x${string}` {
  return encodeFunctionData({
    abi: presaleAbi,
    functionName: 'phases',
    args: [BigInt(phaseIndex)],
  })
}

function mapPhaseTupleToOnChain(
  phaseIndex: number,
  [
    minAmount,
    maxAmount,
    discount,
    airdropValueRatio,
    startTime,
    endTime,
    soldAmount,
    userPurchaseLimit,
  ]: readonly [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint],
): PresalePhaseOnChain {
  return {
    index: phaseIndex,
    minAmount,
    maxAmount,
    discountBps: discount,
    airdropValueRatio,
    startTime,
    endTime,
    soldAmount,
    userPurchaseLimit,
  }
}

/**
 * 读取预售档位总数（AegisPreSale.getPhaseCount）。
 *
 * @returns 档位数
 * @see 手册 §6 预售 PreSale
 */
export async function readPresalePhaseCount(): Promise<number> {
  const phaseCount = await bscReadClient.readContract({
    address: BSC_CONTRACTS.preSale,
    abi: presaleAbi,
    functionName: 'getPhaseCount',
  })

  return Number(phaseCount)
}

/**
 * 批量读取全部预售档位。
 *
 * 各档 phases() 合并为一次 Multicall3，任一档读取失败即抛错。
 *
 * @returns 全部档位数组；无档位时为空数组
 * @see 手册 §6 预售 PreSale
 */
export async function readAllPresalePhases(): Promise<PresalePhaseOnChain[]> {
  const phaseCount = await readPresalePhaseCount()
  if (phaseCount <= 0) {
    return []
  }

  const results = await readAggregate3(
    Array.from({ length: phaseCount }, (_, phaseIndex) => ({
      target: BSC_CONTRACTS.preSale,
      callData: encodePhaseCallData(phaseIndex),
    })),
  )

  return results.map((result, phaseIndex) => {
    if (!result.success) {
      throw new Error(`Failed to read presale phase ${phaseIndex} via multicall`)
    }

    const decoded = decodeAbiParameters(PHASE_RETURN_TYPES, result.returnData) as readonly [
      bigint,
      bigint,
      bigint,
      bigint,
      bigint,
      bigint,
      bigint,
      bigint,
    ]

    return mapPhaseTupleToOnChain(phaseIndex, decoded)
  })
}

/**
 * 读取用户在指定档位的剩余可购额度。
 *
 * 额度按迁移 root 键控，须先解析 root 再调 view，与 userTotalAmount 同口径。
 *
 * @param address 钱包地址
 * @param phaseIndex 档位 index
 * @returns 档位/个人剩余额度与个人限购
 * @see 手册 §6 预售 PreSale
 */
export async function readUserPhaseRemainingAmount(
  address: string,
  phaseIndex: number,
): Promise<PresalePhaseRemaining> {
  // 手册 presale.md：额度查询先解析首次 root，再调 view（与 userTotalAmount 同口径）。
  const migratedFrom = await readMigratedFrom(address)
  const root = migrationStakeRoot(address, migratedFrom) as `0x${string}`
  const [remainingPhaseAmount, remainingUserAmount, userPurchaseLimit, userPhaseAmountCurrent] =
    await bscReadClient.readContract({
      address: BSC_CONTRACTS.preSale,
      abi: presaleAbi,
      functionName: 'getUserPhaseRemainingAmount',
      args: [root, BigInt(phaseIndex)],
    })

  return {
    remainingPhaseAmount,
    remainingUserAmount,
    userPurchaseLimit,
    userPhaseAmountCurrent,
  }
}

/**
 * 读取用户预售累计购买额（wei）。
 *
 * userTotalAmount 为按迁移 root 键控的 public mapping，须先解析 root。
 *
 * @param address 钱包地址
 * @returns 累计购买额（wei）
 * @see 手册 §6 预售 PreSale
 */
export async function readUserPresaleTotal(address: string): Promise<bigint> {
  // `userTotalAmount` 为按首次 root 键控的 public mapping。
  const migratedFrom = await readMigratedFrom(address)
  const root = migrationStakeRoot(address, migratedFrom) as `0x${string}`
  return bscReadClient.readContract({
    address: BSC_CONTRACTS.preSale,
    abi: presaleAbi,
    functionName: 'userTotalAmount',
    args: [root],
  })
}

/**
 * 读取全网预售累计购买额（AegisPreSale.totalPurchasedAmount）。
 *
 * @returns 累计购买额（wei）
 * @see 手册 §6 预售 PreSale
 */
export async function readTotalPresalePurchased(): Promise<bigint> {
  return bscReadClient.readContract({
    address: BSC_CONTRACTS.preSale,
    abi: presaleAbi,
    functionName: 'totalPurchasedAmount',
  })
}

/**
 * 读取空投门槛（AegisPreSale.AIRDROP_THRESHOLD，wei）。
 *
 * @returns 空投门槛（wei）
 * @see 手册 §6 预售 PreSale
 */
export async function readPresaleAirdropThresholdWei(): Promise<bigint> {
  return bscReadClient.readContract({
    address: BSC_CONTRACTS.preSale,
    abi: presaleAbi,
    functionName: 'AIRDROP_THRESHOLD',
  })
}

/**
 * 读取预售 AGX 单价（AegisPreSale.agxPrice，wei）。
 *
 * @returns 单价（wei）
 * @see 手册 §6 预售 PreSale
 */
export async function readPresaleAgxPriceWei(): Promise<bigint> {
  return bscReadClient.readContract({
    address: BSC_CONTRACTS.preSale,
    abi: presaleAbi,
    functionName: 'agxPrice',
  })
}

/**
 * 读取预售暂停状态（AegisPreSale.paused）。
 *
 * @returns 暂停时返回 true
 * @see 手册 §6 预售 PreSale
 */
export async function readPresalePaused(): Promise<boolean> {
  return bscReadClient.readContract({
    address: BSC_CONTRACTS.preSale,
    abi: presaleAbi,
    functionName: 'paused',
  })
}

/**
 * 预估某笔购买可新增的空投价值（previewAirdropValue）。
 *
 * 仅取返回的 addedAirdropValue（wei），页面按 18 位小数转 USD 展示。
 *
 * @param user 钱包地址（可为零地址）
 * @param phaseIndex 档位 index
 * @param purchaseAmount 拟购金额（wei）
 * @returns 新增空投价值（wei）
 * @see 手册 §6 预售 PreSale
 */
export async function readPreviewAirdropValue(
  user: string,
  phaseIndex: number,
  purchaseAmount: bigint,
): Promise<bigint> {
  const [addedAirdropValue] = await bscReadClient.readContract({
    address: BSC_CONTRACTS.preSale,
    abi: presaleAbi,
    functionName: 'previewAirdropValue',
    args: [user as `0x${string}`, BigInt(phaseIndex), purchaseAmount],
  })
  return addedAirdropValue
}
