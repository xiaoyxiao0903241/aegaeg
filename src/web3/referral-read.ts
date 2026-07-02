import { getContract, readContract, type ThirdwebClient } from 'thirdweb'
import type { Chain } from 'thirdweb/chains'
import { BSC_CONTRACTS } from '~/config/contracts'
import { REFERRAL_METHODS } from '~/web3/abis'
import { defaultChain, thirdwebClient } from '~/web3/thirdweb'

function getReferralContract(client: ThirdwebClient, chain: Chain) {
  return getContract({ client, chain, address: BSC_CONTRACTS.referral })
}

export async function readIsBindReferral(
  address: string,
  client: ThirdwebClient = thirdwebClient,
  chain: Chain = defaultChain,
): Promise<boolean> {
  const contract = getReferralContract(client, chain)
  return readContract({
    contract,
    method: REFERRAL_METHODS.isBindReferral,
    params: [address],
  })
}

export async function readReferrer(
  address: string,
  client: ThirdwebClient = thirdwebClient,
  chain: Chain = defaultChain,
): Promise<string> {
  const contract = getReferralContract(client, chain)
  return readContract({
    contract,
    method: REFERRAL_METHODS.getReferral,
    params: [address],
  })
}

export async function readReferralCount(
  address: string,
  client: ThirdwebClient = thirdwebClient,
  chain: Chain = defaultChain,
): Promise<bigint> {
  const contract = getReferralContract(client, chain)
  return readContract({
    contract,
    method: REFERRAL_METHODS.getReferralCount,
    params: [address],
  })
}

export async function readReferralChildren(
  address: string,
  client: ThirdwebClient = thirdwebClient,
  chain: Chain = defaultChain,
): Promise<string[]> {
  const contract = getReferralContract(client, chain)
  const children = await readContract({
    contract,
    method: REFERRAL_METHODS.getChildren,
    params: [address],
  })

  return [...children]
}
