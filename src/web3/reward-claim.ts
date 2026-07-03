import type { Wallet } from 'thirdweb/wallets'
import { BSC_CONTRACTS } from '~/config/contracts'
import {
  confirmTeamRewardClaim,
  requestCommunityFundClaim,
  requestTeamRewardSignature,
} from '~/lib/api/endpoints'
import { normalizeTeamRewardClaimPayload } from '~/lib/api/normalize-claim-payload'
import { REWARD_CLAIMER_METHODS, REWARD_CLAIMER_ERRORS } from '~/web3/abis'
import { parseWriteAbi, writeContractViaWallet, type ConfirmedWalletWrite } from '~/web3/wallet-contract-write'

const rewardClaimWriteAbi = parseWriteAbi(REWARD_CLAIMER_METHODS.claimReward, REWARD_CLAIMER_ERRORS)

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
  wallet,
  contractAddress,
  signType,
  amount,
  expireTime,
  salt,
  signature,
}: {
  wallet: Wallet
  contractAddress: `0x${string}`
  signType: bigint
  amount: bigint
  expireTime: bigint
  salt: `0x${string}`
  signature: `0x${string}`
}) {
  return writeContractViaWallet({
    wallet,
    address: contractAddress,
    abi: rewardClaimWriteAbi,
    functionName: 'claimReward',
    args: [signType, amount, expireTime, salt, signature],
  })
}

export async function claimTeamRewardOnChain({
  wallet,
  signType,
  amount,
  expireTime,
  salt,
  signature,
}: {
  wallet: Wallet
  signType: bigint
  amount: bigint
  expireTime: bigint
  salt: `0x${string}`
  signature: `0x${string}`
}) {
  return claimRewardOnChain({
    wallet,
    contractAddress: BSC_CONTRACTS.rewardClaimer,
    signType,
    amount,
    expireTime,
    salt,
    signature,
  })
}

export async function claimCommunityFundOnChain({
  wallet,
  signType,
  amount,
  expireTime,
  salt,
  signature,
}: {
  wallet: Wallet
  signType: bigint
  amount: bigint
  expireTime: bigint
  salt: `0x${string}`
  signature: `0x${string}`
}) {
  return claimRewardOnChain({
    wallet,
    contractAddress: BSC_CONTRACTS.communityFundVault,
    signType,
    amount,
    expireTime,
    salt,
    signature,
  })
}

async function executeSignedRewardClaim({
  wallet,
  token,
  requestSignature,
  claimOnChain,
}: {
  wallet: Wallet
  token: string
  requestSignature: (token: string) => Promise<TeamRewardClaimPayload>
  claimOnChain: (args: {
    wallet: Wallet
    signType: bigint
    amount: bigint
    expireTime: bigint
    salt: `0x${string}`
    signature: `0x${string}`
  }) => Promise<ConfirmedWalletWrite>
}) {
  const payload = (await requestSignature(token)) as TeamRewardClaimPayload
  const normalized = normalizeTeamRewardClaimPayload(payload)

  const receipt = await claimOnChain({
    wallet,
    signType: normalized.signType,
    amount: normalized.amountWei,
    expireTime: normalized.expireTime,
    salt: normalized.salt,
    signature: normalized.signature,
  })

  const confirmResult = await confirmTeamRewardClaim(token, {
    salt: normalized.salt,
    txHash: receipt.transactionHash,
  })

  return { receipt, confirmResult }
}

export async function executeTeamRewardClaim({
  wallet,
  token,
}: {
  wallet: Wallet
  token: string
}) {
  return executeSignedRewardClaim({
    wallet,
    token,
    requestSignature: requestTeamRewardSignature,
    claimOnChain: claimTeamRewardOnChain,
  })
}

export async function executeCommunityFundClaim({
  wallet,
  token,
}: {
  wallet: Wallet
  token: string
}) {
  return executeSignedRewardClaim({
    wallet,
    token,
    requestSignature: requestCommunityFundClaim,
    claimOnChain: claimCommunityFundOnChain,
  })
}
