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
