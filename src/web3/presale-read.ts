import { getContract, readContract, type ThirdwebClient } from 'thirdweb'
import type { Chain } from 'thirdweb/chains'
import { decodeAbiParameters, encodeAbiParameters, toFunctionSelector } from 'thirdweb/utils'
import { BSC_CONTRACTS } from '~/config/contracts'
import {
  findActivePresalePhase,
  type PresalePhaseOnChain,
  type PresalePhaseRemaining,
} from '~/lib/presale/presale-math'
import { MULTICALL3_METHODS, PRESALE_METHODS } from '~/web3/abis'
import { defaultChain, thirdwebClient } from '~/web3/thirdweb'

const PHASE_RETURN_TYPES = [
  { type: 'uint256', name: 'minAmount' },
  { type: 'uint256', name: 'maxAmount' },
  { type: 'uint256', name: 'discount' },
  { type: 'uint256', name: 'airdropValueRatio' },
  { type: 'uint256', name: 'startTime' },
  { type: 'uint256', name: 'endTime' },
  { type: 'uint256', name: 'soldAmount' },
  { type: 'uint256', name: 'userPurchaseLimit' },
] as const

const PHASES_CALL_SELECTOR = toFunctionSelector(PRESALE_METHODS.phases)

function getPresaleContract(client: ThirdwebClient, chain: Chain) {
  return getContract({ client, chain, address: BSC_CONTRACTS.preSale })
}

function getMulticall3Contract(client: ThirdwebClient, chain: Chain) {
  return getContract({ client, chain, address: BSC_CONTRACTS.multicall3 })
}

function encodePhaseCallData(phaseIndex: number): `0x${string}` {
  const encodedParams = encodeAbiParameters([{ type: 'uint256' }], [BigInt(phaseIndex)])
  return `${PHASES_CALL_SELECTOR}${encodedParams.slice(2)}`
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
  ]: readonly [
    bigint,
    bigint,
    bigint,
    bigint,
    bigint,
    bigint,
    bigint,
    bigint,
  ],
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
    purchasedAmount: soldAmount,
  }
}

export async function readPresalePhaseCount(
  client: ThirdwebClient = thirdwebClient,
  chain: Chain = defaultChain,
): Promise<number> {
  const contract = getPresaleContract(client, chain)
  const phaseCount = await readContract({
    contract,
    method: PRESALE_METHODS.getPhaseCount,
    params: [],
  })

  return Number(phaseCount)
}

export async function readPresalePhase(
  phaseIndex: number,
  client: ThirdwebClient = thirdwebClient,
  chain: Chain = defaultChain,
): Promise<PresalePhaseOnChain> {
  const contract = getPresaleContract(client, chain)
  const [
    minAmount,
    maxAmount,
    discount,
    airdropValueRatio,
    startTime,
    endTime,
    soldAmount,
    userPurchaseLimit,
  ] = await readContract({
    contract,
    method: PRESALE_METHODS.phases,
    params: [BigInt(phaseIndex)],
  })

  return mapPhaseTupleToOnChain(phaseIndex, [
    minAmount,
    maxAmount,
    discount,
    airdropValueRatio,
    startTime,
    endTime,
    soldAmount,
    userPurchaseLimit,
  ])
}

export async function readAllPresalePhases(
  client: ThirdwebClient = thirdwebClient,
  chain: Chain = defaultChain,
): Promise<PresalePhaseOnChain[]> {
  const phaseCount = await readPresalePhaseCount(client, chain)
  if (phaseCount <= 0) {
    return []
  }

  const multicallContract = getMulticall3Contract(client, chain)
  const calls = Array.from({ length: phaseCount }, (_, phaseIndex) => ({
    target: BSC_CONTRACTS.preSale,
    allowFailure: false,
    callData: encodePhaseCallData(phaseIndex),
  }))

  const results = await readContract({
    contract: multicallContract,
    method: MULTICALL3_METHODS.aggregate3,
    params: [calls],
  })

  return results.map(
    (
      result: { success: boolean; returnData: `0x${string}` },
      phaseIndex: number,
    ) => {
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
    },
  )
}

export async function readActivePresalePhase(
  client: ThirdwebClient = thirdwebClient,
  chain: Chain = defaultChain,
): Promise<PresalePhaseOnChain | null> {
  const phases = await readAllPresalePhases(client, chain)
  return findActivePresalePhase(phases)
}

export async function readUserPhaseRemainingAmount(
  address: string,
  phaseIndex: number,
  client: ThirdwebClient = thirdwebClient,
  chain: Chain = defaultChain,
): Promise<PresalePhaseRemaining> {
  const contract = getPresaleContract(client, chain)
  const [remainingPhaseAmount, remainingUserAmount, userPurchaseLimit, userPhaseAmountCurrent] =
    await readContract({
      contract,
      method: PRESALE_METHODS.getUserPhaseRemainingAmount,
      params: [address, BigInt(phaseIndex)],
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
  client: ThirdwebClient = thirdwebClient,
  chain: Chain = defaultChain,
): Promise<bigint> {
  const contract = getPresaleContract(client, chain)
  return readContract({
    contract,
    method: PRESALE_METHODS.userTotalAmount,
    params: [address],
  })
}

export async function readTotalPresalePurchased(
  client: ThirdwebClient = thirdwebClient,
  chain: Chain = defaultChain,
): Promise<bigint> {
  const contract = getPresaleContract(client, chain)
  return readContract({
    contract,
    method: PRESALE_METHODS.totalPurchasedAmount,
    params: [],
  })
}

export async function readPresaleAirdropThresholdWei(
  client: ThirdwebClient = thirdwebClient,
  chain: Chain = defaultChain,
): Promise<bigint> {
  const contract = getPresaleContract(client, chain)
  return readContract({
    contract,
    method: PRESALE_METHODS.airdropThreshold,
    params: [],
  })
}

export async function readPresaleAgxPriceWei(
  client: ThirdwebClient = thirdwebClient,
  chain: Chain = defaultChain,
): Promise<bigint> {
  const contract = getPresaleContract(client, chain)
  return readContract({
    contract,
    method: PRESALE_METHODS.agxPrice,
    params: [],
  })
}
