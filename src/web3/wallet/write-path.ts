/**
 * 写路径 id：错误 toast 的 ctx 键。
 */
export const WRITE_PATH = {
  /** 历史字面量 `'swap'`，禁改（错误 ctx）。 */
  EXCHANGE: 'swap',
  GENESIS: 'genesis',
  REWARD_LUCKY_MIXED: 'reward-lucky-mixed',
  REWARD_DAO_MIXED: 'reward-dao-mixed',
  REWARD_SIGNED_CLAIM: 'reward-signed-claim',
  /** AGX 活期 / 锁仓质押开仓。 */
  STAKING: 'staking',
  /** BondHelper LP / Burn zap。 */
  BOND_ZAP: 'bond-zap',
  /** XStakingPool gAGX 挖矿质押。 */
  XMINE: 'xmine',
  /** Assets Mixed 领取 / 赎回 / xmine 领取与解押。 */
  ASSETS_CLAIM: 'assets-claim',
  /** Release 队列归属领取 / buffer PRV 领取。 */
  RELEASE_CLAIM: 'release-claim',
  /** ReferralRegistry.bindReferrer。 */
  REFERRAL_BIND: 'referral-bind',
} as const

export type WritePath = (typeof WRITE_PATH)[keyof typeof WRITE_PATH]
