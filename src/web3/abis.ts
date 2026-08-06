/** ERC20 标准方法（balanceOf / allowance / approve / decimals / mint）。 */
export const ERC20_METHODS = {
  balanceOf: 'function balanceOf(address owner) view returns (uint256)',
  allowance: 'function allowance(address owner, address spender) view returns (uint256)',
  approve: 'function approve(address spender, uint256 amount) returns (bool)',
  decimals: 'function decimals() view returns (uint8)',
  mint: 'function mint(address to, uint256 amount)',
} as const

/**
 * PancakeSwap V2 Router — USD1↔AGX 兑换。
 * @see 手册 §7.1 PancakeRouter 买 AGX
 */
export const PANCAKE_ROUTER_V2_METHODS = {
  getAmountsOut:
    'function getAmountsOut(uint256 amountIn, address[] path) view returns (uint256[] amounts)',
  swapExactTokensForTokens:
    'function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline) returns (uint256[] amounts)',
  /**
   * AGX→USD1 卖出：AGX 卖税计入交易对。
   * @see docs/onchain-manual/contracts/agx.md
   */
  swapExactTokensForTokensSupportingFeeOnTransferTokens:
    'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)',
} as const

/**
 * AGX 卖税查询方法。
 * @see docs/onchain-manual/contracts/agx.md
 */
export const AGX_SELL_TAX_METHODS = {
  sellRatio: 'function sellRatio() view returns (uint256)',
  extraSellBP: 'function extraSellBP() view returns (uint256)',
  crashFuseActive: 'function crashFuseActive() view returns (bool)',
  blockSellQuotaBlock: 'function blockSellQuotaBlock() view returns (uint256)',
  blockSellLimit: 'function blockSellLimit() view returns (uint256)',
  grossSoldInBlock: 'function grossSoldInBlock() view returns (uint256)',
} as const

/**
 * Pancake V2 交易对 — 储备与实时价格影响计算。
 * @see docs/onchain-manual/contracts/pancakepair.md
 */
export const PANCAKE_PAIR_V2_METHODS = {
  token0: 'function token0() view returns (address)',
  token1: 'function token1() view returns (address)',
  getReserves:
    'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  totalSupply: 'function totalSupply() view returns (uint256)',
} as const

/**
 * AegisPreSale — 预售档位 / 额度 / 购买。
 * @see 手册 §6 预售 PreSale
 */
export const PRESALE_METHODS = {
  getPhaseCount: 'function getPhaseCount() view returns (uint256)',
  phases:
    'function phases(uint256 phase) view returns (uint256 minAmount, uint256 maxAmount, uint256 discount, uint256 airdropValueRatio, uint256 startTime, uint256 endTime, uint256 soldAmount, uint256 userPurchaseLimit)',
  getUserPhaseRemainingAmount:
    'function getUserPhaseRemainingAmount(address _user, uint256 _phaseIndex) view returns (uint256 remainingPhaseAmount, uint256 remainingUserAmount, uint256 userPurchaseLimit, uint256 userPhaseAmountCurrent)',
  userTotalAmount: 'function userTotalAmount(address user) view returns (uint256)',
  totalPurchasedAmount: 'function totalPurchasedAmount() view returns (uint256)',
  agxPrice: 'function agxPrice() view returns (uint256)',
  airdropThreshold: 'function AIRDROP_THRESHOLD() view returns (uint256)',
  previewAirdropValue:
    'function previewAirdropValue(address _user, uint256 _phaseIndex, uint256 _purchaseAmount) view returns (uint256 addedAirdropValue, uint256 phaseAirdropValueAfter, uint256 phaseAmountAfter, bool qualifiedAfter)',
  paused: 'function paused() view returns (bool)',
  purchase: 'function purchase(uint256 _phaseIndex, uint256 _amount)',
} as const

/** Multicall3 — 批量 eth_call，允许部分调用失败。 */
export const MULTICALL3_METHODS = {
  aggregate3:
    'function aggregate3((address target, bool allowFailure, bytes callData)[] calls) payable returns ((bool success, bytes returnData)[] returnData)',
} as const

/**
 * AegisReferral — 推荐关系查询 / 绑定。
 * @see 手册 §5 推荐关系 Referral
 */
export const REFERRAL_METHODS = {
  isBindReferral: 'function isBindReferral(address user) view returns (bool)',
  getReferral: 'function getReferral(address user) view returns (address)',
  getReferralCount: 'function getReferralCount(address user) view returns (uint256)',
  getChildren: 'function getChildren(address user) view returns (address[])',
  bindReferral: 'function bindReferral(address referrer)',
} as const

/**
 * AccountMigrationManager — 迁移状态查询（本期只读，写操作延后）。
 * @see 手册 §17 账户迁移
 */
export const ACCOUNT_MIGRATION_METHODS = {
  migrationEnabled: 'function migrationEnabled() view returns (bool)',
  isOldAccount: 'function isOldAccount(address account) view returns (bool)',
  migratedFrom: 'function migratedFrom(address account) view returns (address)',
} as const

/**
 * AegisUsd1Swap — USDT→USD1 兑换。
 * @see docs/onchain-manual/contracts/usd1swap.md
 */
export const USD1_SWAP_METHODS = {
  quoteUsd1Out: 'function quoteUsd1Out(uint256 usdtAmount) view returns (uint256)',
  swap: 'function swap(uint256 usdtAmount, uint256 minUsd1Out)',
  rateBps: 'function rateBps() view returns (uint256)',
  paused: 'function paused() view returns (bool)',
  getConfig:
    'function getConfig() view returns (address usdtToken, address usd1Token, address wallet, uint256 currentRateBps, uint8 usdtDec, uint8 usd1Dec, bool isPaused, uint256 minIn, uint256 maxIn, uint256 reserve)',
} as const

/**
 * AegisUsd1Swap 自定义错误。
 * @see docs/onchain-manual/contracts/usd1swap.md
 */
export const USD1_SWAP_ERRORS = [
  'error ErrorPaused()',
  'error ErrorInsufficientUsd1(uint256 available, uint256 required)',
  'error ErrorBelowMin(uint256 amount, uint256 minAmount)',
  'error ErrorAboveMax(uint256 amount, uint256 maxAmount)',
  'error ErrorInsufficientOutput(uint256 actual, uint256 minRequired)',
  'error ErrorTransferAmountMismatch(address token, uint256 expected, uint256 actual)',
  'error ErrorZeroAddress()',
  'error ErrorSameToken()',
  'error ErrorZeroAmount()',
  'error ErrorZeroRate()',
  'error ErrorCallerNotAuthorized()',
  'error ErrorInvalidLimits(uint256 minAmount, uint256 maxAmount)',
] as const

/**
 * AegisAgxContributionSwap — 销毁 AGX 换贡献值。
 * @see 手册 §9.2 贡献值页面
 */
export const AGX_CONTRIBUTION_SWAP_METHODS = {
  quoteContributionOut: 'function quoteContributionOut(uint256 agxAmount) view returns (uint256)',
  getConfig:
    'function getConfig() view returns (address agxToken, uint8 decimals_, uint256 rateBps_, bool isPaused, uint256 minIn, uint256 maxIn, uint256 totalBurned, uint256 totalContribution)',
  getSplitConfig:
    'function getSplitConfig() view returns (address injector, uint256 splitBps, uint256 totalIn, uint256 totalBurned, uint256 totalInjected)',
  originalOf: 'function originalOf(address account) view returns (address)',
  userContribution: 'function userContribution(address user) view returns (uint256)',
  userAgxBurned: 'function userAgxBurned(address user) view returns (uint256)',
  userContributionConsumed:
    'function userContributionConsumed(address user) view returns (uint256)',
  quoteRequiredContribution:
    'function quoteRequiredContribution(uint256 rewardAmount) view returns (uint256)',
  convert: 'function convert(uint256 agxAmount)',
} as const

/**
 * AegisAgxContributionSwap 自定义错误。
 * @see docs/onchain-manual/contracts/agxcontributionswap.md
 */
export const AGX_CONTRIBUTION_SWAP_ERRORS = [
  'error ErrorPaused()',
  'error ErrorZeroAmount()',
  'error ErrorBelowMin(uint256 amount, uint256 minAmount)',
  'error ErrorAboveMax(uint256 amount, uint256 maxAmount)',
  'error ErrorInsufficientContribution(address user, uint256 available, uint256 required)',
  'error ErrorCallerNotAuthorized()',
  'error ErrorZeroAddress()',
  'error ErrorZeroRate()',
  'error ErrorInvalidLimits(uint256 minAmount, uint256 maxAmount)',
  'error ErrorAccountMigrated(address oldAccount)',
] as const

/**
 * AegisTurbineVestingHub — 解锁 / 领取。
 * @see 手册 §16 Turbine
 */
export const TURBINE_METHODS = {
  turbineBalances: 'function turbineBalances(address user) view returns (uint256)',
  silencesSize: 'function silencesSize(address user) view returns (uint256)',
  silences:
    'function silences(address user, uint256 index) view returns (uint256 silenceBalance, uint256 startTime)',
  isVested: 'function isVested(address user, uint256 index) view returns (bool)',
  currentCooldownDuration: 'function currentCooldownDuration() view returns (uint256)',
  quoteUsdInForAgxOut: 'function quoteUsdInForAgxOut(uint256 agxAmount) view returns (uint256)',
  /** 合约内 swap 滑点（BPS）· owner `setSwapConfig`；用户不可改。 */
  swapSlippageBP: 'function swapSlippageBP() view returns (uint256)',
  buyAgxAndStartCooldown: 'function buyAgxAndStartCooldown(uint256 usdAmount)',
  claimCooledGagx: 'function claimCooledGagx(uint256 index)',
} as const

/**
 * AegisTurbineVestingHub 自定义错误。
 * @see docs/onchain-manual/contracts/turbine.md
 */
export const TURBINE_ERRORS = [
  'error ErrorInsufficientBalance()',
  'error ErrorSilentTime()',
  'error ErrorNoSilenceBalance()',
  'error ErrorInvalidAmount()',
  'error ErrorZeroAddress()',
  'error ErrorZeroAmount()',
  'error ErrorIndexOutOfBounds()',
  'error ErrorNotAvailable()',
  'error ErrorNotAuthorized()',
] as const

/**
 * AegisRedeemableGAGX — gAGX↔AGX 封装 / 赎回。
 * @see docs/onchain-manual/contracts/redeemablegagx.md
 */
export const REDEEMABLE_GAGX_METHODS = {
  redeem: 'function redeem(uint256 _amount)',
  wrap: 'function wrap(uint256 _amount)',
} as const

/**
 * RedeemableGAGX 自定义错误。
 * @see docs/onchain-manual/contracts/redeemablegagx.md
 */
export const REDEEMABLE_GAGX_ERRORS = [
  'error ErrorZeroAddress()',
  'error ErrorZeroAmount()',
  'error ErrorNotAuthorized()',
] as const

/**
 * LiquidStaking — AGX 活期质押。
 * @see 手册 §8.2 活期 LiquidStaking
 */
export const LIQUID_STAKING_METHODS = {
  liquidStake: 'function liquidStake(uint256 amount)',
  claim: 'function claim()',
  remainingStakeAmount: 'function remainingStakeAmount() view returns (uint256)',
  isWarmupExpired: 'function isWarmupExpired(address user) view returns (bool)',
} as const

/**
 * LiquidStaking 自定义错误。
 * @see docs/onchain-manual/contracts/liquidstaking.md
 */
export const LIQUID_STAKING_ERRORS = [
  'error ErrorStakeAmount()',
  'error ErrorStakeNotApproved()',
  'error ErrorStakeAmountLimit()',
  'error ErrorStakeNotExists()',
  'error ErrorStakeWarmupNotEnded()',
  'error ErrorStakeAmountExceedsBalance()',
  'error ErrorStakeAmountExceedsInterest()',
  'error ErrorStakeInterestAmountZero()',
  'error ErrorAlreadyMigrated()',
  'error ErrorPrincipalReleaseVaultNotSet()',
] as const

/**
 * LockedStaking — AGX 定期质押。
 * @see 手册 §8.3 定期 LockedStaking
 */
export const LOCKED_STAKING_METHODS = {
  lockedStake: 'function lockedStake(uint256 amount)',
  remainingStakeAmount: 'function remainingStakeAmount() view returns (uint256)',
  status: 'function status() view returns (bool)',
  singleAddressLimit: 'function singleAddressLimit() view returns (uint256)',
  userStakingAmounts: 'function userStakingAmounts(address account) view returns (uint256)',
  periodTime: 'function periodTime() view returns (uint256)',
} as const

/**
 * LockedStaking 自定义错误。
 * @see docs/onchain-manual/contracts/lockedstaking.md
 */
export const LOCKED_STAKING_ERRORS = [
  'error ErrorAmountZero()',
  'error ErrorStakeNotApproved()',
  'error ErrorStakeAmountLimit()',
  'error ErrorIndexOutOfBounds()',
  'error ErrorStakeNotExist()',
  'error ErrorStakeWarmupPeriod()',
  'error ErrorNotPrincipal()',
  'error ErrorExceedsBalance()',
  'error ErrorExtraAmount()',
  'error ErrorZeroAddress()',
  'error ErrorPrincipalReleaseVaultNotSet()',
] as const

/**
 * BondHelper — LP / Burn 债券 zap 辅助。
 * @see 手册 §10 债券 Bond / BurnBond
 */
export const BOND_HELPER_METHODS = {
  authContracts: 'function authContracts(address target) view returns (bool)',
  slippage: 'function slippage() view returns (uint256)',
  zapIntoLiquidityBond:
    'function zapIntoLiquidityBond(address bondDepository, address token, uint256 amount)',
  zapIntoBurnBond:
    'function zapIntoBurnBond(address burnBondDepository, address token, uint256 amount)',
} as const

/**
 * BondHelper 自定义错误。
 * @see docs/onchain-manual/contracts/bondhelper.md
 */
export const BOND_HELPER_ERRORS = [
  'error ErrorNotApproved()',
  'error ErrorPairNotExist()',
  'error ErrorInvalidBalance()',
  'error ErrorInvalidBondAmount()',
  'error ErrorZeroAmount()',
  'error ErrorZeroAddress()',
] as const

/**
 * XStakingPool — gAGX 挖矿。
 * @see 手册 §15 XStakingPool X 挖矿
 */
export const X_STAKING_POOL_METHODS = {
  miningQuotaOf: 'function miningQuotaOf(address user) view returns (uint256)',
  stakeGagxForMining: 'function stakeGagxForMining(uint256 amount)',
  activateWarmup: 'function activateWarmup()',
  pendingReward: 'function pendingReward(address user) view returns (uint256)',
  /**
   * pending 的 AGX/gAGX 价值口径。
   * @see 手册 §15.3 展示字段
   */
  pendingRewardValue: 'function pendingRewardValue(address user) view returns (uint256)',
  miningStakeAmountOf: 'function miningStakeAmountOf(address user) view returns (uint256)',
  /**
   * X/AGX 价格比（1e18 标度，X per AGX）。
   * @see docs/onchain-manual/contracts/xstakingpool.md
   */
  xPerAgx: 'function xPerAgx() view returns (uint256)',
  /** 按天计息 BP；日收益率% = BP / 100 */
  yieldRateBP: 'function yieldRateBP() view returns (uint256)',
  /** 活跃质押 gons（与 gAGX 9 位同刻度展示） */
  activeGons: 'function activeGons() view returns (uint256)',
  stakes:
    'function stakes(address user) view returns (uint256 gons, uint256 warmupGons, uint256 warmupStartTime, uint256 warmupEndTime, uint256 rewardStartTime)',
  claimReward: 'function claimReward()',
  startUnstake: 'function startUnstake()',
} as const

/**
 * XStakingPool 自定义错误。
 * @see docs/onchain-manual/contracts/xstakingpool.md
 */
export const X_STAKING_POOL_ERRORS = [
  'error ErrorAmountZero()',
  'error ErrorStakeNotExist()',
  'error ErrorStillLocked()',
  'error ErrorNoWarmup()',
  'error ErrorWarmupPending()',
  'error ErrorMiningQuotaExceeded(address user, uint256 requested, uint256 quota)',
  'error ErrorPrincipalReleaseVaultNotSet()',
  'error ErrorWarmupExitDisabled()',
  'error ErrorZeroAddress()',
  'error ErrorZeroAmount()',
  'error ErrorCallerNotAuthorized()',
] as const

/**
 * LiquidStaking 领取 / 退出（资产页用）。
 * @see 手册 §8.2 活期 LiquidStaking
 */
export const LIQUID_STAKING_ASSETS_METHODS = {
  claimPrincipal: 'function claimPrincipal(uint256 amount)',
  claimRewardMixed:
    'function claimRewardMixed(uint8 releasePlanIndex, uint256 amount, uint256 restakePlanIndex, uint256 restakeBps)',
  getStakeRewards:
    'function getStakeRewards(address user) view returns (uint256 warmupReward, uint256 activeReward)',
  stakes:
    'function stakes(address user) view returns (uint256 principal, uint256 gons, uint256 startEpoch, uint256 expiry, bool exists)',
  /**
   * liquidStake 先进 warmup；与 stakes 同形，须先解析迁移 root。
   * @see 手册 §8.2 活期 LiquidStaking
   */
  warmupStakes:
    'function warmupStakes(address user) view returns (uint256 principal, uint256 gons, uint256 startEpoch, uint256 expiry, bool exists)',
} as const

/**
 * LockedStaking 领取 / 退出（资产页用）。
 * @see 手册 §8.3 定期 LockedStaking
 */
export const LOCKED_STAKING_ASSETS_METHODS = {
  getStakesCount: 'function getStakesCount(address user) view returns (uint256)',
  getStakes:
    'function getStakes(address user, uint256 start, uint256 limit) view returns ((uint256 pending, uint256 blockReward, uint256 extraInterest, uint256 claimableBalance, uint256 expiry)[])',
  getStake:
    'function getStake(address user, uint256 index) view returns ((uint256 pending, uint256 blockReward, uint256 extraInterest, uint256 claimableBalance, uint256 expiry))',
  getReleasedPrincipal:
    'function getReleasedPrincipal(address user, uint256 index) view returns (uint256)',
  claimPrincipal: 'function claimPrincipal(uint256 index)',
  claimRewardMixed:
    'function claimRewardMixed(uint256 stakeIndex, uint256 amount, uint8 releasePlanIndex, uint256 restakePlanIndex, uint256 restakeBps)',
  claimExtraRewardMixed:
    'function claimExtraRewardMixed(uint256 stakeIndex, uint256 amount, uint8 releasePlanIndex, uint256 restakePlanIndex, uint256 restakeBps)',
} as const

/**
 * Bond / BurnBond 市场查询（质押购买页用）。
 * @see 手册 §10 债券 Bond / BurnBond
 */
export const BOND_DEPOSITORY_MARKET_METHODS = {
  discountRateBP: 'function discountRateBP() view returns (uint256)',
  terms:
    'function terms() view returns (uint256 vestingTerm, uint256 maxPayout, uint256 fee, uint256 maxDebt, uint256 totalDeposit)',
  treasury: 'function treasury() view returns (address)',
  principle: 'function principle() view returns (address)',
  liquidityPool: 'function liquidityPool() view returns (address)',
  restakeConfig: 'function restakeConfig() view returns (address)',
} as const

/**
 * Treasury — 资产估值 / 总储备。
 * @see docs/onchain-manual/contracts/treasury.md
 */
export const TREASURY_METHODS = {
  valueOf: 'function valueOf(address token, uint256 amount) view returns (uint256)',
  totalReserves: 'function totalReserves() view returns (uint256)',
} as const

/**
 * StakingPool — 质押池 TVL / epoch。
 * @see docs/onchain-manual/contracts/stakingpool.md
 */
export const STAKING_POOL_METHODS = {
  poolAgxBalance: 'function poolAgxBalance() view returns (uint256)',
  epoch:
    'function epoch() view returns (uint256 length, uint256 number, uint256 endBlock, uint256 distribute)',
} as const

/**
 * sAGX — 流通量与 rebase 历史。
 * @see docs/onchain-manual/contracts/sagx.md
 */
export const SAGX_METHODS = {
  circulatingSupply: 'function circulatingSupply() view returns (uint256)',
  totalSupply: 'function totalSupply() view returns (uint256)',
  rebases:
    'function rebases(uint256 epoch) view returns (uint256 epoch_, uint256 rebase, uint256 totalStakedBefore, uint256 totalStakedAfter, uint256 amountRebased, uint256 index, uint256 blockNumberOccured)',
} as const

/**
 * Bond / BurnBond 仓位操作（资产页用）。
 * @see 手册 §10 债券 Bond / BurnBond
 */
export const BOND_DEPOSITORY_ASSETS_METHODS = {
  getBondCount: 'function getBondCount(address depositor) view returns (uint256)',
  getBondInfo:
    'function getBondInfo(address depositor, uint256 bondIndex) view returns (uint256 payout, uint256 vesting, uint256 lastTime, uint256 pricePaid, bool exists, uint256 percentVested, uint256 payoutRemaining, uint256 vestingEndTime, uint256 currentDiscountBP, uint256 profit)',
  pendingPayoutFor:
    'function pendingPayoutFor(address depositor, uint256 bondIndex) view returns (uint256)',
  getStakeProfit:
    'function getStakeProfit(address recipient, uint256 bondIndex) view returns (uint256)',
  redeem:
    'function redeem(address recipient, uint256 bondIndex, bool shouldStake) returns (uint256)',
  claimStakeProfitMixed:
    'function claimStakeProfitMixed(address recipient, uint256 amount, uint8 releasePlanIndex, uint256 bondIndex, uint256 restakePlanIndex, uint256 restakeBps) returns (uint256)',
} as const

/**
 * Bond / BurnBond 自定义错误。
 * @see docs/onchain-manual/contracts/bonddepository.md
 * @see docs/onchain-manual/contracts/burnbonddepository.md（与 BondDepository 为同一面向用户的错误集）
 */
export const BOND_DEPOSITORY_ERRORS = [
  'error ErrorNotApproved()',
  'error ErrorDebtCapacityReached()',
  'error ErrorBondTooSmall()',
  'error ErrorBondTooLarge()',
  'error ErrorBondIndexOutOfBounds()',
  'error ErrorBondNotExist()',
  'error ErrorUserNotAuthorized()',
  'error ErrorStakeNotActive()',
  'error ErrorProfitExceedsAmount()',
  'error ErrorCallerNotAllowed(address)',
  'error ErrorPrincipalReleaseVaultNotSet()',
  'error ErrorZeroAmount()',
  'error ErrorInvalidAmount()',
  'error ErrorAmountExceedsBalance()',
  'error ErrorZeroAddress()',
  'error ErrorProfitNotAvailable()',
  'error ErrorCallerNotAuthorized()',
] as const

/**
 * RewardQueue 释放计划 — 时长 → releasePlanIndex。
 * @see 手册 §12 RewardQueue 奖励释放队列
 */
export const REWARD_QUEUE_METHODS = {
  queuePlans:
    'function queuePlans() view returns ((uint256 releaseDuration, uint256 feeRate, address feeRecipient)[])',
  getUserTotalClaimable: 'function getUserTotalClaimable(address user) view returns (uint256)',
  getReleasedRewardsWithPlanIndex:
    'function getReleasedRewardsWithPlanIndex(address user, uint8 planIndex) view returns (uint256)',
  getRewardsWithPlanIndex:
    'function getRewardsWithPlanIndex(address user, uint8 planIndex) view returns (uint256)',
  claimAllVestedRewards: 'function claimAllVestedRewards(uint8 planIndex)',
} as const

/**
 * RewardQueue 自定义错误。
 * @see docs/onchain-manual/contracts/rewardqueue.md
 */
export const REWARD_QUEUE_ERRORS = [
  'error ErrorZeroAmount()',
  'error ErrorIndexOutOfBounds()',
  'error ErrorNotAuthorized()',
  'error ErrorZeroAddress()',
] as const

/**
 * PrincipalReleaseVault — 本金线性释放到钱包 AGX。
 * @see 手册 §13 PrincipalReleaseVault 本金释放
 */
export const PRINCIPAL_RELEASE_VAULT_METHODS = {
  getReleaseCount: 'function getReleaseCount(address user) view returns (uint256)',
  getRelease:
    'function getRelease(address user, uint256 index) view returns ((uint256 amount, uint256 claimed, uint256 startTime, uint256 duration) release, uint256 claimableAmount, uint256 remainingAmount, uint256 endTime, bool fullyClaimed)',
  claimable: 'function claimable(address user, uint256 index) view returns (uint256)',
  releaseDuration: 'function releaseDuration() view returns (uint256)',
  claim: 'function claim(uint256 index)',
  claimMany: 'function claimMany(uint256 start, uint256 limit)',
} as const

/**
 * PrincipalReleaseVault 自定义错误。
 * @see docs/onchain-manual/contracts/principalreleasevault.md
 */
export const PRINCIPAL_RELEASE_VAULT_ERRORS = [
  'error ErrorZeroAddress()',
  'error ErrorZeroAmount()',
  'error ErrorNotAuthorized()',
  'error ErrorIndexOutOfBounds()',
  'error ErrorNothingToClaim()',
  'error ErrorCallerNotAuthorized()',
  'error ErrorAlreadyMigrated()',
] as const

/**
 * RestakeConfig 复投计划 — 时长 → restakePlanIndex（保留链上原始 index）。
 * @see 手册 §9 贡献值与 Mixed 领奖
 */
export const RESTAKE_CONFIG_METHODS = {
  getPlanCount: 'function getPlanCount() view returns (uint256)',
  getPlan:
    'function getPlan(uint256 index) view returns (uint256 period, uint256 taxBP, address target, bool exists)',
  agxPrice: 'function agxPrice() view returns (uint256)',
} as const

/**
 * RewardClaimer 签名领取方法。
 *
 * claimReward 签名已按链上实现验证，签名方法对应旧手册 §4.1。
 *
 * @see docs/onchain-manual-legacy.md §4.1 用户操作：签名领奖
 */
export const REWARD_CLAIMER_METHODS = {
  // 已在链上验证（实现 0x0265…fb7b，selector 0xf2ee58d4），
  // 签名方法与 docs/onchain-manual-legacy.md §4.1 一致：
  // claimReward(signType, amount, expireTime, salt, signature)。
  claimReward:
    'function claimReward(uint256 signType, uint256 amount, uint256 expireTime, bytes32 salt, bytes signature)',
  rewardSigner: 'function rewardSigner() view returns (address)',
} as const

/**
 * MarketFund — 简单签名领取。
 * @see 手册 §9.5 签名奖励
 */
export const MARKET_FUND_METHODS = {
  claimReward:
    'function claimReward(uint256 signType, uint256 amount, uint256 expireTime, bytes32 salt, bytes sign)',
} as const

/**
 * DaoPool — Mixed 签名领取；后端按 rewardType 下发 signType 41–45。
 * @see docs/backend-api/api.md #claim/dao-reward
 */
export const DAO_POOL_METHODS = {
  claimRewardsMixed:
    'function claimRewardsMixed(uint256 signType, uint256 amount, uint256 expireTime, bytes32 salt, bytes sign, uint8 releasePlanIndex, uint256 restakePlanIndex, uint256 restakeBps)',
} as const

/**
 * LuckyPool — Mixed 领取 + 暂停 / 中奖 / 轮次查询。
 * @see 手册 §14 LuckyPool 去中心化抽奖
 */
export const LUCKY_POOL_METHODS = {
  paused: 'function paused() view returns (bool)',
  currentRoundId: 'function currentRoundId() view returns (uint256)',
  purchaseTracker: 'function purchaseTracker() view returns (address)',
  isUserEligible: 'function isUserEligible(uint256 roundId, address user) view returns (bool)',
  getRound:
    'function getRound(uint256 roundId) view returns ((uint256 roundId, uint256 displayDay, uint256 startTime, uint256 endTime, uint256 rewardAmount, uint256 rewardPerWinner, uint256 maxWinners, uint256 requestId, uint256 eligibleCount, uint256 winnerCount, uint256 randomRequestBlock, uint8 status))',
  getWinnerInfo:
    'function getWinnerInfo(uint256 roundId, address user) view returns (bool won, uint256 rewardAmount)',
  rewardClaimed: 'function rewardClaimed(uint256 roundId, address user) view returns (bool)',
  claimRewardMixed:
    'function claimRewardMixed(uint256 roundId, uint8 releasePlanIndex, uint256 restakePlanIndex, uint256 restakeBps)',
} as const

/**
 * DailyPurchaseTracker — 轮内购买资格统计。
 * @see 手册 §14.1 用户抽奖页
 */
export const DAILY_PURCHASE_TRACKER_METHODS = {
  getUserRoundStat:
    'function getUserRoundStat(uint256 roundId, address user) view returns (uint256 totalAmount, bool qualified, uint256 qualifiedAt)',
} as const

/**
 * LuckyPool 自定义错误（用户领取路径）。
 * @see docs/onchain-manual/contracts/aegisluckypool.md
 */
export const LUCKY_POOL_ERRORS = [
  'error ErrorPaused()',
  'error ErrorNotWinner(uint256 roundId, address user)',
  'error ErrorRewardAlreadyClaimed(uint256 roundId, address user)',
  'error ErrorRestakeConfigNotSet()',
  'error ErrorRewardQueueNotSet()',
  'error ErrorInsufficientContribution(address user, uint256 required, uint256 available)',
] as const

/**
 * AegisPresaleRewardClaimer 自定义错误。
 * @see docs/onchain-manual-legacy.md §4.4 自定义错误
 */
export const REWARD_CLAIMER_ERRORS = [
  'error ErrorZeroAddress()',
  'error ErrorZeroAmount()',
  'error ErrorInvalidSigner()',
  'error ErrorAlreadyUsed()',
  'error ErrorSignatureExpired()',
] as const

/** OpenZeppelin ERC20 自定义错误（selector 已在 contract-error-message 中验证）。 */
export const ERC20_ERRORS = [
  'error ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed)',
  'error ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed)',
] as const

/**
 * AegisPreSale 自定义错误。
 * @see docs/onchain-manual-legacy.md §3 模块二：创世预售（AegisPreSale）
 */
export const PRESALE_ERRORS = [
  'error PreSalePaused()',
  'error PreSaleUserNotBound()',
  'error PreSaleInvalidAmount()',
  'error PreSalePhaseIndexOutOfBounds(uint256 phaseIndex, uint256 phaseCount)',
  'error PreSalePhaseNotActive(uint256 phaseIndex)',
  'error PreSaleBelowMin(uint256 phaseIndex)',
  'error PreSalePhaseSoldOut(uint256 phaseIndex)',
  'error PreSaleZeroAddress()',
  'error PreSaleInvalidDiscount(uint256 discount)',
  'error PreSaleInvalidAirdropValueRatio(uint256 ratio)',
  'error PreSaleInvalidAgxPrice(uint256 price)',
  'error PreSaleUserPurchaseLimitExceeded(uint256 phaseIndex, uint256 limit, uint256 currentAmount, uint256 attemptedAmount)',
] as const

/**
 * AegisReferral 自定义错误。
 * @see docs/onchain-manual-legacy.md §2.4 自定义错误
 */
export const REFERRAL_ERRORS = [
  'error Referral__RootZero()',
  'error Referral__UserZero()',
  'error Referral__ParentZero()',
  'error Referral__SelfReferral()',
  'error Referral__AlreadyBound(address user)',
  'error Referral__ParentNotBound(address parent)',
  'error Referral__MigratedAccount(address account)',
  'error Referral__NotMigrationManager(address caller)',
] as const
