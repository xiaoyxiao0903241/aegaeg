import type { Wallet } from 'thirdweb/wallets'

import {
  confirmTeamRewardClaim,
  requestCommunityFundClaim,
  requestIncentiveClaim,
  requestMarketFundClaim,
  requestTeamRewardSignature,
} from '~/shared/api/endpoints'
import { parseTeamRewardClaim } from '~/shared/api/parse-team-reward-claim'
import { requestWithSession } from '~/shared/api/query/session-request'
import type { ClaimConfirmResult } from '~/shared/api/types'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { sleep } from '~/shared/lib/sleep'
import { REWARD_CLAIMER_ERRORS, REWARD_CLAIMER_METHODS } from '~/web3/abis'
import { CLAIM_SIGNATURE_EXPIRED } from '~/web3/contract-error-message'
import { writeIncentiveClaim, writeMarketFundClaim } from '~/web3/rewards/rewards-write'
import {
  type ConfirmedWalletWrite,
  parseWriteAbi,
  writeContractViaWallet,
} from '~/web3/wallet/wallet-contract-write'

const claimRewardWriteAbi = parseWriteAbi(REWARD_CLAIMER_METHODS.claimReward, REWARD_CLAIMER_ERRORS)

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
    abi: claimRewardWriteAbi,
    functionName: 'claimReward',
    args: [signType, amount, expireTime, salt, signature],
  })
}

type ClaimOnChainArgs = {
  wallet: Wallet
  signType: bigint
  amount: bigint
  expireTime: bigint
  salt: `0x${string}`
  signature: `0x${string}`
}

function claimOnVault(contractAddress: `0x${string}`) {
  return (args: ClaimOnChainArgs) => claimRewardOnChain({ ...args, contractAddress })
}

function assertClaimSignatureNotExpired(
  expireTime: bigint,
  nowSeconds = Math.floor(Date.now() / 1000),
) {
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

  throw lastError instanceof Error
    ? lastError
    : new Error('Claim confirm failed', { cause: lastError })
}

async function claimSignedReward({
  wallet,
  token,
  onUnauthorized,
  requestSignature,
  claimOnChain,
  skipConfirm = false,
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
  /** OpenAPI：order_type=5（做市）等由扫描器核销，禁止调 /claim/confirm。 */
  skipConfirm?: boolean
}): Promise<SignedRewardClaimResult> {
  const payload = (await requestWithSession(
    requestSignature,
    token,
    onUnauthorized,
  )) as TeamRewardClaimSignature
  const normalized = parseTeamRewardClaim(payload)
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

  if (skipConfirm) {
    return { receipt, confirmResult: null, txHash }
  }

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

type SignedClaimOnChain = (args: {
  wallet: Wallet
  signType: bigint
  amount: bigint
  expireTime: bigint
  salt: `0x${string}`
  signature: `0x${string}`
}) => Promise<ConfirmedWalletWrite>

function createSignedClaim(
  requestSignature: (token: string) => Promise<TeamRewardClaimSignature>,
  claimOnChain: SignedClaimOnChain,
  options?: { skipConfirm?: boolean },
) {
  return (args: { wallet: Wallet; token: string; onUnauthorized: () => void }) =>
    claimSignedReward({
      ...args,
      requestSignature,
      claimOnChain,
      skipConfirm: options?.skipConfirm,
    })
}

export const claimTeamReward = createSignedClaim(
  requestTeamRewardSignature,
  claimOnVault(BSC_CONTRACTS.rewardClaimer),
)

export const claimCommunityFund = createSignedClaim(
  requestCommunityFundClaim,
  claimOnVault(BSC_CONTRACTS.communityFundVault),
)

/** 参与奖 — IncentivePool 简单签（旧路径；不走 Dao Mixed）。 */
export const claimIncentiveReward = createSignedClaim(requestIncentiveClaim, writeIncentiveClaim)

/** 做市津贴 — OpenAPI 禁 confirm，扫描器核销。 */
export const claimMarketFundReward = createSignedClaim(
  requestMarketFundClaim,
  writeMarketFundClaim,
  {
    skipConfirm: true,
  },
)
