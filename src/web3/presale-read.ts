import { getContract, readContract, type ThirdwebClient } from 'thirdweb'
import type { Chain } from 'thirdweb/chains'
import { BSC_CONTRACTS } from '../config/contracts'
import { PRESALE_CONFIG } from '../config/presale'
import { findActivePresalePhase, type PresalePhaseOnChain } from '../lib/presale/presale-math'
import { PRESALE_METHODS } from './abis'
import { defaultChain, thirdwebClient } from './thirdweb'

function getPresaleContract(client: ThirdwebClient, chain: Chain) {
  return getContract({ client, chain, address: BSC_CONTRACTS.preSale })
}

export async function readPresalePhase(
  phaseIndex: number,
  client: ThirdwebClient = thirdwebClient,
  chain: Chain = defaultChain,
): Promise<PresalePhaseOnChain> {
  const contract = getPresaleContract(client, chain)
  const [minAmount, maxAmount, discountBps, startTime, endTime, purchasedAmount] =
    await readContract({
      contract,
      method: PRESALE_METHODS.phases,
      params: [BigInt(phaseIndex)],
    })

  return {
    index: phaseIndex,
    minAmount,
    maxAmount,
    discountBps,
    startTime,
    endTime,
    purchasedAmount,
  }
}

export async function readAllPresalePhases(
  client: ThirdwebClient = thirdwebClient,
  chain: Chain = defaultChain,
): Promise<PresalePhaseOnChain[]> {
  return Promise.all(
    Array.from({ length: PRESALE_CONFIG.phaseCount }, (_, index) =>
      readPresalePhase(index, client, chain),
    ),
  )
}

export async function readActivePresalePhase(
  client: ThirdwebClient = thirdwebClient,
  chain: Chain = defaultChain,
): Promise<PresalePhaseOnChain | null> {
  const phases = await readAllPresalePhases(client, chain)
  return findActivePresalePhase(phases)
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
