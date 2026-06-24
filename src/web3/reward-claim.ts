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
  signType?: string | number
  expireTime?: string | number
}

export async function claimTeamRewardOnChain({
  account,
  signType,
  amount,
  expireTime,
  salt,
  signature,
  client = thirdwebClient,
  chain = defaultChain,
}: {
  account: Account
  signType: bigint
  amount: bigint
  expireTime: bigint
  salt: `0x${string}`
  signature: `0x${string}`
  client?: ThirdwebClient
  chain?: Chain
}) {
  const contract = getContract({ client, chain, address: BSC_CONTRACTS.rewardClaimer })
  const transaction = prepareContractCall({
    contract,
    method: REWARD_CLAIMER_METHODS.claimReward,
    params: [signType, amount, expireTime, salt, signature],
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
    signType: normalized.signType,
    amount: normalized.amountWei,
    expireTime: normalized.expireTime,
    salt: normalized.salt,
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
