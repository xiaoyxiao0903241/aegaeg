import type { Wallet } from 'thirdweb/wallets'

import {
  confirmTeamRewardClaim,
  requestCommunityFundClaim,
  requestMarketFundClaim,
  requestTeamRewardSignature,
} from '~/shared/api/endpoints'
import { parseTeamRewardClaim } from '~/shared/api/parse-team-reward-claim'
import { requestWithSession } from '~/shared/api/query/session-request'
import type { ClaimConfirmResult } from '~/shared/api/types'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { sleep } from '~/shared/lib/utils'
import { REWARD_CLAIMER_ERRORS, REWARD_CLAIMER_METHODS } from '~/web3/abis'
import { CLAIM_SIGNATURE_EXPIRED } from '~/web3/contract-error-message'
import { writeMarketFundClaim } from '~/web3/rewards/rewards-write'
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

/**
 * 将签名领取参数提交到指定合约的 claimReward。
 *
 * @param wallet 钱包
 * @param contractAddress 领取合约地址
 * @param signType 签名类型
 * @param amount 领取金额（wei）
 * @param expireTime 签名过期时间（unix 秒）
 * @param salt 随机盐
 * @param signature 后端下发的签名
 * @returns 已确认的链上写交易结果
 * @see docs/onchain-manual-legacy.md §4.1 用户操作：签名领奖
 */
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

/**
 * 幂等 confirm：短暂失败按延迟重试，耗尽后抛出最后一次错误。
 *
 * 后端 /claim/confirm 需 salt + txHash；网络抖动时重试提升成功率。
 *
 * @param token 会话 token
 * @param request.salt 签名盐
 * @param request.txHash 链上交易哈希
 * @param onUnauthorized 未授权回调（登出等）
 * @param options.attempts 重试次数，默认 3
 * @param options.delayMs 重试间隔毫秒，默认 800
 * @returns 后端确认结果
 * @see docs/backend-api/api.md #claim/confirm
 */
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

/**
 * 团队奖励签名领取（RewardClaimer.claimReward）。
 *
 * @see docs/backend-api/api.md #claim/team-reward
 */
export const claimTeamReward = createSignedClaim(
  requestTeamRewardSignature,
  claimOnVault(BSC_CONTRACTS.rewardClaimer),
)

/**
 * 社区基金签名领取（CommunityFundVault.claimReward）。
 *
 * @see docs/backend-api/api.md #claim/community-fund
 */
export const claimCommunityFund = createSignedClaim(
  requestCommunityFundClaim,
  claimOnVault(BSC_CONTRACTS.communityFundVault),
)

/** 做市津贴 — OpenAPI 禁 confirm，扫描器核销。 */
export const claimMarketFundReward = createSignedClaim(
  requestMarketFundClaim,
  writeMarketFundClaim,
  {
    skipConfirm: true,
  },
)
