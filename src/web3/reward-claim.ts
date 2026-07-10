import type { Wallet } from 'thirdweb/wallets'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import {
  confirmTeamRewardClaim,
  requestCommunityFundClaim,
  requestTeamRewardSignature,
} from '~/shared/api/endpoints'
import { requestWithSession } from '~/shared/api/query/session-request'
import type { ClaimConfirmResult } from '~/shared/api/types'
import { normalizeTeamRewardClaim } from '~/shared/api/normalize-team-reward-claim'
import { REWARD_CLAIMER_METHODS, REWARD_CLAIMER_ERRORS } from '~/web3/abis'
import { CLAIM_SIGNATURE_EXPIRED } from '~/web3/resolve-contract-error-message'
import { parseWriteAbi, writeContractViaWallet, type ConfirmedWalletWrite } from '~/web3/wallet/wallet-contract-write'

const rewardClaimWriteAbi = parseWriteAbi(REWARD_CLAIMER_METHODS.claimReward, REWARD_CLAIMER_ERRORS)

const CONFIRM_RETRY_ATTEMPTS = 3
const CONFIRM_RETRY_DELAY_MS = 800

export interface TeamRewardClaimSignature {
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
  /** 链上已成功时始终带回，供 confirm 失败 UI 展示。 */
  txHash: string
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
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

/** 幂等 confirm：短暂失败重试；耗尽后抛出最后一次错误。 */
export async function confirmClaimWithRetry(
  token: string,
  request: { salt: string; txHash: string },
  onUnauthorized: () => void,
  options: { attempts?: number; delayMs?: number } = {},
): Promise<ClaimConfirmResult> {
  const attempts = options.attempts ?? CONFIRM_RETRY_ATTEMPTS
  const delayMs = options.delayMs ?? CONFIRM_RETRY_DELAY_MS
  let lastError: unknown

  for (let i = 0; i < attempts; i += 1) {
    try {
      return await requestWithSession(
        (t) => confirmTeamRewardClaim(t, request),
        token,
        onUnauthorized,
      )
    } catch (error) {
      lastError = error
      if (i < attempts - 1) {
        await sleep(delayMs)
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Claim confirm failed', { cause: lastError })
}

async function claimSignedReward({
  wallet,
  token,
  onUnauthorized,
  requestSignature,
  claimOnChain,
}: {
  wallet: Wallet
  token: string
  onUnauthorized: () => void
  requestSignature: (token: string) => Promise<TeamRewardClaimSignature>
  claimOnChain: (args: {
    wallet: Wallet
    signType: bigint
    amount: bigint
    expireTime: bigint
    salt: `0x${string}`
    signature: `0x${string}`
  }) => Promise<ConfirmedWalletWrite>
}): Promise<SignedRewardClaimResult> {
  const payload = (await requestWithSession(
    requestSignature,
    token,
    onUnauthorized,
  )) as TeamRewardClaimSignature
  const normalized = normalizeTeamRewardClaim(payload)
  assertClaimSignatureNotExpired(normalized.expireTime)

  const receipt = await claimOnChain({
    wallet,
    signType: normalized.signType,
    amount: normalized.amountWei,
    expireTime: normalized.expireTime,
    salt: normalized.salt,
    signature: normalized.signature,
  })
  const txHash = receipt.transactionHash

  try {
    const confirmResult = await confirmClaimWithRetry(
      token,
      { salt: normalized.salt, txHash },
      onUnauthorized,
    )
    return { receipt, confirmResult, txHash }
  } catch (confirmError) {
    // 资金已上链；保留 receipt/txHash，由 UI 提示同步失败，禁止当作未领取。
    return { receipt, confirmResult: null, confirmError, txHash }
  }
}

export async function claimTeamReward({
  wallet,
  token,
  onUnauthorized,
}: {
  wallet: Wallet
  token: string
  onUnauthorized: () => void
}) {
  return claimSignedReward({
    wallet,
    token,
    onUnauthorized,
    requestSignature: requestTeamRewardSignature,
    claimOnChain: claimTeamRewardOnChain,
  })
}

export async function claimCommunityFund({
  wallet,
  token,
  onUnauthorized,
}: {
  wallet: Wallet
  token: string
  onUnauthorized: () => void
}) {
  return claimSignedReward({
    wallet,
    token,
    onUnauthorized,
    requestSignature: requestCommunityFundClaim,
    claimOnChain: claimCommunityFundOnChain,
  })
}
