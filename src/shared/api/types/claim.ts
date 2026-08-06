export type DaoRewardType =
  'RANK_REWARD' | 'REFERRAL_REWARD' | 'PARTICIPATION_REWARD' | 'SURPASS_REWARD' | 'LIFETIME_REWARD'

/** OpenAPI `/claim/dao-reward`：RANK=41 … LIFETIME=45（取代手册 DaoPool 的 signType=4）。 */
export const DAO_REWARD_SIGN_TYPE = {
  RANK_REWARD: 41n,
  REFERRAL_REWARD: 42n,
  PARTICIPATION_REWARD: 43n,
  SURPASS_REWARD: 44n,
  LIFETIME_REWARD: 45n,
} as const satisfies Record<DaoRewardType, bigint>

export type DaoGrantStatus = 'READY' | 'RESERVED' | 'PARTIALLY_CLAIMED' | 'CLAIMED' | 'CANCELLED'

export interface ClaimSignatureServiceRequest {
  contract?: string
  account?: string
  amount?: string
  salt?: string
  expireTime?: number
  signType?: number
}

export interface ClaimSignatureServiceResponse {
  code?: number
  message?: string
  data?: string
}

export interface TeamRewardSignature {
  signature: string
  /**
   * 链上 claimReward(signType, amount, expireTime, salt, signature) 需要这些字段；
   * 后端基于这些值签名，因此必须原样返回。字段名在 parseTeamRewardClaim 中宽松匹配。
   */
  salt?: string
  amount?: string
  amountWei?: string
  signType?: string | number
  expireTime?: string | number
  contract?: string
  account?: string
  rewardType?: DaoRewardType | string
  signatureServiceRequest?: ClaimSignatureServiceRequest | null
  signatureServiceResponse?: ClaimSignatureServiceResponse | null
}

export interface ClaimConfirmRequest {
  salt: string
  txHash: string
}

export interface ClaimConfirmOrder {
  id: number
  orderType: number
  salt: string
  amount: string
  amountWei: string
  status: number
  claimTxHash: string | null
  claimBlock: number | null
  claimedAt: string | null
}

export interface ClaimConfirmResult {
  confirmed: boolean
  alreadyConfirmed: boolean
  ignored: boolean
  reason?: string
  txHash: string
  order: ClaimConfirmOrder
  summary?: {
    team_reward: {
      distributed: string
      claimed: string
      pending: string
    }
    market_team_reward?: {
      distributed: string
    }
    presale_team_reward?: {
      distributed: string
    }
  }
}

export interface ClaimParseSignatureRequest {
  signature: string
  contract: string
  salt: string
  account: string
  amount: string
  expireTime: number
  signType: number
}

export interface ClaimParseSignatureResult {
  contract: string
  account: string
  amount: string
  amountDecimal: string
  salt: string
  saltRaw: string
  expireTime: number
  signType: number
  signature: string
  innerHash: string
  ethSignedHash: string
  recoveredSigner: string
  signatureServiceRequest?: ClaimSignatureServiceRequest
}
