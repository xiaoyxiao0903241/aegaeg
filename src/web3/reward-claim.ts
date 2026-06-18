import {
  getContract,
  prepareContractCall,
  sendAndConfirmTransaction,
  type ThirdwebClient,
} from 'thirdweb'
import type { Account } from 'thirdweb/wallets'
import type { Chain } from 'thirdweb/chains'
import { BSC_CONTRACTS } from '~/config/contracts'
import {
  confirmTeamRewardClaim,
  requestTeamRewardSignature,
} from '~/lib/api/endpoints'
import type { ClaimConfirmResult } from '~/lib/api/types'
import { normalizeTeamRewardClaimPayload } from '~/lib/api/normalize-claim-payload'
import { REWARD_CLAIMER_METHODS } from '~/web3/abis'
import { defaultChain, thirdwebClient } from '~/web3/thirdweb'

export interface TeamRewardClaimPayload {
  signature: string
  salt?: string
  amount?: string
  amountWei?: string
  amount_wei?: string
  saltHash?: string
}

export async function claimTeamRewardOnChain({
  account,
  salt,
  amount,
  signature,
  client = thirdwebClient,
  chain = defaultChain,
}: {
  account: Account
  salt: `0x${string}`
  amount: bigint
  signature: `0x${string}`
  client?: ThirdwebClient
  chain?: Chain
}) {
  const contract = getContract({ client, chain, address: BSC_CONTRACTS.rewardClaimer })
  const transaction = prepareContractCall({
    contract,
    method: REWARD_CLAIMER_METHODS.claim,
    params: [salt, amount, signature],
  })

  return sendAndConfirmTransaction({ account, transaction })
}

export async function executeTeamRewardClaim({
  account,
  token,
  client = thirdwebClient,
  chain = defaultChain,
}: {
  account: Account
  token: string
  client?: ThirdwebClient
  chain?: Chain
}) {
  const payload = (await requestTeamRewardSignature(token)) as TeamRewardClaimPayload
  const normalized = normalizeTeamRewardClaimPayload(payload)

  const receipt = await claimTeamRewardOnChain({
    account,
    salt: normalized.salt,
    amount: normalized.amountWei,
    signature: normalized.signature,
    client,
    chain,
  })

  const confirmResult = await confirmTeamRewardClaim(token, {
    salt: normalized.salt,
    txHash: receipt.transactionHash,
  })

  return { receipt, confirmResult }
}
