export interface AssetsHoldingsDistribution {
  stake_total_agx: string
  bond_lp: string
  bond_burn: string
  stake_x_pool: string
}

export interface AssetsHoldingsSummary {
  total_holdings_agx: string
  total_released_agx: string
  buffer_pool_cumulative: string
  buffer_pool_released: string
  buffer_pool_releasing: string
  stake_redeemed_agx: string
}

export interface AssetsRewardSummary {
  stake_invest_usd_value: string
  claimable_gagx: string
  market_fund_claimable_agx: string
  total_reward_claimed: string
  available_contribution: string
}

/** POST /assets/product-invest-reward · 单产品已领收益与实际投资 */
export interface AssetsProductInvestRewardBucket {
  claimed_reward: string
  invest_amount: string
}

/** 四类产品各自的已领取收益与实际投资（缺类型时桶内字段为 "0"） */
export interface AssetsProductInvestReward {
  stake: AssetsProductInvestRewardBucket
  lp_bond: AssetsProductInvestRewardBucket
  burn_bond: AssetsProductInvestRewardBucket
  x_mining: AssetsProductInvestRewardBucket
}
