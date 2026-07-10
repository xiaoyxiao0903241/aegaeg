import type { Wallet } from 'thirdweb/wallets'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import {
  confirmTeamRewardClaim,
  requestCommunityFundClaim,
  requestTeamRewardSignature,
} from '~/shared/api/endpoints'
import type { ClaimConfirmResult } from '~/shared/api/types'
import { normalizeTeamRewardClaimPayload } from '~/shared/api/normalize-claim-payload'
import { REWARD_CLAIMER_METHODS, REWARD_CLAIMER_ERRORS } from '~/views/dapp/web3/abis'
import { CLAIM_SIGNATURE_EXPIRED } from '~/views/dapp/web3/resolve-contract-error-message'
import { parseWriteAbi, writeContractViaWallet, type ConfirmedWalletWrite } from '~/views/dapp/web3/wallet-contract-write'

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

export type SignedRewardClaimResult = {
  receipt: ConfirmedWalletWrite
  confirmResult: ClaimConfirmResult | null
  confirmError?: unknown
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

function assertClaimSignatureNotExpired(expireTime: bigint, nowSeconds = Math.floor(Date.now() / 1000)) {
  if (expireTime <= BigInt(nowSeconds)) {
    throw new Error(CLAIM_SIGNATURE_EXPIRED)
  }
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
}): Promise<SignedRewardClaimResult> {
  const payload = (await requestSignature(token)) as TeamRewardClaimPayload
  const normalized = normalizeTeamRewardClaimPayload(payload)
  assertClaimSignatureNotExpired(normalized.expireTime)

  const receipt = await claimOnChain({
    wallet,
    signType: normalized.signType,
    amount: normalized.amountWei,
    expireTime: normalized.expireTime,
    salt: normalized.salt,
    signature: normalized.signature,
  })

  try {
    const confirmResult = await confirmTeamRewardClaim(token, {
      salt: normalized.salt,
      txHash: receipt.transactionHash,
    })
    return { receipt, confirmResult }
  } catch (confirmError) {
    // Funds already moved on-chain — surface sync failure without discarding the receipt.
    return { receipt, confirmResult: null, confirmError }
  }
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
