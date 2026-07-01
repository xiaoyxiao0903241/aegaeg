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
  requestCommunityFundClaim,
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

export async function claimRewardOnChain({
  account,
  contractAddress,
  signType,
  amount,
  expireTime,
  salt,
  signature,
  client = thirdwebClient,
  chain = defaultChain,
}: {
  account: Account
  contractAddress: `0x${string}`
  signType: bigint
  amount: bigint
  expireTime: bigint
  salt: `0x${string}`
  signature: `0x${string}`
  client?: ThirdwebClient
  chain?: Chain
}) {
  const contract = getContract({ client, chain, address: contractAddress })
  const transaction = prepareContractCall({
    contract,
    method: REWARD_CLAIMER_METHODS.claimReward,
    params: [signType, amount, expireTime, salt, signature],
  })

  return sendAndConfirmTransaction({ account, transaction })
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
  return claimRewardOnChain({
    account,
    contractAddress: BSC_CONTRACTS.rewardClaimer,
    signType,
    amount,
    expireTime,
    salt,
    signature,
    client,
    chain,
  })
}

export async function claimCommunityFundOnChain({
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
  return claimRewardOnChain({
    account,
    contractAddress: BSC_CONTRACTS.communityFundVault,
    signType,
    amount,
    expireTime,
    salt,
    signature,
    client,
    chain,
  })
}

async function executeSignedRewardClaim({
  account,
  token,
  requestSignature,
  claimOnChain,
  client = thirdwebClient,
  chain = defaultChain,
}: {
  account: Account
  token: string
  requestSignature: (token: string) => Promise<TeamRewardClaimPayload>
  claimOnChain: (args: {
    account: Account
    signType: bigint
    amount: bigint
    expireTime: bigint
    salt: `0x${string}`
    signature: `0x${string}`
    client?: ThirdwebClient
    chain?: Chain
  }) => ReturnType<typeof sendAndConfirmTransaction>
  client?: ThirdwebClient
  chain?: Chain
}) {
  const payload = (await requestSignature(token)) as TeamRewardClaimPayload
  const normalized = normalizeTeamRewardClaimPayload(payload)

  const receipt = await claimOnChain({
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
  return executeSignedRewardClaim({
    account,
    token,
    requestSignature: requestTeamRewardSignature,
    claimOnChain: claimTeamRewardOnChain,
    client,
    chain,
  })
}

export async function executeCommunityFundClaim({
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
  return executeSignedRewardClaim({
    account,
    token,
    requestSignature: requestCommunityFundClaim,
    claimOnChain: claimCommunityFundOnChain,
    client,
    chain,
  })
}
