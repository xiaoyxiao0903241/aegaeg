import { decodeAbiParameters, encodeFunctionData, parseAbi, type AbiParameter } from 'viem'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { type PresalePhaseOnChain, type PresalePhaseRemaining } from '~/core/presale/presale-math'
import { MULTICALL3_METHODS, PRESALE_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'

const presaleAbi = parseAbi([
  PRESALE_METHODS.getPhaseCount,
  PRESALE_METHODS.phases,
  PRESALE_METHODS.getUserPhaseRemainingAmount,
  PRESALE_METHODS.userTotalAmount,
  PRESALE_METHODS.totalPurchasedAmount,
  PRESALE_METHODS.agxPrice,
  PRESALE_METHODS.airdropThreshold,
  PRESALE_METHODS.paused,
])

const multicallAbi = parseAbi([MULTICALL3_METHODS.aggregate3])

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

export async function readPresalePhaseCount(
  client: ChainReadClient = bscReadClient,
): Promise<number> {
  const phaseCount = await client.readContract({
    address: BSC_CONTRACTS.preSale,
    abi: presaleAbi,
    functionName: 'getPhaseCount',
  })

  return Number(phaseCount)
}

export async function readAllPresalePhases(
  client: ChainReadClient = bscReadClient,
): Promise<PresalePhaseOnChain[]> {
  const phaseCount = await readPresalePhaseCount(client)
  if (phaseCount <= 0) {
    return []
  }

  const calls = Array.from({ length: phaseCount }, (_, phaseIndex) => ({
    target: BSC_CONTRACTS.preSale,
    allowFailure: false,
    callData: encodePhaseCallData(phaseIndex),
  }))

  const results = (await client.readContract({
    address: BSC_CONTRACTS.multicall3,
    abi: multicallAbi,
    functionName: 'aggregate3',
    args: [calls],
  })) as { success: boolean; returnData: `0x${string}` }[]

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

export async function readUserPhaseRemainingAmount(
  address: string,
  phaseIndex: number,
  client: ChainReadClient = bscReadClient,
): Promise<PresalePhaseRemaining> {
  const [remainingPhaseAmount, remainingUserAmount, userPurchaseLimit, userPhaseAmountCurrent] =
    await client.readContract({
      address: BSC_CONTRACTS.preSale,
      abi: presaleAbi,
      functionName: 'getUserPhaseRemainingAmount',
      args: [address as `0x${string}`, BigInt(phaseIndex)],
    })

  return {
    remainingPhaseAmount,
    remainingUserAmount,
    userPurchaseLimit,
    userPhaseAmountCurrent,
  }
}

export async function readUserPresaleTotal(
  address: string,
  client: ChainReadClient = bscReadClient,
): Promise<bigint> {
  return client.readContract({
    address: BSC_CONTRACTS.preSale,
    abi: presaleAbi,
    functionName: 'userTotalAmount',
    args: [address as `0x${string}`],
  })
}

export async function readTotalPresalePurchased(
  client: ChainReadClient = bscReadClient,
): Promise<bigint> {
  return client.readContract({
    address: BSC_CONTRACTS.preSale,
    abi: presaleAbi,
    functionName: 'totalPurchasedAmount',
  })
}

export async function readPresaleAirdropThresholdWei(
  client: ChainReadClient = bscReadClient,
): Promise<bigint> {
  return client.readContract({
    address: BSC_CONTRACTS.preSale,
    abi: presaleAbi,
    functionName: 'AIRDROP_THRESHOLD',
  })
}

export async function readPresaleAgxPriceWei(
  client: ChainReadClient = bscReadClient,
): Promise<bigint> {
  return client.readContract({
    address: BSC_CONTRACTS.preSale,
    abi: presaleAbi,
    functionName: 'agxPrice',
  })
}

export async function readPresalePaused(client: ChainReadClient = bscReadClient): Promise<boolean> {
  return client.readContract({
    address: BSC_CONTRACTS.preSale,
    abi: presaleAbi,
    functionName: 'paused',
  })
}
