export interface Paginated<T> {
  total: number
  page: number
  page_size: number
  items: T[]
}

export interface PaginationParams {
  page?: number
  page_size?: number
}

export interface LoginRequest {
  address: string
  message: string
  signature: string
}

export interface LoginResponse {
  token: string
}

export interface SalesLogItem {
  id: number
  node_type: number
  amount: string
  reward_percent: number
  tx_hash: string | null
  block_number: number
  block_time: number
  log_index: number
  status: number
  created_at: string | null
}

export interface RewardLogItem {
  id: number
  from_address: string
  to_address: string
  amount: string
  times: string
  tx_hash: string | null
  block_number: number
  block_time: number
  log_index: number
  reward_type: string
  status: number
  created_at: string | null
  updated_at: string | null
}

export interface RewardTotals {
  total: string
  claimed: string
}

export interface UserPerformance {
  address: string
  sales_team_market: string
  team_reward: string
  team_reward_claimed: string
  sum_invest_usdt: string
  presale_volume: string
  presale_rank: number
  presale_referral_reward: string
  direct_presale_volume: string
}

export interface TeamReferralItem {
  address: string
  register_time: string | null
  presale_rank: number
  sales_team_market: string
}

export interface TeamRewardSignature {
  signature: string
  salt?: string
  amount?: string
  amountWei?: string
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
  pending: boolean
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
  }
}
