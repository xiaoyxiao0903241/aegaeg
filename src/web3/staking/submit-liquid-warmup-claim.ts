import { evaluateLiquidWarmupClaimLive } from '~/core/staking/staking-block-reasons'
import { invalidateAfterStaking } from '~/shared/api/query/invalidate'
import { STAKING_BLOCKED } from '~/web3/errors/write-block-errors'
import { stakePoolAddress } from '~/web3/staking/staking-addresses'
import { readStakeOpenPreflight } from '~/web3/staking/staking-read'
import { claimLiquidWarmup } from '~/web3/staking/staking-write'
import type { WriteSession } from '~/web3/wallet/require-write-session'

/**
 * 活期 warmup 激活提交流程
 *
 * 先重读 `isWarmupExpired` 做实时预检：未过期则抛阻断，
 * 通过才调用 claim 写入，随后失效相关质押缓存。
 *
 * @param args.session 写会话（钱包 / 地址）
 * @see 手册 §8.2 活期 LiquidStaking
 */
export async function submitLiquidWarmupClaim(args: { session: WriteSession }): Promise<void> {
  const { wallet, address } = args.session
  const pool = stakePoolAddress('liquid')
  const preflight = await readStakeOpenPreflight({
    pool,
    isLiquid: true,
    user: address,
  })
  if (evaluateLiquidWarmupClaimLive(preflight.isWarmupExpired)) {
    throw STAKING_BLOCKED.unavailable
  }
  await claimLiquidWarmup({ wallet })
  invalidateAfterStaking()
}
