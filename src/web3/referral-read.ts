import { parseAbi } from 'viem'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { REFERRAL_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'

const referralAbi = parseAbi([
  REFERRAL_METHODS.isBindReferral,
  REFERRAL_METHODS.getReferral,
  REFERRAL_METHODS.getReferralCount,
])

export async function readIsBindReferral(
  address: string,
  client: ChainReadClient = bscReadClient,
): Promise<boolean> {
  return client.readContract({
    address: BSC_CONTRACTS.referral,
    abi: referralAbi,
    functionName: 'isBindReferral',
    args: [address as `0x${string}`],
  })
}

export async function readReferrer(
  address: string,
  client: ChainReadClient = bscReadClient,
): Promise<string> {
  return client.readContract({
    address: BSC_CONTRACTS.referral,
    abi: referralAbi,
    functionName: 'getReferral',
    args: [address as `0x${string}`],
  })
}

export async function readReferralCount(
  address: string,
  client: ChainReadClient = bscReadClient,
): Promise<bigint> {
  return client.readContract({
    address: BSC_CONTRACTS.referral,
    abi: referralAbi,
    functionName: 'getReferralCount',
    args: [address as `0x${string}`],
  })
}
