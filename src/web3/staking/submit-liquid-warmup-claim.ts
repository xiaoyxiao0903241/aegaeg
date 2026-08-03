import { evaluateLiquidWarmupClaimLive } from '~/core/staking/staking-block-reasons'
import { invalidateAfterStaking } from '~/shared/api/query/invalidate'
import { STAKING_BLOCKED } from '~/web3/errors/write-block-errors'
import { stakePoolAddress } from '~/web3/staking/staking-addresses'
import { readStakeOpenPreflight } from '~/web3/staking/staking-read'
import { claimLiquidWarmup } from '~/web3/staking/staking-write'
import type { WriteSession } from '~/web3/wallet/require-write-session'

/** 活期 warmup 激活：live `isWarmupExpired` 通过后再写。 */
export async function submitLiquidWarmupClaim(args: { session: WriteSession }): Promise<void> {
  const { wallet, address, readClient } = args.session
  const pool = stakePoolAddress('liquid')
  const preflight = await readStakeOpenPreflight({
    pool,
    isLiquid: true,
    user: address,
    client: readClient,
  })
  if (evaluateLiquidWarmupClaimLive(preflight.isWarmupExpired)) {
    throw STAKING_BLOCKED.unavailable
  }
  await claimLiquidWarmup({ wallet })
  invalidateAfterStaking()
}
