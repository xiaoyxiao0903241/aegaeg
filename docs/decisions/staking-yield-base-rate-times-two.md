# 质押日收益读配置利率 × 2

> **状态：现行**  
> 触发：Hub / Stake / Bond / 测算器展示收益率仍扫 `sAGX.rebases[]` 历史实际利率。

## 裁决

展示用 rebase 只读 `RewardManager.baseRewardRate()`（ppm）。  
日收益 = 链上读到的单次利率 × 2（prod 现为 2500 ppm → 0.25%/次 → **0.50%/日**）。

倒计时 / TVL / 国库仍走 `StakingPool.epoch()` 等概览读，不与收益日频混用。  
手册仍写 `rebases()`；**本仓展示按产品裁决改读配置**。入仓手册正文不改。

## 不要做

- 不要用 `epoch.length × BSC_BLOCK_SECONDS` 推日频来算收益
- 不要改写链、领取、质押成交金额
- 不要改 X 挖矿 `yieldRateBP`
