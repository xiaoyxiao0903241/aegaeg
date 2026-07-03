export const ERC20_METHODS = {
  balanceOf: 'function balanceOf(address owner) view returns (uint256)',
  allowance: 'function allowance(address owner, address spender) view returns (uint256)',
  approve: 'function approve(address spender, uint256 amount) returns (bool)',
  decimals: 'function decimals() view returns (uint8)',
  mint: 'function mint(address to, uint256 amount)',
} as const

export const ROUTER_V2_METHODS = {
  getAmountsOut: 'function getAmountsOut(uint256 amountIn, address[] memory path) view returns (uint256[] memory amounts)',
  swapExactTokensForTokensSupportingFeeOnTransferTokens:
    'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline)',
} as const

/** PancakeSwap V3 — field order matches on-chain IQuoterV2 / ISwapRouter structs */
export const QUOTER_V3_METHODS = {
  quoteExactInputSingle:
    'function quoteExactInputSingle((address tokenIn, address tokenOut, uint256 amountIn, uint24 fee, uint160 sqrtPriceLimitX96)) external returns (uint256 amountOut, uint160 sqrtPriceX96After, uint32 initializedTicksCrossed, uint256 gasEstimate)',
} as const

/** Pancake V3 SwapRouter — includes deadline (selector 0x414bf389); 7-field tuple reverts with empty 0x */
export const SWAP_ROUTER_V3_METHODS = {
  exactInputSingle:
    'function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)',
} as const

export const POOL_V3_METHODS = {
  fee: 'function fee() view returns (uint24)',
  token0: 'function token0() view returns (address)',
  token1: 'function token1() view returns (address)',
  slot0:
    'function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)',
} as const

export const PAIR_V2_METHODS = {
  getReserves:
    'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  token0: 'function token0() view returns (address)',
  token1: 'function token1() view returns (address)',
} as const

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
  purchase: 'function purchase(uint256 _phaseIndex, uint256 _amount)',
} as const

export const MULTICALL3_METHODS = {
  aggregate3:
    'function aggregate3((address target, bool allowFailure, bytes callData)[] calls) payable returns ((bool success, bytes returnData)[] returnData)',
} as const

export const REFERRAL_METHODS = {
  isBindReferral: 'function isBindReferral(address user) view returns (bool)',
  getReferral: 'function getReferral(address user) view returns (address)',
  getReferralCount: 'function getReferralCount(address user) view returns (uint256)',
  getChildren: 'function getChildren(address user) view returns (address[])',
  bindReferral: 'function bindReferral(address referrer)',
} as const

export const USD1_SWAP_METHODS = {
  quoteUsd1Out: 'function quoteUsd1Out(uint256 usdtAmount) view returns (uint256)',
  swap: 'function swap(uint256 usdtAmount, uint256 minUsd1Out)',
  rateBps: 'function rateBps() view returns (uint256)',
  paused: 'function paused() view returns (bool)',
  getConfig:
    'function getConfig() view returns (address usdtToken, address usd1Token, address wallet, uint256 currentRateBps, uint8 usdtDec, uint8 usd1Dec, bool isPaused, uint256 minIn, uint256 maxIn, uint256 reserve)',
} as const

export const REWARD_CLAIMER_METHODS = {
  // Verified on-chain (impl 0x0265…fb7b, selector 0xf2ee58d4) and per
  // contract.md §4.1: claimReward(signType, amount, expireTime, salt, signature).
  claimReward:
    'function claimReward(uint256 signType, uint256 amount, uint256 expireTime, bytes32 salt, bytes signature)',
  rewardSigner: 'function rewardSigner() view returns (address)',
} as const

/** OpenZeppelin ERC20 custom errors — selectors verified in resolve-contract-error-message. */
export const ERC20_ERRORS = [
  'error ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed)',
  'error ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed)',
] as const

/** AegisPreSale custom errors — see docs/contract.md §3. */
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

/** AegisReferral custom errors — see docs/contract.md §2.4. */
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

/** AegisPresaleRewardClaimer custom errors — see docs/contract.md §4.4. */
export const REWARD_CLAIMER_ERRORS = [
  'error ErrorZeroAddress()',
  'error ErrorZeroAmount()',
  'error ErrorInvalidSigner()',
  'error ErrorAlreadyUsed()',
  'error ErrorSignatureExpired()',
] as const

export const MAX_UINT256 = 2n ** 256n - 1n
