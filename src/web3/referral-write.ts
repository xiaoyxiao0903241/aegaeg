import {
  getContract,
  prepareContractCall,
  sendAndConfirmTransaction,
  type ThirdwebClient,
} from 'thirdweb'
import type { Account } from 'thirdweb/wallets'
import type { Chain } from 'thirdweb/chains'
import { BSC_CONTRACTS } from '../config/contracts'
import { REFERRAL_METHODS } from './abis'
import { defaultChain, thirdwebClient } from './thirdweb'

export async function bindReferrer({
  account,
  referrer,
  client = thirdwebClient,
  chain = defaultChain,
}: {
  account: Account
  referrer: `0x${string}`
  client?: ThirdwebClient
  chain?: Chain
}) {
  const contract = getContract({ client, chain, address: BSC_CONTRACTS.referral })
  const transaction = prepareContractCall({
    contract,
    method: REFERRAL_METHODS.bindReferral,
    params: [referrer],
  })

  return sendAndConfirmTransaction({ account, transaction })
}
